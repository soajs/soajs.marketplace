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
const sdk = require("../../lib/sdk.js");

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
	
	"cd": (soajs, inputmaskData, options, bl, local, cb) => {
		if (!inputmaskData) {
			return cb(bl.marketplace.handleError(soajs, 400, null));
		}
		let modelObj = bl.marketplace.mp.getModel(soajs, options);
		/*
			1- validate cd token
			2- if not valid return error
			3- if valid continue
			
			4- figure out what is the item from sent param (item info, repository info)
			
			6- get item saved deploy configuration
			7- for all deployed env check if deployed from this branch
				8- if not do nothing
				9- if yes continue
				10- if auto deploy is on
				11- call deploy
				12- if auto deploy is off
				13- add to ledger
			*/
		let report = {};
		async.auto({
			check_cd_token: function (callback) {
				report.stage_1 = {
					"success": [],
					"fail": []
				};
				soajs.awareness.connect('infra', '1', function (res) {
					let url = "/cd/token";
					let options = {
						method: "get",
						uri: "http://" + res.host + url,
						headers: res.headers,
						json: true,
						qs: {
							token: inputmaskData.token
						},
					};
					request(options, (error, response, body) => {
						if (error || !body.result || !body) {
							return callback(bl.marketplace.handleError(soajs, 503, computeErrorMessageFromService(body)));
						}
						if (!body.data) {
							report.stage_1.fail.push("Deploy token not found!");
							return cb(null, report);
						}
						if (body.data.status !== "active") {
							report.stage_1.fail.push("Deploy token not active!");
							return cb(null, report);
						}
						report.stage_1.success.push("Deploy token authenticated Successfully");
						return callback(null, true);
					});
				});
			},
			check_repo_token: ["check_cd_token", function (results, callback) {
				return callback(null, true);
			}],
			get_item: ["check_repo_token", function (results, callback) {
				report.stage_2 = {
					"success": [],
					"fail": []
				};
				modelObj.getItem(inputmaskData, (err, response) => {
					if (err) {
						return callback(bl.marketplace.handleError(soajs, 602, err));
					}
					if (!response) {
						report.stage_2.fail.push("Item not found!");
						return cb(null, report);
					}
					report.stage_2.success.push("Item found!");
					return callback(null, response);
				});
			}],
			check_acl: ['get_item', function (results, callback) {
				
				report.stage_3 = {
					"success": [],
					"fail": []
				};
				if (!results.get_item.deploy) {
					report.stage_3.fail.push("No environments found!");
					return cb(null, report);
				}
				let selected_envs = Object.keys(results.get_item.deploy);
				if (selected_envs.length === 0) {
					report.stage_3.fail.push("No environments found!");
					return cb(null, report);
				}
				let unFound_envs = [];
				if (inputmaskData.config.from.env) {
					for (let i = inputmaskData.config.from.env.length - 1; i >= 0; i--) {
						if (selected_envs.indexOf(inputmaskData.config.from.env[i].toLowerCase()) === -1) {
							unFound_envs.push(inputmaskData.config.from.env[i].toLowerCase());
						}
					}
					selected_envs = inputmaskData.config.from.env;
				}
				
				if (unFound_envs.length > 0) {
					report.stage_3.fail.push("Environments: " + unFound_envs.join(",") + " were not found.");
					return cb(null, report);
				}
				let unsupported_acl = [];
				if (results.get_item.settings) {
					if (results.get_item.settings.environments &&
						results.get_item.settings.environments.value) {
						if (results.get_item.settings.environments.type === "whitelist") {
							if (results.get_item.settings.environments.value.length > 0) {
								for (let i = selected_envs.length - 1; i >= 0; i--) {
									if (results.get_item.settings.environments.value.indexOf(selected_envs[i].toUpperCase()) === -1) {
										unsupported_acl.push(selected_envs[i].toUpperCase());
										selected_envs.splice(i, 1);
									}
								}
							}
						} else {
							for (let i = selected_envs.length - 1; i >= 0; i--) {
								if (results.get_item.settings.environments.value.indexOf(selected_envs[i].toUpperCase()) > -1) {
									unsupported_acl.push(selected_envs[i].toUpperCase());
									selected_envs.splice(i, 1);
								}
							}
						}
					}
				}
				if (unsupported_acl.length > 0) {
					report.stage_3.fail.push("You have no access to the following environments " + unsupported_acl.join(","));
					return cb(null, report);
				}
				if (selected_envs.length === 0) {
					report.stage_3.fail.push("No environments found!");
					return cb(null, report);
				}
				report.stage_3.success.push("Environments: " + selected_envs.join(',') + ' environments have been found');
				return callback(null, selected_envs);
			}],
			create_deploy_notice: ["check_acl", function (results, callback) {
				report.stage_4 = {
					success: [],
					fail: []
				};
				let deploy_object = [];
				let notice_object = [];
				async.each(results.check_acl, function (oneEnv, miniCall) {
					async.each(results.get_item.deploy[oneEnv], function (oneItem, call) {
						if (oneItem.version === inputmaskData.version) {
							//case 1 && 2 branch & commit
							if (inputmaskData.config.from.branch && inputmaskData.config.from.commit) {
								if (oneItem.src && oneItem.src.branch && oneItem.src.branch === inputmaskData.config.from.branch) {
									if (oneItem.cd.strategy === "notify") {
										notice_object.push({
											env: oneEnv,
											name: results.get_item.name,
											type: results.get_item.type,
											config: oneItem,
											from: inputmaskData.config.from,
											version: inputmaskData.version,
											deployObject: "commit"
										});
									} else {
										deploy_object.push({
											env: oneEnv,
											name: results.get_item.name,
											type: results.get_item.type,
											config: oneItem,
											from: inputmaskData.config.from,
											version: inputmaskData.version,
											deployObject: "commit"
										});
									}
									report.stage_4.success.push("Item Version " + inputmaskData.version + " for environment " + oneEnv + " was selected with cd status " + oneItem.cd.strategy);
								}
							}
							//case 3 tag
							else if (inputmaskData.config.from.tag) {
								if (oneItem.src && oneItem.src.tag && oneItem.src.tag === inputmaskData.config.from.tag) {
									if (oneItem.cd.strategy === "notify") {
										notice_object.push({
											env: oneEnv,
											name: results.get_item.name,
											type: results.get_item.type,
											config: oneItem,
											from: inputmaskData.config.from,
											version: inputmaskData.version,
											deployObject: "tag"
										});
									} else {
										deploy_object.push({
											env: oneEnv,
											name: results.get_item.name,
											type: results.get_item.type,
											config: oneItem,
											from: inputmaskData.config.from,
											version: inputmaskData.version,
											deployObject: "tag"
										});
									}
									report.stage_4.success.push("Item Version " + inputmaskData.version + " for environment " + oneEnv + " was selected with cd status " + oneItem.cd.strategy);
								}
							}
							// case 4 binary - image
							else {
								//get prefix
								// let deployed_image_prefix;
								// if (oneItem.recipe.image && oneItem.recipe.image.prefix) {
								// 	deployed_image_prefix = oneItem.recipe.image.prefix;
								// }
								
								//get name
								// let deployed_image_name;
								// if (oneItem.recipe.image && oneItem.recipe.image.name) {
								// 	deployed_image_name = oneItem.recipe.image.name;
								// }
								
								//get tag
								// let deployed_image_tag;
								// if (oneItem.recipe.image && oneItem.recipe.image.tag) {
								// 	deployed_image_tag = oneItem.recipe.image.tag;
								// }
								// if (inputmaskData.config.from.image_prefix === deployed_image_prefix &&
								// 	inputmaskData.config.from.image_name === deployed_image_name &&
								// 	inputmaskData.config.from.image_tag === deployed_image_tag) {
								if (!oneItem.src) {
									if (oneItem.cd.strategy === "notify") {
										notice_object.push({
											env: oneEnv,
											name: results.get_item.name,
											type: results.get_item.type,
											config: oneItem,
											from: inputmaskData.config.from,
											version: inputmaskData.version,
											deployObject: "image"
										});
									} else {
										deploy_object.push({
											env: oneEnv,
											name: results.get_item.name,
											type: results.get_item.type,
											config: oneItem,
											from: inputmaskData.config.from,
											version: inputmaskData.version,
											deployObject: "image"
										});
									}
									report.stage_4.success.push("Item Version " + inputmaskData.version + " for environment " + oneEnv + " was selected with cd status " + oneItem.cd.strategy);
								}
							}
						}
						call();
					}, miniCall);
				}, () => {
					if (deploy_object.length === 0 && notice_object.length === 0) {
						report.stage_4.fail.push("No items for selected version found!");
						return cb(null, report);
					}
					return callback(null, deploy_object, notice_object);
				});
			}],
			start_notice: ["create_deploy_notice", function (results, callback) {
				report.stage_5 = {
					success: [],
					fail: []
				};
				async.each(results.create_deploy_notice[1], function (notice, miniCall) {
					let doc = {
						"env": notice.env,
						"type": "Notification",
						"section": "Continuous delivery",
						"locator": ["Catalog", notice.name, notice.type, notice.version],
						"action": "updated"
					};
					report.stage_5.success.push("Notification sent for item " + notice.name +
						" v " + notice.version + " with cd status " + notice.config.cd.strategy + " in environment " + notice.env);
					sdk.ledger(soajs, doc, {result: true}, miniCall);
				}, callback);
			}],
			start_deploy: ["create_deploy_notice", function (results, callback) {
				async.each(results.create_deploy_notice[0], function (deployObject, eachCall) {
					async.auto({
						computeInput: function (autoCall) {
							let opts = {
								"name": deployObject.name,
								"type": deployObject.type,
								"config": deployObject.config
							};
							opts.config.env = deployObject.env;
							if (deployObject.deployObject === "commit") {
								opts.config.src.from = deployObject.from;
								if (deployObject.from.image_tag) {
									opts.config.recipe.image.tag = deployObject.from.image_tag;
								}
							} else if (deployObject.deployObject === "tag") {
								opts.config.src.tag = deployObject.from.tag;
								opts.config.src.from = deployObject.from;
								if (deployObject.from.image_tag) {
									opts.config.recipe.image.tag = deployObject.from.image_tag;
								}
							} else if (deployObject.deployObject === "image") {
								if (deployObject.from.image_prefix) {
									opts.config.recipe.image.prefix = deployObject.from.image_prefix;
								}
								if (deployObject.from.image_name) {
									opts.config.recipe.image.name = deployObject.from.image_name;
								}
								if (deployObject.from.image_tag) {
									opts.config.recipe.image.tag = deployObject.from.image_tag;
								}
							}
							return autoCall(null, opts);
						},
						//get updated version
						startProcessing: ['computeInput', function (results, autoCall) {
							local.saveConfigurationAndDeploy(soajs, results.computeInput, options, (err, response) => {
								if (err) {
									soajs.log.error(err);
									report.stage_5.fail.push("Item " + results.computeInput.name + " v " + results.computeInput.config.version +
										" with cd status " + results.computeInput.config.cd.strategy + " in environment " + results.computeInput.config.env + " failed to deploy!");
								}
								return autoCall(null, response);
							});
						}],
						updateLedger: ['startProcessing', function (results, autoCall) {
							if (!results.startProcessing) {
								return autoCall();
							}
							report.stage_5.success.push("Item " + results.computeInput.name + " v " + results.computeInput.config.version +
								" with cd status " + results.computeInput.config.cd.strategy + " in environment " + results.computeInput.config.env + " has been successfully deployed");
							return autoCall();
						}]
					}, eachCall);
				}, callback);
			}],
		}, function (err) {
			if (err) {
				return cb(err);
			}
			return cb(err, report);
		});
	}
};

module.exports = lib;
