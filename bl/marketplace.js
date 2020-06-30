/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

'use strict';

const soajsCore = require('soajs');
const request = require('request');
const async = require('async');

function getGroups(soajs) {
	let _groups = null;
	if (soajs && soajs.urac && soajs.urac.groups) {
		if (Array.isArray(soajs.urac.groups) && soajs.urac.groups.length > 0) {
			_groups = soajs.urac.groups;
		}
	}
	return _groups;
}

let bl = {
	"modelObj": null,
	"model": null,
	"soajs_service": null,
	"localConfig": null,
	
	"handleError": (soajs, errCode, err) => {
		if (err) {
			soajs.log.error(err.message);
		}
		return ({
			"code": errCode,
			"msg": bl.localConfig.errors[errCode] + ((err && (errCode === 602 || errCode === 503)) ? err.message : "")
		});
	},
	
	"mp": {
		"getModel": (soajs) => {
			let modelObj = bl.modelObj;
			if (soajs && soajs.tenant && soajs.tenant.type === "client" && soajs.tenant.dbConfig) {
				let options = {
					"dbConfig": soajs.tenant.dbConfig,
					"index": soajs.tenant.id
				};
				modelObj = new bl.model(bl.soajs_service, options, null);
			}
			return modelObj;
		},
		"closeModel": (soajs, modelObj) => {
			if (soajs && soajs.tenant && soajs.tenant.type === "client" && soajs.tenant.dbConfig) {
				modelObj.closeConnection();
			}
		}
	},
	
	/**
	 * Marketplace
	 */
	"getItems_by_type_subtype": (soajs, inputmaskData, options, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		inputmaskData._groups = getGroups(soajs);
		let modelObj = bl.mp.getModel(soajs, options);
		modelObj.getItems_by_type_subtype(inputmaskData, (err, response) => {
			bl.mp.closeModel(modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			return cb(null, response);
		});
	},
	"getItems_by_keywords": (soajs, inputmaskData, options, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		inputmaskData._groups = getGroups(soajs);
		let modelObj = bl.mp.getModel(soajs, options);
		modelObj.getItems_by_keywords(inputmaskData, (err, response) => {
			bl.mp.closeModel(modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			return cb(null, response);
		});
	},
	"getItem_by_source": (soajs, inputmaskData, options, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		inputmaskData._groups = getGroups(soajs);
		let modelObj = bl.mp.getModel(soajs, options);
		modelObj.getItem_by_source(inputmaskData, (err, response) => {
			bl.mp.closeModel(modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			return cb(null, response);
		});
	},
	
	"getItem_by_type": (soajs, inputmaskData, options, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		inputmaskData._groups = getGroups(soajs);
		let modelObj = bl.mp.getModel(soajs, options);
		modelObj.getItem_by_type(inputmaskData, (err, response) => {
			bl.mp.closeModel(modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			return cb(null, response);
		});
	},
	
	"updateItem_environments": (soajs, inputmaskData, options, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		inputmaskData._groups = getGroups(soajs);
		let modelObj = bl.mp.getModel(soajs, options);
		modelObj.updateItem_environments(inputmaskData, (err, response) => {
			bl.mp.closeModel(modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			return cb(null, response);
		});
	},
	"updateItem_recipes": (soajs, inputmaskData, options, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		inputmaskData._groups = getGroups(soajs);
		let modelObj = bl.mp.getModel(soajs, options);
		modelObj.updateItem_recipes(inputmaskData, (err, response) => {
			bl.mp.closeModel(modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			return cb(null, response);
		});
	},
	"updateItem_acl": (soajs, inputmaskData, options, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		inputmaskData._groups = getGroups(soajs);
		let modelObj = bl.mp.getModel(soajs, options);
		
		//todo let owner be handled behind the scenes (in case of whitelist - black list)
		modelObj.updateItem_acl(inputmaskData, (err, response) => {
			bl.mp.closeModel(modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			return cb(null, response);
		});
	},
	"deleteItem": (soajs, inputmaskData, options, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs, options);
		inputmaskData._groups = getGroups(soajs);
		modelObj.getItem(inputmaskData, (err, response) => {
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!response) {
				return cb(bl.handleError(soajs, 501, null));
			}
			if (response.locked) {
				return cb(bl.handleError(soajs, 502, null));
			}
			modelObj.deleteItem(inputmaskData, (err) => {
				bl.mp.closeModel(modelObj);
				if (err) {
					return cb(bl.handleError(soajs, 602, err));
				}
				return cb(null, true);
			});
		});
	},
	
	"deleteItem_source": (soajs, inputmaskData, options, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs, options);
		modelObj.deleteItem_source(inputmaskData, (err) => {
			bl.mp.closeModel(modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			return cb(null, true);
		});
	},
	
	"deleteItem_branch": (soajs, inputmaskData, options, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs, options);
		inputmaskData._groups = getGroups(soajs);
		modelObj.getItem(inputmaskData, (err, response) => {
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!response) {
				return cb(bl.handleError(soajs, 501, null));
			}
			if (response.locked) {
				return cb(bl.handleError(soajs, 502, null));
			}
			let index;
			for (let i = 0; i < response.versions.length; i++) {
				if (response.versions[i].branches) {
					index = response.versions[i].branches.indexOf(inputmaskData.branch);
					if (index > -1) {
						response.versions[i].branches.splice(index, 1);
						if (response.versions[i].branches.length === 0 && (!response.versions[i].tags || response.versions[i].tags.length === 0)) {
							response.versions.splice(i, 1);
						}
						break;
					}
				} else {
					index = -1;
				}
			}
			if (index < 0) {
				return cb(bl.handleError(soajs, 403, null));
			}
			let opts = {
				versions: response.versions,
				name: response.name,
				type: response.type
			};
			modelObj.deleteItem_version(opts, (err) => {
				bl.mp.closeModel(modelObj);
				if (err) {
					return cb(bl.handleError(soajs, 602, err));
				}
				return cb(null, true);
			});
		});
	},
	
	"deleteItem_tag": (soajs, inputmaskData, options, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs, options);
		inputmaskData._groups = getGroups(soajs);
		modelObj.getItem(inputmaskData, (err, response) => {
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!response) {
				return cb(bl.handleError(soajs, 501, null));
			}
			if (response.locked) {
				return cb(bl.handleError(soajs, 502, null));
			}
			let index;
			for (let i = 0; i < response.versions.length; i++) {
				if (response.versions[i].tags) {
					index = response.versions[i].tags.indexOf(inputmaskData.tag);
					if (index > -1) {
						response.versions[i].tags.splice(index, 1);
						if (response.versions[i].tags.length === 0 && (!response.versions[i].branches || response.versions[i].branches.length === 0)) {
							response.versions.splice(i, 1);
						}
						break;
					}
				} else {
					index = -1;
				}
			}
			if (index < 0) {
				return cb(bl.handleError(soajs, 404, null));
			}
			let opts = {
				versions: response.versions,
				name: response.name,
				type: response.type
			};
			modelObj.deleteItem_version(opts, (err) => {
				bl.mp.closeModel(modelObj);
				if (err) {
					return cb(bl.handleError(soajs, 602, err));
				}
				return cb(null, true);
			});
		});
	},
	
	"addItem": (soajs, inputmaskData, options, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs, options);
		let data = inputmaskData.item;
		let opts = {
			name: data.soa.name,
			type: data.soa.type
		};
		
		if (data.src.provider !== "manual" && !(data.src.tag || data.src.branch)) {
			bl.mp.closeModel(modelObj);
			return cb(bl.handleError(soajs, 402, null));
		}
		inputmaskData._groups = getGroups(soajs);
		modelObj.getItem(opts, (err, response) => {
			if (err) {
				bl.mp.closeModel(modelObj);
				return cb(bl.handleError(soajs, 602, err));
			}
			if (response) {
				data.oldCatalog = response;
			}
			
			let catalogDriver;
			if (data.soa.type === "service" && data.soa.subType === "soajs") {
				catalogDriver = require(`../driver/${data.soa.subType}/index.js`);
			} else {
				catalogDriver = require(`../driver/${data.soa.type}/index.js`);
			}
			catalogDriver.checkCanUpdate(data, (err) => {
				if (err) {
					bl.mp.closeModel(modelObj);
					return cb(bl.handleError(soajs, 401, err));
				}
				catalogDriver.createCatalog(data, (catalog) => {
					opts = {
						item: catalog
					};
					modelObj.addItem(opts, (err, result) => {
						bl.mp.closeModel(modelObj);
						if (err) {
							return cb(bl.handleError(soajs, 602, err));
						}
						if (result.n === 0) {
							return cb(bl.handleError(soajs, 500, null));
						}
						return cb(null, response ? "Catalog Entry Successfully updated!" : "Catalog Entry Successfully Added!");
					});
				});
			});
		});
	},
	
	"maintenance": (soajs, inputmaskData, options, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		inputmaskData._groups = getGroups(soajs);
		let modelObj = bl.mp.getModel(soajs, options);
		modelObj.getItem_by_type(inputmaskData, (err, item) => {
			bl.mp.closeModel(modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!item || !item.versions || item.versions.length === 0) {
				return cb(bl.handleError(soajs, 418, null));
			}
			async.detect(item.versions, function (v, callback) {
				if (v.version === inputmaskData.version) {
					
					return callback(null, v);
				} else {
					return callback();
				}
			}, function (err, version) {
				if (!version) {
					return cb(bl.handleError(soajs, 418, null));
				}
				checkCommand(version, (error) => {
					if (error) {
						return cb(error);
					}
					soajsCore.core.registry.loadByEnv({envCode: inputmaskData.env}, (err, envRecord) => {
						if (err) {
							return cb(bl.handleError(soajs, 400, err));
						}
						if (!envRecord) {
							return cb(bl.handleError(soajs, 550, null));
						}
						let deploymentType = envRecord.deployer.type;
						
						let opts = {
							registry: envRecord
						};
						let computePort = () => {
							if (inputmaskData.portType === 'inherit') {
								return item.configuration.port;
							} else if (inputmaskData.portType === 'custom') {
								return inputmaskData.portValue;
							} else {
								return item.configuration.port + envRecord.serviceConfig.ports.maintenanceInc;
							}
						};
						opts.port = computePort();
						if (deploymentType === "manual") {
							manualOperation(opts, cb);
						} else {
							containerOperation(opts, cb);
						}
						
						
					});
				});
			});
		});
		
		function checkCommand(version, callback) {
			if (inputmaskData.operation === version.maintenance.readiness) {
				return callback(null, true);
			}
			if (!version.maintenance || !version.maintenance.commands || version.maintenance.commands.length === 0) {
				return cb(bl.handleError(soajs, 419, null));
			}
			async.detect(version.maintenance.commands, function (command, call) {
				if (command.path === inputmaskData.operation) {
					return call(null, command);
				} else {
					return call();
				}
			}, function (err, command) {
				if (!command) {
					return cb(bl.handleError(soajs, 420, null));
				} else {
					return callback(null, true);
				}
			});
		}
		
		function manualOperation(opts, callback) {
			let controller = {
				port: opts.registry.serviceConfig.ports.controller + opts.registry.serviceConfig.ports.maintenanceInc,
				ip: opts.registry.awareness.host,
			};
			let requestOptions = {
				uri: "http://" + controller.ip + ":" + controller.port + "/awarenessStat",
				json: true
			};
			request(requestOptions, (error, response, body) => {
				if (error || !body || !body.result) {
					return cb(bl.handleError(soajs, 421, null));
				}
				if (!body.data.services || !body.data.services[inputmaskData.name] ||
					!body.data.services[inputmaskData.name].hosts ||
					!body.data.services[inputmaskData.name].hosts[inputmaskData.version] ||
					body.data.services[inputmaskData.name].hosts[inputmaskData.version].length === 0) {
					return cb(bl.handleError(soajs, 421, null));
				}
				
				async.map(body.data.services[inputmaskData.name].hosts[inputmaskData.version], function (host, call) {
					let requestOptions = {
						uri: "http://" + host + ":" + opts.port + inputmaskData.operation,
						json: true
					};
					request(requestOptions, (error, response, body) => {
						if (error || !body || !body.result) {
							return call(bl.handleError(soajs, 421, null));
						}
						return call(null, {
							id: host,
							response: body.data || body,
							
						});
					});
				}, function (err, result) {
					return callback(err, result);
				});
				
			});
		}
		
		function containerOperation(opts, callback) {
			let technology = opts.registry.deployer.selected.split(".")[1];
			soajs.awareness.connect("infra", "1", (response) => {
				if (response && response.host) {
					let options = {
						uri: 'http://' + response.host + "/" + technology + "/item/maintenance",
						headers: response.headers,
						body: {
							configuration: {
								env: inputmaskData.env
							},
							name : {
								item: {
									env: inputmaskData.env,
									name: inputmaskData.name,
									version: inputmaskData.version
								},
							},
							maintenancePort: opts.port.toString(),
							operation: {
								route: inputmaskData.operation
							}
						},
						json: true
					};
					request.put(options, function (error, response, body) {
						if (error || !body || !body.result) {
							return callback(bl.handleError(soajs, 421, null));
						}
						return callback(null, body.data);
					});
				} else {
					return callback(bl.handleError(soajs, 421, null));
				}
			});
		}
	}
};

module.exports = bl;