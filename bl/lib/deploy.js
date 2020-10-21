'use strict';

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */
const request = require("request");
const async = require("async");
const sdk = require('../../lib/sdk');

function computeErrorMessageFromService(body) {
	if (body || (body && !body.result)) {
		let error = "";
		if (body.errors && body.errors && body.errors.details && body.errors.details.length > 0) {
			body.errors.details.forEach((detail) => {
				if (error === "") {
					error += " " + detail.message;
				} else {
					error += " - " + detail.message;
				}
			});
		}
		return new Error(error);
	} else {
		return new Error(" Service not found");
	}
}

let lib = {
	
	"cleanLabel": (label) => {
		if (!label) {
			return '';
		}
		return label.replace(/\//g, "__slash__");
	},
	
	"computeEnvVariables": (soajs, modelObj, opts, config, bl, cb) => {
		// let opts = {
		// 	item: item,
		// 	deploy: results.get_deploy,
		// 	repoInfo: results.get_src,
		// 	recipe: results.get_catalog_recipe,
		// 	registry: results.get_env_record
		// };
		
		//let envVariables = [];
		if (!config.env) {
			config.env = [];
		}
		if (opts.repoInfo && opts.repoInfo.owner) {
			let env_variables = ["SOAJS_GIT_OWNER", "SOAJS_GIT_BRANCH", "SOAJS_GIT_COMMIT", "SOAJS_GIT_REPO", "SOAJS_GIT_PROVIDER", "SOAJS_GIT_TOKEN", "SOAJS_GIT_DOMAIN"];
			config.env.push({
				"name": env_variables[0],
				"value": opts.repoInfo.owner
			});
			
			config.env.push({
				"name": env_variables[1],
				"value": opts.deploy.src.branch || opts.deploy.src.tag
			});
			
			if (opts.deploy.src.commit) {
				config.env.push({
					"name": env_variables[2],
					"value": opts.deploy.src.commit
				});
			}
			
			config.env.push({
				"name": env_variables[3],
				"value": opts.repoInfo.name
			});
			
			config.env.push({
				"name": env_variables[4],
				"value": opts.repoInfo.provider
			});
			
			if (opts.repoInfo.token) {
				config.env.push({
					"name": env_variables[5],
					"value": opts.repoInfo.token
				});
			}
			
			config.env.push({
				"name": env_variables[6],
				"value": opts.repoInfo.domain
			});
		}
		if (opts.recipe.recipe &&
			opts.recipe.recipe.buildOptions &&
			opts.recipe.recipe.buildOptions.env &&
			Object.keys(opts.recipe.recipe.buildOptions.env).length > 0
		) {
			let computedEnvVariables = {};
			for (let env in opts.recipe.recipe.buildOptions.env) {
				if (opts.recipe.recipe.buildOptions.env[env] && opts.recipe.recipe.buildOptions.env.hasOwnProperty(env) &&
					opts.recipe.recipe.buildOptions.env[env].type === "computed") {
					computedEnvVariables[opts.recipe.recipe.buildOptions.env[env].value] = env;
				}
			}
			async.parallel([
				function (call) {
					let env_variables = ["$SOAJS_EXTKEY"];
					if (computedEnvVariables[env_variables[0]]) {
						
						soajs.awareness.connect('multitenant', "1", function (res) {
							let options = {
								method: "get",
								uri: "http://" + res.host + "/tenant/console",
								headers: res.headers,
								json: true,
								qs: {
									code: "DBTN"
								}
							};
							request(options, (error, response, tenant) => {
								if (error || !tenant.result) {
									return call(bl.marketplace.handleError(soajs, 503, computeErrorMessageFromService(tenant)));
								}
								let extKey = null;
								if (tenant.data && tenant.data.applications) {
									let app = tenant.data.applications[0];
									if (app.keys) {
										let key = app.keys[0];
										if (key.extKeys) {
											let oneKey = key.extKeys[0];
											extKey = oneKey.extKey;
										}
									}
								}
								
								if (computedEnvVariables[env_variables[0]]) {
									config.env.push({
										"name": computedEnvVariables[env_variables[0]],
										"value": extKey
									});
									if (!extKey) {
										return call(bl.marketplace.handleError(soajs, 422, new Error(computedEnvVariables[env_variables[0]] + " computed variable was not found")));
									}
								}
								return call();
							});
						});
					} else {
						return call();
					}
				},
				function (call) {
					let env_variables = ["$SOAJS_NX_DOMAIN", "$SOAJS_NX_SITE_DOMAIN", "$SOAJS_NX_API_DOMAIN"];
					if (computedEnvVariables[env_variables[0]] ||
						computedEnvVariables[env_variables[1]] ||
						computedEnvVariables[env_variables[2]]) {
						
						if (computedEnvVariables[env_variables[0]]) {
							config.env.push({
								"name": computedEnvVariables[env_variables[0]],
								"value": opts.registry.domain
							});
							if (!opts.registry.domain) {
								return call(bl.marketplace.handleError(soajs, 422, new Error(computedEnvVariables[env_variables[0]] + " computed variable was not found")));
							}
						}
						if (computedEnvVariables[env_variables[1]]) {
							config.env.push({
								"name": computedEnvVariables[env_variables[1]],
								"value": opts.registry.sitePrefix + "." + opts.registry.domain
							});
							if (!opts.registry.sitePrefix || !opts.registry.domain) {
								return call(bl.marketplace.handleError(soajs, 422, new Error(computedEnvVariables[env_variables[1]] + " computed variable was not found")));
							}
						}
						if (computedEnvVariables[env_variables[2]]) {
							config.env.push({
								"name": computedEnvVariables[env_variables[2]],
								"value": opts.registry.apiPrefix + "." + opts.registry.domain
							});
							if (!opts.registry.apiPrefix || !opts.registry.domain) {
								return call(bl.marketplace.handleError(soajs, 422, new Error(computedEnvVariables[env_variables[2]] + " computed variable was not found")));
							}
						}
					}
					return call();
				},
				function (call) {
					let env_variables = ["$SOAJS_SRV_PORT", "$SOAJS_SRV_PORT_MAINTENANCE"];
					if (opts.item.type === "service" && opts.recipe.recipe.buildOptions.env[env_variables[0]] ||
						computedEnvVariables[env_variables[1]]) {
						
						if (computedEnvVariables[env_variables[0]]) {
							config.env.push({
								"name": computedEnvVariables[env_variables[0]],
								"value": opts.item.configuration.port.toString()
							});
							if (!opts.item.configuration.port.toString()) {
								return call(bl.marketplace.handleError(soajs, 422, new Error(computedEnvVariables[env_variables[0]] + " computed variable was not found")));
							}
						}
						let temp = {};
						if (computedEnvVariables[env_variables[1]]) {
							if (opts.version.maintenance &&
								opts.version.maintenance.port &&
								opts.version.maintenance.port.type) {
								if (opts.version.maintenance.port.type === "inherit") {
									temp = {
										"name": computedEnvVariables[env_variables[1]],
										"value": opts.item.configuration.port.toString()
									};
								} else if (opts.version.maintenance.port.type === "maintenance") {
									temp = {
										"name": computedEnvVariables[env_variables[1]],
										"value": (opts.item.configuration.port + opts.registry.services.config.ports.maintenanceInc).toString()
									};
								} else {
									temp = {
										"name": computedEnvVariables[env_variables[1]],
										"value": opts.version.maintenance.port.value.toString()
									};
								}
								
							} else {
								temp = {
									"name": computedEnvVariables[env_variables[1]],
									"value": (opts.item.configuration.port + opts.registry.services.config.ports.maintenanceInc).toString()
								};
							}
							if (!temp.value) {
								return call(bl.marketplace.handleError(soajs, 422, new Error(temp.name + " computed variable was not found")));
							}
							config.env.push(temp);
						}
					}
					return call();
				},
				function (call) {
					let env_variables = ["$SOAJS_ENV", "$SOAJS_DAEMON_GRP_CONF", "$SOAJS_SERVICE_NAME", "$SOAJS_NX_CONTROLLER_PORT", "$SOAJS_CONTROLLER_PORT_MAINTENANCE", "$SOAJS_DEPLOY_HA"];
					if (computedEnvVariables[env_variables[0]]) {
						config.env.push({
							"name": computedEnvVariables[env_variables[0]],
							"value": opts.registry.code.toLowerCase()
						});
						if (!opts.registry.code.toLowerCase()) {
							return call(bl.marketplace.handleError(soajs, 422, new Error(computedEnvVariables[env_variables[0]] + " computed variable was not found")));
						}
					}
					if (computedEnvVariables[env_variables[1]]) {
						//todo
					}
					
					if (computedEnvVariables[env_variables[2]]) {
						config.env.push({
							"name": computedEnvVariables[env_variables[2]],
							"value": opts.item.name
						});
						if (!opts.item.name) {
							return call(bl.marketplace.handleError(soajs, 422, new Error(computedEnvVariables[env_variables[2]] + " computed variable was not found")));
						}
					}
					if (computedEnvVariables[env_variables[3]]) {
						config.env.push({
							"name": computedEnvVariables[env_variables[3]],
							"value": opts.registry.services.config.ports.controller.toString()
						});
						if (!opts.registry.services.config.ports.controller) {
							return call(bl.marketplace.handleError(soajs, 422, new Error(computedEnvVariables[env_variables[4]] + " computed variable was not found")));
						}
					}
					if (computedEnvVariables[env_variables[4]]) {
						config.env.push({
							"name": computedEnvVariables[env_variables[4]],
							"value": (opts.registry.services.config.ports.controller + opts.registry.services.config.ports.maintenanceInc).toString()
						});
						if (!opts.registry.services.config.ports.controller || !opts.registry.services.config.ports.maintenanceInc) {
							return call(bl.marketplace.handleError(soajs, 422, new Error(computedEnvVariables[env_variables[5]] + " computed variable was not found")));
						}
					}
					if (computedEnvVariables[env_variables[5]]) {
						config.env.push({
							"name": computedEnvVariables[env_variables[5]],
							"value": opts.registry.deployer.selected.split(".")[1]
						});
						if (!opts.registry.deployer.selected || !opts.registry.deployer.selected.split(".")[1]) {
							return call(bl.marketplace.handleError(soajs, 422, new Error(computedEnvVariables[env_variables[6]] + " computed variable was not found")));
						}
					}
					return call();
				},
				function (call) {
					let env_variables = ["$SOAJS_NX_CONTROLLER_IP", "$SOAJS_REGISTRY_API"];
					if (computedEnvVariables[env_variables[0]] ||
						computedEnvVariables[env_variables[1]]) {
						soajs.awareness.connect("infra", "1", (response) => {
							if (response && response.host) {
								opts.host = {
									infra: response
								};
								let labelSelector;
								if (opts.registry.services.config.ports.name) {
									labelSelector = 'soajs.env.code=' + opts.registry.code.toLowerCase() + ', soajs.service.name=' + opts.registry.services.config.ports.name;
								} else {
									labelSelector = 'soajs.env.code=' + opts.registry.code.toLowerCase() + ', soajs.service.name=' + "controller";
								}
								let options = {
									method: "get",
									uri: "http://" + response.host + "/kubernetes/services/Service",
									headers: response.headers,
									json: true,
									qs: {
										configuration: {
											env: opts.registry.code.toLowerCase()
										},
										filter: {
											labelSelector
										},
										limit: 100
									}
								};
								request(options, (error, res, body) => {
									if (error || !body.result) {
										return call(bl.marketplace.handleError(soajs, 503, computeErrorMessageFromService(body)));
									}
									if (!body.data || !body.data.items || body.data.items.length === 0 ||
										!body.data.items[0].metadata || !body.data.items[0].metadata.name ||
										!body.data.items[0].spec) {
										return call(bl.marketplace.handleError(soajs, 411, null));
									}
									if (computedEnvVariables[env_variables[0]]) {
										if (!body.data.items[0].spec.clusterIP) {
											return call(bl.marketplace.handleError(soajs, 422, new Error(computedEnvVariables[env_variables[0]] + " computed variable was not found")));
										}
										config.env.push({
											"name": computedEnvVariables[env_variables[0]],
											"value": body.data.items[0].spec.clusterIP
										});
									}
									if (computedEnvVariables[env_variables[1]]) {
										if (!body.data.items[0].spec.clusterIP || !opts.registry.services.config.ports.controller || !opts.registry.services.config.ports.maintenanceInc) {
											return call(bl.marketplace.handleError(soajs, 422, new Error(computedEnvVariables[env_variables[1]] + " computed variable was not found")));
										}
										let gatewayRegistryPort = opts.registry.services.config.ports.controller + opts.registry.services.config.ports.maintenanceInc;
										config.env.push({
											"name": computedEnvVariables[env_variables[1]],
											"value": body.data.items[0].spec.clusterIP + ":" + gatewayRegistryPort
										});
									}
									return call();
								});
							} else {
								return call();
							}
						});
					} else {
						return call();
					}
				},
				function (call) {
					if (!opts.deploy.recipe.sourceCode) {
						return call();
					}
					let options = {
						name: opts.deploy.recipe.sourceCode.catalog,
						type: "config"
					};
					modelObj.getItem(options, (err, configItem) => {
						if (err) {
							return call(bl.marketplace.handleError(soajs, 602, err));
						}
						if (!configItem) {
							return call(bl.marketplace.handleError(soajs, 417, null));
						}
						if (!configItem.versions || configItem.versions.length === 0) {
							return call(bl.marketplace.handleError(soajs, 417, null));
						}
						let found = false;
						//check if branch and version is found in conf catalog item
						configItem.versions.forEach((oneVersion) => {
							if (oneVersion.version === opts.deploy.recipe.sourceCode.version) {
								found = true;
								if (opts.deploy.recipe.sourceCode.branch) {
									if (!oneVersion.branches || oneVersion.branches.indexOf(opts.deploy.recipe.sourceCode.branch) === -1) {
										found = false;
									}
									
								} else if (opts.deploy.recipe.sourceCode.tag) {
									if (!oneVersion.tags || oneVersion.tags.indexOf(opts.deploy.recipe.sourceCode.tag) === -1) {
										found = false;
									}
								} else {
									found = false;
								}
							}
						});
						if (!found) {
							return call(bl.marketplace.handleError(soajs, 417, null));
						}
						soajs.awareness.connect('repositories', '1', function (res) {
							let options = {
								method: "get",
								uri: "http://" + res.host + "/git/repo/info",
								headers: res.headers,
								json: true,
								qs: {
									id: opts.deploy.recipe.sourceCode.id,
								}
							};
							request(options, (error, response, repo) => {
								if (error || !repo.result) {
									return call(bl.marketplace.handleError(soajs, 503, computeErrorMessageFromService(repo)));
								}
								if (!repo && !repo.data && !repo.data.owner) {
									return call(bl.marketplace.handleError(soajs, 412, null));
								}
								let env_variables = ["SOAJS_CONFIG_REPO_OWNER", "SOAJS_CONFIG_REPO_BRANCH", "SOAJS_CONFIG_REPO_COMMIT", "SOAJS_CONFIG_REPO_NAME", "SOAJS_CONFIG_REPO_PROVIDER", "SOAJS_CONFIG_REPO_TOKEN", "SOAJS_CONFIG_REPO_DOMAIN"];
								config.env.push({
									"name": env_variables[0],
									"value": repo.data.owner
								});
								
								config.env.push({
									"name": env_variables[1],
									"value": opts.deploy.recipe.sourceCode.branch || opts.deploy.recipe.sourceCode.tag
								});
								if (opts.deploy.recipe.sourceCode.branch && opts.deploy.recipe.sourceCode.commit) {
									config.env.push({
										"name": env_variables[2],
										"value": opts.deploy.recipe.sourceCode.commit
									});
								}
								config.env.push({
									"name": env_variables[3],
									"value": repo.data.name
								});
								
								config.env.push({
									"name": env_variables[4],
									"value": repo.data.provider
								});
								
								if (repo.data.token) {
									config.env.push({
										"name": env_variables[5],
										"value": repo.data.token
									});
								}
								
								config.env.push({
									"name": env_variables[6],
									"value": repo.data.domain
								});
								return call();
							});
						});
					});
				},
			], (err) => {
				if (err) {
					return cb(err);
				}
				
				async.forEachOf(opts.recipe.recipe.buildOptions.env, function (obj, key, callback) {
					if (obj.type === 'static') {
						config.env.push({
							"name": key,
							"value": obj.value
						});
					} else {
						if (obj.type === 'userInput' && opts.deploy.recipe.env && opts.deploy.recipe.env[key]) {
							config.env.push({
								"name": key,
								"value": opts.deploy.recipe.env[key]
							});
						} else if (obj.type === 'secret' && opts.deploy.recipe.env && opts.deploy.recipe.env[key]) {
							config.env.push({
								"name": key,
								"valueFrom": {
									secretKeyRef: {
										"name": opts.deploy.recipe.env[key].name,
										"key": opts.deploy.recipe.env[key].key
									}
								}
							});
						}
					}
					callback();
				}, () => {
					return cb(null, opts.host ? opts.host : true);
				});
			});
		} else {
			return cb(null, opts.host ? opts.host : true);
		}
	},
	
	"computeDeployObject": (soajs, opts, config, bl, cb) => {
		// let opts = {
		// 	item: item,
		// 	deploy: results.get_deploy,
		// 	repoInfo: results.get_src,
		// 	recipe: results.get_catalog_recipe,
		// 	registry: results.get_env_record
		// };
		config.catalog = {
			id: opts.recipe._id.toString(),
			version: opts.recipe.v ? opts.recipe.v.toString() : "1",
		};
		if (opts.recipe.recipe.deployOptions.image.shell) {
			let regexp = new RegExp(/^(shell\/)([A-Za-z0-9\/_.]*)$/);
			if (regexp.test(opts.recipe.recipe.deployOptions.image.shell)) {
				config.catalog.shell = opts.recipe.recipe.deployOptions.image.shell;
			} else {
				config.catalog.shell = "shell" + opts.recipe.recipe.deployOptions.image.shell;
			}
		} else {
			config.catalog.shell = "shell/bin/bash";
		}
		config.item = {
			env: opts.registry.code.toLowerCase(),
			name: opts.item.name,
			type: opts.item.type,
			version: opts.deploy.version
		};
		if (opts.item.configuration) {
			if (opts.item.configuration.group) {
				config.item.group = opts.item.configuration.group;
			}
			if (opts.item.configuration.subType) {
				config.item.subtype = opts.item.configuration.subType;
			}
		}
		
		if (opts.deploy.src && opts.repoInfo) {
			config.src = {
				repo: opts.repoInfo.name.toLowerCase(),
				owner: opts.repoInfo.owner.toLowerCase(),
				from: {}
			};
			if (opts.deploy.src.tag) {
				config.src.from.tag = opts.deploy.src.tag.toLowerCase();
			} else {
				if (opts.deploy.src.branch) {
					config.src.from.branch = opts.deploy.src.branch.toLowerCase();
				}
				if (opts.deploy.src.commit) {
					config.src.from.commit = opts.deploy.src.commit;
				}
			}
		}
		
		config.mode = opts.deploy.settings.mode;
		if (config.mode === 'CronJob') {
			if (opts.deploy.settings.concurrencyPolicy) {
				config.catalog.concurrencyPolicy = opts.deploy.settings.concurrencyPolicy;
			}
			if (opts.deploy.settings.schedule) {
				config.catalog.schedule = opts.deploy.settings.schedule;
			}
			if (opts.deploy.settings.restartPolicy) {
				config.catalog.restartPolicy = opts.deploy.settings.restartPolicy;
			}
		}
		if (opts.recipe.recipe.deployOptions.labels) {
			config.labels = opts.recipe.recipe.deployOptions.labels;
		}
		config.image = {
			name: opts.recipe.recipe.deployOptions.image.prefix + "/" + opts.recipe.recipe.deployOptions.image.name + ":" + opts.recipe.recipe.deployOptions.image.tag,
			imagePullPolicy: opts.recipe.recipe.deployOptions.image.pullPolicy || "always"
		};
		if (opts.recipe.recipe.deployOptions.image.override && opts.deploy.recipe.image) {
			config.image.name = opts.deploy.recipe.image.prefix + "/" + opts.deploy.recipe.image.name + ":" + opts.deploy.recipe.image.tag;
		}
		if (opts.recipe.recipe.deployOptions.image.registrySecret) {
			config.image.secret = opts.recipe.recipe.deployOptions.image.registrySecret;
		}
		if (opts.deploy.recipe.readinessProbe) {
			config.readinessProbe = opts.deploy.recipe.readinessProbe;
		}
		if (opts.deploy.recipe.livenessProbe) {
			config.livenessProbe = opts.deploy.recipe.livenessProbe;
		}
		
		if (opts.recipe.recipe.deployOptions.securityContext && (opts.recipe.recipe.deployOptions.securityContext.container || opts.recipe.recipe.deployOptions.securityContext.pod)) {
			config.securityContext = {};
			if (opts.recipe.recipe.deployOptions.securityContext.container) {
				config.securityContext.container = opts.recipe.recipe.deployOptions.securityContext.container;
			}
			if (opts.recipe.recipe.deployOptions.securityContext.pod) {
				config.securityContext.pod = opts.recipe.recipe.deployOptions.securityContext.pod;
			}
		}
		
		if (opts.recipe.recipe.buildOptions.cmd && opts.recipe.recipe.buildOptions.cmd.deploy) {
			if (opts.recipe.recipe.buildOptions.cmd.deploy.command) {
				config.command = opts.recipe.recipe.buildOptions.cmd.deploy.command;
			}
			if (opts.recipe.recipe.buildOptions.cmd.deploy.args) {
				config.args = opts.recipe.recipe.buildOptions.cmd.deploy.args;
			}
		}
		if (opts.recipe.recipe.deployOptions.container && opts.recipe.recipe.deployOptions.container.workingDir) {
			config.workingDir = opts.recipe.recipe.deployOptions.container.workingDir;
		}
		if (opts.recipe.recipe.deployOptions.voluming && opts.recipe.recipe.deployOptions.voluming.length > 0) {
			config.volume = {
				volumeMounts: [],
				volumes: []
			};
			opts.recipe.recipe.deployOptions.voluming.forEach((oneVolume) => {
				if (oneVolume.kubernetes) {
					if (oneVolume.kubernetes.volumeMount) {
						config.volume.volumeMounts.push(oneVolume.kubernetes.volumeMount);
					}
					if (oneVolume.kubernetes.volume) {
						config.volume.volumes.push(oneVolume.kubernetes.volume);
					}
				}
			});
		}
		if (opts.deploy.settings.replicas) {
			config.replicas = opts.deploy.settings.replicas;
		}
		//fill ports
		
		if (opts.item.type === "service") {
			config.service = {
				ports: []
			};
			config.ports = [];
			let maintenance = opts.version.maintenance;
			config.service.ports.push({
				name: "service-port",
				protocol: "TCP",
				target: opts.item.configuration.port,
				port: opts.item.configuration.port,
			});
			config.ports.push({
				"name": 'service',
				"containerPort": opts.item.configuration.port
			});
			if (maintenance && maintenance.port && maintenance.port.type) {
				if (maintenance.port.type === "custom") {
					config.service.ports.push({
						name: "maintenance-port",
						target: maintenance.port.value,
						protocol: "TCP",
						port: maintenance.port.value,
					});
					config.ports.push({
						"name": 'maintenance',
						"containerPort": maintenance.port.value
					});
				} else if (maintenance.port.type === "maintenance") {
					config.service.ports.push({
						name: "maintenance-port",
						target: opts.item.configuration.port + opts.registry.services.config.ports.maintenanceInc,
						protocol: "TCP",
						port: opts.item.configuration.port + opts.registry.services.config.ports.maintenanceInc,
					});
					config.ports.push({
						"name": 'maintenance',
						"containerPort": opts.item.configuration.port + opts.registry.services.config.ports.maintenanceInc
					});
				}
			}
			//inherit, check readinessProb if port is inherit then change it to service for backward compatibility
			if (config.readinessProbe && config.readinessProbe.httpGet && config.readinessProbe.httpGet.port === "inherit") {
				config.readinessProbe.httpGet.port = "service";
			}
		}
		if (opts.deploy.recipe.ports && opts.deploy.recipe.ports.values && opts.deploy.recipe.ports.values.length > 0) {
			if (!config.service) {
				config.service = {
					ports: []
				};
			}
			if (!config.ports) {
				config.ports = [];
			}
			config.service.type = opts.deploy.recipe.ports.portType;
			if (config.service.type !== "Internal" && opts.deploy.recipe.ports.externalTrafficPolicy) {
				config.service.externalTrafficPolicy = opts.deploy.recipe.ports.externalTrafficPolicy;
			}
			if (opts.item.type === "service" || config.service.type === "Internal") {
				delete config.service.type;
			}
			opts.deploy.recipe.ports.values.forEach((onePortEntry, portIndex) => {
				config.ports.push({
					name: onePortEntry.name || 'port' + portIndex,
					"containerPort": onePortEntry.target
				});
				if (opts.deploy.recipe.ports.portType) {
					let portConfig = {
						protocol: ((onePortEntry.protocol) ? onePortEntry.protocol.toUpperCase() : 'TCP'),
						name: onePortEntry.name || 'port' + portIndex,
						port: onePortEntry.port || onePortEntry.target,
						targetPort: onePortEntry.target,
					};
					if (config.service.type === "NodePort") {
						portConfig.nodePort = onePortEntry.published || portConfig.targetPort;
					}
					config.service.ports.push(portConfig);
				}
			});
			if (config.service.ports.length === 0) {
				delete config.service;
			}
		}
		cb(null, config);
	},
	
	"getSourceInformation": (soajs, opts, bl, cb) => {
		soajs.awareness.connect('repositories', '1', function (res) {
			let options = {
				method: "get",
				uri: "http://" + res.host + "/git/repo/info",
				headers: res.headers,
				json: true,
				qs: {
					id: opts.deploy.src.id,
				}
			};
			request(options, (error, response, repo) => {
				if (error || !repo.result) {
					return cb(bl.marketplace.handleError(soajs, 503, computeErrorMessageFromService(repo)));
				}
				if (!repo || !repo.data || !repo.data.owner) {
					return cb(bl.marketplace.handleError(soajs, 412, null));
				}
				return cb(null, repo.data);
			});
		});
	},
	
	"deployObject": (soajs, opts, config, bl, cb) => {
		let url = "/kubernetes/item/deploy/soajs";
		if (config.mode === 'CronJob') {
			url = "/kubernetes/item/deploy/soajs/cronjob";
		}
		if (config && config.src && config.src.from && config.src.from.branch) {
			config.src.from.branch = lib.cleanLabel(config.src.from.branch);
		}
		let options = {
			method: "post",
			json: true,
			qs: {
				configuration: {
					env: opts.env.toLowerCase()
				}
			},
			body: {recipe: config}
		};
		if (opts.host && opts.host.infra) {
			options.uri = "http://" + opts.host.infra.host + url;
			options.headers = opts.host.infra.headers;
			request(options, (error, response, body) => {
				if (error || !body.result) {
					return cb(bl.marketplace.handleError(soajs, 503, computeErrorMessageFromService(body)));
				}
				return cb(null, body.data);
			});
		} else {
			soajs.awareness.connect('infra', '1', function (res) {
				options.uri = "http://" + res.host + url;
				options.headers = res.headers;
				request(options, (error, response, body) => {
					if (error || !body.result) {
						return cb(bl.marketplace.handleError(soajs, 503, computeErrorMessageFromService(body)));
					}
					return cb(null, body.data);
				});
			});
		}
	},
	
	"startProcessing": (soajs, modelObj, inputmaskData, item, bl, cb) => {
		let config = {};
		async.auto({
			check_acl: function (callback) {
				if (item.settings) {
					if (item.settings.environments &&
						item.settings.environments.value) {
						if (item.settings.environments.type === "whitelist") {
							if (item.settings.environments.value.length > 0 &&
								item.settings.environments.value.indexOf(inputmaskData.env.toUpperCase()) === -1) {
								return callback(bl.marketplace.handleError(soajs, 406, null));
							}
						} else {
							if (item.settings.environments.value.length > 0 &&
								item.settings.environments.value.indexOf(inputmaskData.env.toUpperCase()) > -1) {
								return callback(bl.marketplace.handleError(soajs, 406, null));
							}
						}
					}
				}
				return callback(null, true);
			},
			get_version: ['check_acl', function (results, callback) {
				if (item.versions && item.versions.length > 0) {
					let found = false;
					let version;
					item.versions.forEach((v) => {
						if (v.version === inputmaskData.version) {
							found = true;
							version = v;
						}
					});
					if (!found) {
						return callback(bl.marketplace.handleError(soajs, 418, null));
					} else {
						return callback(null, version);
					}
				} else {
					return callback(bl.marketplace.handleError(soajs, 418, null));
				}
			}],
			get_deploy: ['get_version', function (results, callback) {
				if (item.deploy && item.deploy[inputmaskData.env]) {
					let found = false;
					let deploy;
					item.deploy[inputmaskData.env].forEach((v) => {
						if (v.version === inputmaskData.version) {
							found = true;
							deploy = v;
						}
					});
					if (!found) {
						return callback(bl.marketplace.handleError(soajs, 410, null));
					} else {
						return callback(null, deploy);
					}
				} else {
					return callback(bl.marketplace.handleError(soajs, 407, null));
				}
			}],
			get_catalog_recipe: ['get_deploy', function (results, callback) {
				let data = {
					id: results.get_deploy.recipe.id
				};
				bl.recipe.get(soajs, data, null, callback);
			}],
			get_env_record: ['get_deploy', 'get_catalog_recipe', function (results, callback) {
				sdk.get_env_registry(soajs, {env: inputmaskData.env}, (err, envRecord) => {
					if (err) {
						return callback(bl.marketplace.handleError(soajs, 416, err));
					}
					if (!envRecord) {
						return callback(bl.marketplace.handleError(soajs, 416, null));
					}
					return callback(null, envRecord);
				});
			}],
			get_src: ['get_catalog_recipe', function (results, callback) {
				if (!results.get_deploy.src) {
					return callback(null, null);
				}
				if (!results.get_catalog_recipe.recipe.deployOptions ||
					!results.get_catalog_recipe.recipe.deployOptions.image ||
					results.get_catalog_recipe.recipe.deployOptions.image.binary) {
					//image is binary
					return callback(null, null);
				}
				let opts = {
					deploy: results.get_deploy
				};
				lib.getSourceInformation(soajs, opts, bl, callback);
			}],
			computeEnvVariables: ['get_env_record', 'get_catalog_recipe', 'get_src', function (results, callback) {
				let opts = {
					version: results.get_version,
					item: item,
					deploy: results.get_deploy,
					recipe: results.get_catalog_recipe,
					registry: results.get_env_record
				};
				if (results.get_src) {
					opts.repoInfo = results.get_src;
				}
				lib.computeEnvVariables(soajs, modelObj, opts, config, bl, callback);
			}],
			compute_extra: ['computeEnvVariables', function (results, callback) {
				let opts = {
					version: results.get_version,
					item: item,
					deploy: results.get_deploy,
					recipe: results.get_catalog_recipe,
					registry: results.get_env_record
				};
				if (results.get_src) {
					opts.repoInfo = results.get_src;
				}
				lib.computeDeployObject(soajs, opts, config, bl, callback);
			}],
			deploy: ['compute_extra', function (results, callback) {
				let newOpts = {
					env: results.get_env_record.code,
					host: {
						infra: results.computeEnvVariables && results.computeEnvVariables.infra ? results.computeEnvVariables.infra : null
					}
				};
				lib.deployObject(soajs, newOpts, config, bl, callback);
			}],
		}, function (err, results) {
			if (err) {
				return cb(err);
			}
			return cb(err, results.deploy);
		});
	},
	
	"deploy": (soajs, inputmaskData, options, bl, cb) => {
		if (!inputmaskData) {
			return cb(bl.marketplace.handleError(soajs, 400, null));
		}
		let modelObj = bl.marketplace.mp.getModel(soajs, options);
		modelObj.getItem(inputmaskData, (err, item) => {
			if (err) {
				return cb(bl.marketplace.handleError(soajs, 602, err));
			}
			if (!item) {
				return cb(bl.marketplace.handleError(soajs, 501, null));
			}
			lib.startProcessing(soajs, modelObj, inputmaskData, item, bl, cb);
		});
	}
};

module.exports = lib;
