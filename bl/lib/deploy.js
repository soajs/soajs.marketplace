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
const soajsCore = require('soajs');

function computeErrorMessageFromService(body) {
	if (body && !body.result) {
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
	
	"computeEnvVariables": (soajs, modelObj, opts, config, bl, cb) => {
		// let opts = {
		// 	item: item,
		// 	deploy: results.get_deploy,
		// 	repoInfo: results.get_src,
		// 	recipe: results.get_catalog_recipe,
		// 	registry: results.get_env_record
		// };
		
		let envVariables = [];
		if (!config.env) {
			config.env = [];
		}
		if (opts.owner) {
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
			
			if (opts.owner.token) {
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
			async.parallel([
				function (call) {
					let env_variables = ["SOAJS_NX_DOMAIN", "SOAJS_NX_SITE_DOMAIN", "SOAJS_NX_API_DOMAIN"];
					envVariables = envVariables.concat(env_variables);
					if (opts.recipe.recipe.buildOptions.env[env_variables[0]] ||
						opts.recipe.recipe.buildOptions.env[env_variables[1]] ||
						opts.recipe.recipe.buildOptions.env[env_variables[2]]) {
						
						if (opts.recipe.recipe.buildOptions.env[env_variables[0]]) {
							config.env.push({
								"name": env_variables[0],
								"value": opts.registry.domain
							});
						}
						if (opts.recipe.recipe.buildOptions.env[env_variables[1]]) {
							config.env.push({
								"name": env_variables[1],
								"value": opts.registry.sitePrefix + "." + opts.registry.domain
							});
						}
						if (opts.recipe.recipe.buildOptions.env[env_variables[2]]) {
							config.env.push({
								"name": env_variables[2],
								"value": opts.registry.apiPrefix + "." + opts.registry.domain
							});
						}
					}
					return call();
				},
				function (call) {
					let env_variables = ["SOAJS_SRV_PORT", "SOAJS_SRV_PORT_MAINTENANCE"];
					envVariables = envVariables.concat(env_variables);
					if (opts.item.type === "service" && opts.recipe.recipe.buildOptions.env[env_variables[0]] ||
						opts.recipe.recipe.buildOptions.env[env_variables[1]]) {
						
						if (opts.recipe.recipe.buildOptions.env[env_variables[0]]) {
							config.env.push({
								"name": env_variables[0],
								"value": opts.item.configuration.port
							});
						}
						if (opts.recipe.recipe.buildOptions.env[env_variables[1]]) {
							if (opts.item.configuration.maintenance &&
								opts.item.configuration.maintenance.port &&
								opts.item.configuration.maintenance.type) {
								if (opts.item.configuration.maintenance.type === "inherit") {
									config.env.push({
										"name": env_variables[1],
										"value": opts.item.configuration.port
									});
								} else if (opts.item.configuration.maintenance.type === "maintenance") {
									config.env.push({
										"name": env_variables[1],
										"value": opts.item.configuration.port + opts.registry.serviceConfig.ports.maintenanceInc
									});
								} else {
									config.env.push({
										"name": env_variables[1],
										"value": opts.item.configuration.maintenance.value
									});
								}
							}
						} else {
							config.env.push({
								"name": env_variables[1],
								"value": opts.item.configuration.port + opts.registry.serviceConfig.ports.maintenanceInc
							});
						}
					}
					return call();
				},
				function (call) {
					let env_variables = ["SOAJS_ENV", "SOAJS_DAEMON_GRP_CONF", "SOAJS_SERVICE_NAME", "SOAJS_NX_CONTROLLER_NB", "SOAJS_NX_CONTROLLER_PORT", "SOAJS_CONTROLLER_PORT_MAINTENANCE", "SOAJS_DEPLOY_HA"];
					envVariables = envVariables.concat(env_variables);
					if (opts.recipe.recipe.buildOptions.env[env_variables[0]]) {
						config.env.push({
							"name": env_variables[0],
							"value": opts.registry.name.toLowerCase()
						});
					}
					if (opts.recipe.recipe.buildOptions.env[env_variables[1]]) {
						//todo
					}
					
					if (opts.recipe.recipe.buildOptions.env[env_variables[2]]) {
						config.env.push({
							"name": env_variables[2],
							"value": opts.item.name
						});
					}
					if (opts.recipe.recipe.buildOptions.env[env_variables[3]]) {
						config.env.push({
							"name": env_variables[3],
							"value": "1"
						});
					}
					if (opts.recipe.recipe.buildOptions.env[env_variables[4]]) {
						config.env.push({
							"name": env_variables[4],
							"value": opts.registry.services.config.ports.controller
						});
					}
					if (opts.recipe.recipe.buildOptions.env[env_variables[5]]) {
						config.env.push({
							"name": env_variables[5],
							"value": opts.registry.serviceConfig.ports.controller + opts.registry.serviceConfig.ports.maintenanceInc
						});
					}
					if (opts.recipe.recipe.buildOptions.env[env_variables[6]]) {
						config.env.push({
							"name": env_variables[6],
							"value": opts.registry.deployer.selected.split(".")[1]
						});
					}
					return call();
				},
				function (call) {
					let env_variables = ["SOAJS_NX_CONTROLLER_IP_1", "SOAJS_REGISTRY_API"];
					envVariables = envVariables.concat(env_variables);
					if (opts.recipe.recipe.buildOptions.env[env_variables[0]] ||
						opts.recipe.recipe.buildOptions.env[env_variables[1]]) {
						soajs.awareness.connect("infra", "1", (response) => {
							if (response && response.host) {
								let options = {
									method: "get",
									uri: "http://" + response.host + "/kubernetes/services/Service",
									headers: response.headers,
									json: true,
									qs: {
										qs: {
											configuration: {
												env: opts.registry.name.toLowerCase()
											}
										},
										filter: {
											labelSelector: 'soajs.env.code=' + opts.registry.name.toLowerCase() + ', soajs.service.name=' + opts.registry.serviceConfig.ports.name || "controller"
										},
									}
								};
								request(options, (error, res, body) => {
									if (error || !body.result) {
										return call(bl.marketplace.handleError(soajs, 503, computeErrorMessageFromService(body)));
									}
									if (!body.data || !body.data.items || body.data.items.length === 0 || !body.data.items[0].metadata || !body.data.items[0].metadata.name) {
										return call(bl.marketplace.handleError(soajs, 411, null));
									}
									if (opts.recipe.recipe.buildOptions.env[env_variables[0]]) {
										config.env.push({
											"name": env_variables[0],
											"value": body.data.items[0].spec.clusterIP
										});
									}
									if (opts.recipe.recipe.buildOptions.env[env_variables[1]]) {
										config.env.push({
											"name": env_variables[1],
											"value": body.data.items[0].spec.clusterIP + ":" + soajs.registry.services.config.ports.controller + soajs.registry.services.config.ports.maintenanceInc
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
						soajs.awareness.connect('repositories', function (res) {
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
								if (!repo && !repo.data.owner) {
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
								
								if (opts.deploy.src.commit) {
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
					if (!envVariables.includes(key)) {
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
										secretKeyRef: opts.deploy.recipe.env[key]
									}
								});
							}
						}
					}
					callback();
				}, cb);
			});
		} else {
			return cb(null, true);
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
			version: opts.recipe.v.toString(),
		};
		if (opts.recipe.recipe.deployOptions.image.shell) {
			config.catalog.shell = opts.recipe.recipe.deployOptions.image.shell;
		} else {
			config.catalog.shell = "shell/bin/bash";
		}
		config.item = {
			env: opts.registry.name.toLowerCase(),
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
		
		if (opts.deploy.src) {
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
		}
		if (opts.recipe.recipe.deployOptions.labels) {
			config.labels = opts.recipe.recipe.deployOptions.labels;
		}
		config.image = {
			name: opts.recipe.recipe.deployOptions.image.prefix + "/" + opts.recipe.recipe.deployOptions.image.name + ":" + opts.recipe.recipe.deployOptions.image.tag,
			imagePullPolicy: opts.recipe.recipe.deployOptions.image.pullPolicy
		};
		if (opts.recipe.recipe.deployOptions.image.override && opts.deploy.recipe.image) {
			config.image.name = opts.deploy.recipe.image.prefix + "/" + opts.deploy.recipe.image.name + ":" + opts.deploy.recipe.image.tag;
		}
		if (opts.recipe.recipe.deployOptions.readinessProbe) {
			config.readinessProbe = opts.recipe.recipe.deployOptions.readinessProbe;
		}
		if (opts.recipe.recipe.deployOptions.livenessProbe) {
			config.livenessProbe = opts.recipe.recipe.deployOptions.livenessProbe;
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
			let maintenance;
			opts.item.versions.forEach((one) => {
				if (one.version === opts.deploy.version) {
					maintenance = one.maintenance;
				}
			});
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
						target: opts.item.configuration.port + opts.registry.serviceConfig.ports.maintenanceInc,
						protocol: "TCP",
						port: opts.item.configuration.port + opts.registry.serviceConfig.ports.maintenanceInc,
					});
					config.ports.push({
						"name": 'maintenance',
						"containerPort": opts.item.configuration.port + opts.registry.serviceConfig.ports.maintenanceInc
					});
				}
				//inherit do nothing
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
			if (opts.item.type === "service" || config.service.type === "Internal"){
				delete config.service.type;
			}
			opts.deploy.recipe.ports.values.forEach((onePortEntry, portIndex) => {
				config.ports.push({
					name: onePortEntry.name || 'port' + portIndex,
					"containerPort": onePortEntry.target
				});
				if (opts.deploy.recipe.ports.portType){
					let portConfig = {
						protocol: ((onePortEntry.protocol) ? onePortEntry.protocol.toUpperCase() : 'TCP'),
						name: onePortEntry.name || 'port' + portIndex,
						port: onePortEntry.port || onePortEntry.target,
						targetPort: onePortEntry.target,
					};
					if (config.service.type === "NodePort"){
						portConfig.nodePort = onePortEntry.published || portConfig.targetPort;
					}
					if (opts.deploy.recipe.ports.externalTrafficPolicy) {
						config.service.externalTrafficPolicy = opts.deploy.recipe.externalTrafficPolicy;
					}
					config.service.ports.push(portConfig);
				}
			});
			if (config.service.ports.length === 0){
				delete config.service;
			}
		}
		cb(null, config);
	},
	
	"getSourceInformation": (soajs, opts, bl, cb) => {
		soajs.awareness.connect('repositories', function (res) {
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
				if (!repo && !repo.data.owner) {
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
		if (opts.host.infra) {
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
			get_deploy: ['check_acl', function (results, callback) {
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
				soajs.awareness.connect('dashboard', function (res) {
					let options = {
						method: "get",
						uri: "http://" + res.host + "/catalog/recipes/get",
						headers: res.headers,
						json: true,
						qs: {
							id: results.get_deploy.recipe.id
						}
					};
					request(options, (error, response, body) => {
						if (error || !body.result) {
							return callback(bl.marketplace.handleError(soajs, 503, computeErrorMessageFromService(body)));
						} else {
							return callback(null, body.data);
						}
						
					});
				});
			}],
			get_env_record: ['get_deploy', 'get_catalog_recipe', function (results, callback) {
				soajsCore.core.registry.loadByEnv({envCode: inputmaskData.env}, (err, envRecord) => {
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
				let opts = {
					env: results.get_env_record.name,
					host: {
						infra: results.computeEnvVariables && results.computeEnvVariables[1] ? results.computeEnvVariables[1] : null
					}
				};
				lib.deployObject(soajs, opts, config, bl, callback);
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
