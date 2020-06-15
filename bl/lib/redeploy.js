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
	}
	else {
		return new Error(" Service not found");
	}
}

let lib = {
	
	"redeploy": (soajs, inputmaskData, options, bl, cb) => {
		if (!inputmaskData) {
			return cb(bl.marketplace.handleError(soajs, 400, null));
		}
		let modelObj = bl.marketplace.mp.getModel(soajs, options);
		/*
				1- get item saved deploy configuration
				2- set git info (branch & commit, or tag)
				3- set image info (tag)
				4- save item configuration
			
				5- inspect item deployment from infra ms
				
				6- redeploy, this should call infra ms
				 */
		
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
			inspect_item: ["get_deploy", function (results, callback) {
				let url = "/kubernetes/item/inspect";
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
							item: {
								name: inputmaskData.name,
								env: inputmaskData.env,
								version: inputmaskData.version,
							}
						}
					};
					request(options, (error, response, body) => {
						if (!body.result) {
							return callback(bl.marketplace.handleError(soajs, 503, computeErrorMessageFromService(body)));
						}
						//check if item is deployed
						let mode = results.get_deploy.settings.mode.toLowerCase() + "s";
						if (body.data[mode] && body.data[mode].items && body.data[mode].items.length > 0){
							return callback(null, body.data, res);
						}
						else {
							return callback(bl.marketplace.handleError(soajs, 413, null));
						}
					});
				});
			}],
			save_deploy: ["inspect_item", function (results, callback) {
				let config = {
					name: {
						item: {
							name: inputmaskData.name,
							version: inputmaskData.version,
							env: inputmaskData.env
						}
					},
					mode: results.get_deploy.settings.mode
				};
				let opts = {
					config: results.get_deploy,
					name: inputmaskData.name,
					type: inputmaskData.type,
					response: results.get_item
				};
				opts.config.env = inputmaskData.env;
				if (inputmaskData.src) {
					config.src = inputmaskData.src;
					if (inputmaskData.src.from.tag) {
						opts.config.src.tag = inputmaskData.src.from.tag;
						delete opts.config.src.commit;
						delete opts.config.src.branch;
					} else {
						opts.config.src.commit = inputmaskData.src.from.commit;
						opts.config.src.branch = inputmaskData.src.from.branch;
						delete opts.config.src.tag;
					}
				}
				if (inputmaskData.image) {
					config.image = inputmaskData.image;
					opts.config.image.tag = inputmaskData.image.tag;
				}
				
				modelObj.update_item_configuration(opts, (err) => {
					if (err) {
						return cb(bl.marketplace.handleError(soajs, 602, err));
					}
					return callback(null, config);
				});
			}],
			deploy: ['save_deploy', function (results, callback) {
				let url = "/kubernetes/item/redeploy";
				let options = {
					method: "put",
					uri: "http://" + results.inspect_item[1].host + url,
					headers: results.inspect_item[1].headers,
					json: true,
					qs: {
						configuration: {
							env: inputmaskData.env
						}
					},
					body: results.save_deploy
				};
				request(options, (error, response, body) => {
					if (!body.result) {
						return callback(bl.marketplace.handleError(soajs, 503, computeErrorMessageFromService(body)));
					}
					return callback(null, true);
				});
			}],
		}, function (err) {
			if (err) {
				return cb(err);
			}
			return cb(err, "Item Successfully Redeployed!");
		});
	}
};


module.exports = lib;
