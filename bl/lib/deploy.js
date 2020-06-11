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

function computeErrorMessageFromService(body) {
	if (!body.result) {
		let error = "";
		if (body.errors && body.errors && body.errors.details && body.errors.details.length > 0) {
			body.errors.details.forEach((detail) => {
				if (error === "") {
					error += detail.message;
				} else {
					error += " - " + detail.message;
				}
			});
		}
		return new Error(error);
	}
}

let lib = {
	
	"deploy": (soajs, inputmaskData, options, bl, cb) => {
		if (!inputmaskData) {
			return cb(bl.marketplace.handleError(soajs, 400, null));
		}
		let modelObj = bl.marketplace.mp.getModel(soajs, options);
		//  1- check if u can deploy in this env
		// 	2- if not return an error
		// 	3- if yes continue
		/*
			
			4- get item saved deploy configuration
			5- inspect item deployment from infra ms
			
			6- check if API_REGISTRY is needed to inspect gateway from infra ms
			7- get the computed env variables
			8- resolve computed variables
			
			9- create recipe
			10- deploy, this should call infra ms
			 */
		
		let config = {};
		async.auto({
			get_item: function (callback) {
				modelObj.getItem(inputmaskData, (err, response) => {
					if (err) {
						return callback(bl.marketplace.handleError(soajs, 602, err));
					}
					if (!response) {
						return callback(bl.marketplace.handleError(soajs, 501, null));
					}
					return callback(null, response);
				});
			},
			check_acl: ['get_item', function (results, callback) {
				if (results.get_item.settings) {
					if (results.get_item.settings.environments &&
						results.get_item.settings.environments.value) {
						if (results.get_item.settings.environments.type === "whitelist") {
							if (results.get_item.settings.environments.value.length > 0 &&
								results.get_item.settings.environments.value.indexOf(inputmaskData.env.toUpperCase()) === -1) {
								return callback(bl.marketplace.handleError(soajs, 406, null));
							}
						} else {
							if (results.get_item.settings.environments.value.length > 0 &&
								results.get_item.settings.environments.value.indexOf(inputmaskData.toUpperCase()) > -1) {
								return callback(bl.marketplace.handleError(soajs, 406, null));
							}
						}
					}
				}
				return callback(null, true);
			}],
			get_deploy: ['check_acl', function (results, callback) {
				if (results.get_item.deploy && results.get_item.deploy[inputmaskData.env]) {
					let found = false;
					let deploy;
					results.get_item.deploy[inputmaskData.env].forEach((v) => {
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
						if (!body.result) {
							return callback(bl.marketplace.handleError(soajs, 503, computeErrorMessageFromService(body)));
						}
						else {
							return callback(null, body.data, res);
						}
						
					});
				});
			}],
			get_env_record: ['get_deploy', 'get_catalog_recipe', function (results, callback) {
				let options = {
					method: "get",
					uri: "http://" + results.get_catalog_recipe[1].host + "/environment",
					headers: results.get_catalog_recipe[1].headers,
					json: true,
					qs: {
						code: inputmaskData.env,
					}
				};
				request(options, (error, res, body) => {
					if (!body.result) {
						return callback(bl.marketplace.handleError(soajs, 503, computeErrorMessageFromService(body)));
					}
					return callback(null, body.data);
				});
			}],
			get_src: ['get_catalog_recipe', function (results, callback) {
				if (!inputmaskData.src){
					return callback(null, null);
				}
				if (!results.get_catalog_recipe[0].deployOptions ||
					!results.get_catalog_recipe[0].deployOptions.image ||
					results.get_catalog_recipe[0].deployOptions.image.binary){
					//image is binary
					return callback(null, null);
				}
				soajs.awareness.connect('infra', function (res) {
					let options = {
						method: "get",
						uri: "http://" + res.host + "/git/repo/",
						headers: res.headers,
						json: true,
						qs: {
							owner: inputmaskData.src.id,
						}
					};
					request(options, (error, response, repo) => {
						if (!body.result) {
							return callback(bl.marketplace.handleError(soajs, 503, computeErrorMessageFromService(repo)));
						}
						if (!repo && !repo.data.owner){
							return callback(bl.marketplace.handleError(soajs, 412, null));
						}
						options = {
							method: "get",
							uri: "http://" + res.host + "/git/account/owner",
							headers: res.headers,
							json: true,
							qs: {
								owner: repo.body.owner,
								provider: inputmaskData.src.id,
							}
						};
						request(options, (error, response, owner) => {
							if (!body.result) {
								return callback(bl.marketplace.handleError(soajs, 503, computeErrorMessageFromService(owner)));
							}
							if (!config.env) {
								config.env = [];
							}
							let env_variables = ["SOAJS_GIT_OWNER", "SOAJS_GIT_BRANCH", "SOAJS_GIT_COMMIT", "SOAJS_GIT_REPO", "SOAJS_GIT_PROVIDER", "SOAJS_GIT_TOKEN", "SOAJS_GIT_DOMAIN"];
							config.env.push({
								"name": "$" + results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[0]],
								"value": repo.data.owner
							});
							
							config.env.push({
								"name": "$" + results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[1]],
								"value":  results.get_deploy.src.branch
							});
							
							config.env.push({
								"name": "$" + results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[2]],
								"value": results.get_deploy.src.commit
							});
							
							config.env.push({
								"name": "$" + results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[3]],
								"value": repo.data.repository
							});
							
							config.env.push({
								"name": "$" + results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[4]],
								"value":  repo.data.provider
							});
							
							config.env.push({
								"name": "$" + results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[5]],
								"value":  owner.data.token
							});
							
							config.env.push({
								"name": "$" + results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[6]],
								"value":  owner.data.domain
							});
							
							return callback(null, body.data);
						});
					});
				});
			}],
			computeEnvVariables: ['get_env_record', 'get_catalog_recipe', function (results, callback) {
				if (results.get_catalog_recipe[0].recipe &&
					results.get_catalog_recipe[0].recipe.buildOptions &&
					results.get_catalog_recipe[0].recipe.buildOptions.env &&
					Object.keys(results.get_catalog_recipe[0].recipe.buildOptions.env).length > 0
				) {
					if (!config.env) {
						config.env = [];
					}
					async.parallel([
						function (call) {
							let env_variables = ["SOAJS_NX_DOMAIN", "SOAJS_NX_SITE_DOMAIN", "SOAJS_NX_API_DOMAIN"];
							if (results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[0]] ||
								results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[1]] ||
								results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[2]]) {
								
								if (results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[0]]) {
									config.env.push({
										"name": "$" + results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[0]],
										"value": results.get_env_record.domain
									});
								}
								if (results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[1]]) {
									config.env.push({
										"name": "$" + results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[1]],
										"value": results.get_env_record.sitePrefix + "." + results.get_env_record.domain
									});
								}
								if (results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[2]]) {
									config.env.push({
										"name": "$" + results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[2]],
										"value": results.get_env_record.apiPrefix + "." + results.get_env_record.domain
									});
								}
							}
							return call();
						},
						function (call) {
							let env_variables = ["SOAJS_SRV_PORT", "SOAJS_SRV_PORT_MAINTENANCE"];
							if (results.get_item.type === "service" && results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[0]] ||
								results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[1]]) {
								
								if (results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[0]]) {
									config.env.push({
										"name": "$" + results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[0]],
										"value": results.get_item.configuration.port
									});
								}
								if (results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[1]]) {
									if (results.get_item.configuration.maintenance
										&& results.get_item.configuration.maintenance.port
										&& results.get_item.configuration.maintenance.type) {
										if (results.get_item.configuration.maintenance.type === "inherit") {
											config.env.push({
												"name": "$" + results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[1]],
												"value": results.get_item.configuration.port
											});
										} else if (results.get_item.configuration.maintenance.type === "maintenance") {
											config.env.push({
												"name": "$" + results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[1]],
												"value": results.get_item.configuration.port + results.get_env_record.services.config.ports.maintenanceInc
											});
										} else {
											config.env.push({
												"name": "$" + results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[1]],
												"value": results.get_item.configuration.maintenance.value
											});
										}
									}
								} else {
									config.env.push({
										"name": "$" + results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[1]],
										"value": results.get_item.configuration.port + results.get_env_record.services.config.ports.maintenanceInc
									});
								}
							}
							return call();
						},
						function (call) {
							let env_variables = ["SOAJS_ENV", "SOAJS_DAEMON_GRP_CONF", "SOAJS_PROFILE", "SOAJS_SERVICE_NAME", "SOAJS_NX_CONTROLLER_NB", "SOAJS_NX_CONTROLLER_PORT", "SOAJS_CONTROLLER_PORT_MAINTENANCE"];
							if (results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[0]]) {
								config.env.push({
									"name": "$" + results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[0]],
									"value": inputmaskData.env.toLowerCase()
								});
							}
							if (results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[1]]) {
								//todo
							}
							if (results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[2]]) {
								//todo
							}
							if (results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[3]]) {
								config.env.push({
									"name": "$" + results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[3]],
									"value": inputmaskData.name
								});
							}
							if (results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[4]]) {
								config.env.push({
									"name": "$" + results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[4]],
									"value": "1"
								});
							}
							if (results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[5]]) {
								config.env.push({
									"name": "$" + results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[5]],
									"value": soajs.registry.services.config.ports.controller
								});
							}
							if (results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[6]]) {
								config.env.push({
									"name": "$" + results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[6]],
									"value": soajs.registry.services.config.ports.controller + soajs.registry.services.config.ports.maintenanceInc
								});
							}
							return call();
						},
						function (call) {
							let env_variables = ["SOAJS_NX_CONTROLLER_IP_1", "SOAJS_REGISTRY_API"];
							if (results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[0]] ||
								results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[1]]) {
								let options = {
									method: "get",
									uri: "http://" + results.get_catalog_recipe[1].host + "/kubernetes/services/Service",
									headers: results.get_catalog_recipe[1].headers,
									json: true,
									qs: {
										filter: {
											labelSelector: 'soajs.env.code=' + inputmaskData.env.toLowerCase() + ', soajs.service.name=' + inputmaskData.name
										},
									}
								};
								request(options, (error, res, body) => {
									if (!body.result) {
										return call(bl.marketplace.handleError(soajs, 503, computeErrorMessageFromService(body)));
									}
									if (!body.data || !body.data.items || body.data.items.length === 0 || !body.data.items[0].metadata || !body.data.items[0].metadata.name) {
										return call(bl.marketplace.handleError(soajs, 411, null));
									}
									if (results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[0]]) {
										config.env.push({
											"name": "$" + results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[0]],
											"value": body.data.items[0].spec.clusterIP
										});
									}
									if (results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[0]]) {
										config.env.push({
											"name": "$" + results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[0]],
											"value": body.data.items[0].spec.clusterIP
										});
									}
									if (results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[1]]) {
										config.env.push({
											"name": "$" + results.get_catalog_recipe[0].recipe.buildOptions.env[env_variables[1]],
											"value": body.data.items[0].spec.clusterIP + ":" + soajs.registry.services.config.ports.controller + soajs.registry.services.config.ports.maintenanceInc
										});
									}
									return call();
								});
							}
						},
					], callback);
				} else {
					return callback(null, true);
				}
			}],
			compute_extra: ['computeEnvVariables', 'get_src', function (results, callback) {
				config.catalog = {
					id: results.get_catalog_recipe[0]._id.toString(),
					version: results.get_catalog_recipe[0].v,
				};
				if (results.get_catalog_recipe[0].deployOptions.image.shell) {
					config.catalog.shell = results.get_catalog_recipe[0].deployOptions.image.shell;
				}
				config.item = {
					env: inputmaskData.env.toLowerCase(),
					name: inputmaskData.name,
					type: inputmaskData.type,
					version: inputmaskData.version
				};
				if (results.get_item.configuration && results.get_item.configuration) {
					if (results.get_item.configuration.group) {
						config.item.group = results.get_item.configuration.group;
					}
					if (results.get_item.configuration.subType) {
						config.item.subtype = results.get_item.configuration.subType;
					}
				}
				
				if (results.get_deploy.src) {
					config.src = {
						repo: results.get_deploy.src.repo,
						owner: results.get_deploy.src.owner,
					};
					if (results.get_deploy.src.tag) {
						config.sr.tag = results.get_deploy.src.tag;
					} else {
						if (results.get_deploy.src.branch) {
							config.sr.branch = results.get_deploy.src.branch;
						}
						if (results.get_deploy.src.commit) {
							config.sr.commit = results.get_deploy.src.commit;
						}
					}
				}
				
				config.mode = results.get_deploy.settings.mode;
				if (results.get_catalog_recipe[0].recipe.deployOptions.labels) {
					config.labels = results.get_catalog_recipe[0].recipe.deployOptions.labels;
				}
				config.image = {
					name: results.get_catalog_recipe[0].recipe.deployOptions.image.prefix + "/" + results.get_catalog_recipe[0].recipe.deployOptions.image.name + ":" + results.get_catalog_recipe[0].recipe.deployOptions.image.tag,
					imagePullPolicy: results.get_catalog_recipe[0].recipe.deployOptions.image.pullPolicy
				};
				if (results.get_catalog_recipe[0].recipe.deployOptions.image.override && results.get_deploy.recipe.image) {
					config.image = results.get_deploy.recipe.image.prefix + "/" + results.get_deploy.recipe.image.name + ":" + results.get_deploy.recipe.image.tag
				}
				if (results.get_catalog_recipe[0].recipe.deployOptions.readinessProbe) {
					config.readinessProbe = results.get_catalog_recipe[0].recipe.deployOptions.readinessProbe;
				}
				if (results.get_catalog_recipe[0].recipe.deployOptions.livenessProbe) {
					config.livenessProbe = results.get_catalog_recipe[0].recipe.deployOptions.livenessProbe;
				}
				if (results.get_catalog_recipe[0].recipe.buildOptions.cmd) {
					if (results.get_catalog_recipe[0].recipe.buildOptions.cmd.command) {
						config.command = results.get_catalog_recipe[0].recipe.buildOptions.cmd.command;
					}
					if (results.get_catalog_recipe[0].recipe.buildOptions.cmd.args) {
						config.command = results.get_catalog_recipe[0].recipe.buildOptions.cmd.args;
					}
				}
				if (results.get_catalog_recipe[0].recipe.deployOptions.container && results.get_catalog_recipe[0].recipe.deployOptions.container.workingDir) {
					config.workingDir = results.get_catalog_recipe[0].recipe.deployOptions.container.workingDir;
				}
				if (results.get_catalog_recipe[0].recipe.deployOptions.voluming && results.get_catalog_recipe[0].recipe.deployOptions.voluming.length > 0) {
					config.volume = {
						volumeMounts: [],
						volumes: []
					};
					results.get_catalog_recipe[0].recipe.deployOptions.voluming.forEach((oneVolume) => {
						if (oneVolume.kubernetes) {
							if (oneVolume.kubernetes.volumeMounts) {
								config.volume.volumeMounts.push(oneVolume.kubernetes.volumeMounts);
							}
							if (oneVolume.kubernetes.volume) {
								config.volume.volume.push(oneVolume.kubernetes.volume);
							}
						}
					});
				}
				if (results.get_deploy.settings.replicas) {
					config.replicas = results.get_deploy.settings.replicas;
				}
				//fill ports
				if (results.get_catalog_recipe[0].recipe.deployOptions.ports && results.get_catalog_recipe[0].recipe.deployOptions.ports.length > 0) {
					config.ports = [];
					config.service = {
						ports : []
					};
					//merge with port in cd
					results.get_catalog_recipe[0].recipe.deployOptions.ports.forEach((onePortEntry, portIndex) => {
						config.ports.push({
							name: onePortEntry.name || 'port' + portIndex,
							"containerPort": onePortEntry.target
						});
						let portConfig = {
							protocol: ((onePortEntry.protocol) ? onePortEntry.protocol.toUpperCase() : 'TCP'),
							name: onePortEntry.name || 'port' + portIndex,
							port: onePortEntry.port || onePortEntry.target,
							targetPort: onePortEntry.target,
						};
						if (onePortEntry.isPublished) {
							if (!onePortEntry.published) {
								config.service.type = 'LoadBalancer';
								delete portConfig.nodePort;
							} else {
								if (!config.service.type || config.service.type !== 'NodePort') {
									config.service.type = 'NodePort';
								}
								portConfig.nodePort = onePortEntry.published || portConfig.targetPort;
							}
							
							portConfig.name = onePortEntry.name || 'published' + portConfig.name;
							portConfig.name = portConfig.name.toLowerCase();
							if (onePortEntry.preserveClientIP) {
								config.service.externalTrafficPolicy = 'Local';
							}
						}
						config.service.ports.push(portConfig);
					});
				}
				//fill user Input env
				if (results.get_deploy.recipe && results.get_deploy.recipe.env &&
					Object.keys(results.get_deploy.recipe.env).length > 0){
					if(!config.env){
						config.env = [];
					}
					Object.keys(results.get_deploy.recipe.env).forEach((oneEnv)=>{
						if (results.get_catalog_recipe[0].recipe.buildOptions.env[oneEnv]){
							config.env.push({
								"name": "$" + results.get_catalog_recipe[0].recipe.buildOptions.env[oneEnv],
								"value":results.get_deploy.recipe.env[oneEnv]
							});
						}
					});
				}
				callback(null, config);
			}],
			deploy: ['compute_extra', function (results, callback) {
				let url = "/kubernetes/item/deploy/soajs";
				if (results.compute_extra.mode === 'cronJob'){
					url = "/kubernetes/item/deploy/cronjob";
				}
				soajs.awareness.connect('infra', function (res) {
					let options = {
						method: "get",
						uri: "http://" + res.host + url,
						headers: res.headers,
						json: true,
						qs: {
							configuration: {
								env: inputmaskData.env
							},
							recipe: results.compute_extra
						}
					};
					request(options, (error, response, body) => {
						if (!body.result) {
							return callback(bl.marketplace.handleError(soajs, 503, computeErrorMessageFromService(body)));
						}
						return callback(null, true);
					});
				});
			}],
		}, function (err) {
			if (err){
				return cb(err);
			}
			return cb(err, "Item Successfully deployed!");
		});
	}
};


module.exports = lib;
