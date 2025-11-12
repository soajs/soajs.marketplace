'use strict';

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const { getGroups } = require('../lib/helpers.js');
const sdk = require('../../sdk/index.js');
const async = require('async');
const request = require('request');

let bl;

function local(soajs, inputmaskData, options, soajsCore, cb) {
	if (!inputmaskData) {
		return cb(bl.handleError(soajs, 400, null));
	}
	inputmaskData._groups = getGroups(soajs);
	let modelObj = bl.mp.getModel(soajs, options);
	modelObj.getItem_by_type(inputmaskData, (err, item) => {
		bl.mp.closeModel(soajs, modelObj);
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
				return callback(null);
			}
		}, function (err, version) {
			if (!version) {
				return cb(bl.handleError(soajs, 418, null));
			}
			checkCommand(version, (error) => {
				if (error) {
					return cb(error);
				}
				sdk.get_env_registry(soajs, {
					"env": inputmaskData.env
				}, (err, envRecord) => {
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
					computePort(opts, item, (err) => {
						if (err) {
							return cb(err);
						}
						if (deploymentType === "manual") {
							manualOperation(opts, cb);
						} else {
							containerOperation(opts, cb);
						}
					});
				});
			});
		});
	});

	function computePort(opts, item, cb) {
		let deploymentType = opts.registry.deployer.type;
		let itemPort = item.configuration.port;
		if (deploymentType === "manual") {
			soajsCore.core.registry.loadByEnv({
				"envCode": inputmaskData.env,
				"name": item.name
			}, (err, registry) => {
				if (err) {
					return cb(bl.handleError(soajs, 400, err));
				}
				if (!registry) {
					return cb(bl.handleError(soajs, 550, null));
				}
				if (registry.services && registry.services[item.name] && registry.services[item.name].port) {
					itemPort = registry.services[item.name].port;
				}
				if (inputmaskData.port.portType === 'maintenance') {
					itemPort = itemPort + registry.serviceConfig.ports.maintenanceInc;
				} else if (inputmaskData.port.portType === 'custom') {
					itemPort = inputmaskData.port.portValue;
				}
				opts.registry = registry;
				opts.port = itemPort;
				return cb();
			});
		} else {
			if (inputmaskData.port.portType === 'maintenance') {
				itemPort = itemPort + opts.registry.services.config.ports.maintenanceInc;
			} else if (inputmaskData.port.portType === 'custom') {
				itemPort = inputmaskData.port.portValue;
			}
			opts.port = itemPort;
			return cb();
		}
	}

	function checkCommand(version, callback) {
		if (version.maintenance && inputmaskData.operation === version.maintenance.readiness) {
			return callback(null, true);
		}

		if (!version.maintenance || !version.maintenance.commands || version.maintenance.commands.length === 0) {
			return callback(bl.handleError(soajs, 419, null));
		}

		async.detect(version.maintenance.commands, function (command, call) {
			if (command.path === inputmaskData.operation) {
				return call(null, command);
			} else {
				return call(null);
			}
		}, function (err, command) {
			if (!command) {
				return callback(bl.handleError(soajs, 420, null));
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
				return callback(bl.handleError(soajs, 421, error));
			}
			if (!body.data.services || !body.data.services[inputmaskData.name] ||
				!body.data.services[inputmaskData.name].hosts ||
				!body.data.services[inputmaskData.name].hosts[inputmaskData.version] ||
				body.data.services[inputmaskData.name].hosts[inputmaskData.version].length === 0) {
				return callback(bl.handleError(soajs, 421, null));
			}

			async.map(body.data.services[inputmaskData.name].hosts[inputmaskData.version], function (host, call) {
				let requestOptions = {
					uri: "http://" + host + ":" + opts.port + inputmaskData.operation,
					json: true
				};
				request(requestOptions, (error, response, body) => {
					if (error || !body || !body.result) {
						return call(bl.handleError(soajs, 421, error));
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
						name: {
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
						return callback(bl.handleError(soajs, 421, error));
					}
					return callback(null, body.data);
				});
			} else {
				return callback(bl.handleError(soajs, 421, null));
			}
		});
	}
}

module.exports = function(_bl) {
	bl = _bl;
	return local;
};
