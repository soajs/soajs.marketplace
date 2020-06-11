'use strict';

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

let bl = null;
const lib = require("./lib/deploy");

function getGroups(soajs) {
	let _groups = null;
	if (soajs && soajs.urac && soajs.urac.groups) {
		if (Array.isArray(soajs.urac.groups) && soajs.urac.groups.length > 0) {
			_groups = soajs.urac.groups;
		}
	}
	return _groups;
}

let local = {
	
	"redeploy": (soajs, inputmaskData, options, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs, options);
		modelObj.getItem(inputmaskData, (err, response) => {
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!response) {
				return cb(bl.handleError(soajs, 501, null));
			}
			/*
			1- get item saved deploy configuration
			2- set git info (branch & commit, or tag)
			3- set image info (tag)
			4- save item configuration
		
			5- inspect item deployment from infra ms
			
			6- redeploy, this should call infra ms
			 */
			return cb(null, true);
		});
	},
	"cd": (soajs, inputmaskData, options, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs, options);
		modelObj.getItem(inputmaskData, (err, response) => {
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!response) {
				return cb(bl.handleError(soajs, 501, null));
			}
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
			return cb(null, true);
		});
	},
	"deploy": (soajs, inputmaskData, options, cb) => {
		lib.deploy(soajs, inputmaskData, options, bl, cb);
	},
	"saveConfigurationAndDeploy": (soajs, inputmaskData, options, cb) => {
		local.saveConfiguration(soajs, inputmaskData, options, (error, result) => {
			console.log(result);
			if (error) {
				//
			}
			local.deploy(soajs, inputmaskData, options, () => {
				if (error) {
					//
				}
				//move on
				return cb(null, true);
			});
		});
	},
	"saveConfiguration": (soajs, inputmaskData, options, cb) => {
		if (!inputmaskData) {
			return cb(bl.marketplace.handleError(soajs, 400, null));
		}
		let modelObj = bl.marketplace.mp.getModel(soajs, options);
		inputmaskData._groups = getGroups(soajs);
		modelObj.getItem(inputmaskData, (err, response) => {
			if (err) {
				return cb(bl.marketplace.handleError(soajs, 602, err));
			}
			if (!response) {
				return cb(bl.marketplace.handleError(soajs, 501, null));
			}
			//1- check if the recipe is allowed or no restriction
			if (response.settings) {
				if (response.settings.recipes &&
					response.settings.recipes.length > 0 &&
					response.settings.recipe.indexOf(inputmaskData.config.recipe.id) === -1) {
					return cb(bl.marketplace.handleError(soajs, 405, null));
				}
				if (response.settings.environments &&
					response.settings.environments.value) {
					if (response.settings.environments.type === "whitelist") {
						if (response.settings.environments.value.length > 0 &&
							response.settings.environments.value.indexOf(inputmaskData.config.env.toUpperCase()) === -1) {
							return cb(bl.marketplace.handleError(soajs, 406, null));
						}
					} else {
						if (response.settings.environments.value.length > 0 &&
							response.settings.environments.value.indexOf(inputmaskData.config.toUpperCase()) > -1) {
							return cb(bl.marketplace.handleError(soajs, 406, null));
						}
					}
				}
			}
			soajs.awareness.connect('dashboard', function (res) {
				let options = {
					method: "get",
					uri: "http://" + res.host + "/catalog/recipes/get",
					headers: res.headers,
					json: true,
					qs: {
						id: inputmaskData.config.recipe.id
					}
				};
				request(options, (error, res, body) => {
					if (!body.result) {
						return cb(bl.marketplace.handleError(soajs, body.errors, body.errors));
					}
					let userInputFound = false, secretFound = false;
					if (body.data && body.data.recipe && body.data.recipe.buildOptions && body.data.recipe.buildOptions.env) {
						for (let env in body.data.recipe.buildOptions.env) {
							if (env && body.data.recipe.buildOptions.env[env]) {
								if (body.data.recipe.buildOptions.env[env].type === "userInput") {
									if (!inputmaskData.config.recipe.env || !inputmaskData.config.recipe.env[env]) {
										userInputFound = true;
									}
								}
								if (body.data.recipe.buildOptions.env[env].type === "secret") {
									if (!inputmaskData.config.recipe.env || !inputmaskData.config.recipe.env[env]) {
										secretFound = true;
									}
								}
							}
						}
					}
					if (userInputFound) {
						return cb(bl.marketplace.handleError(soajs, 408, null));
					}
					if (secretFound) {
						return cb(bl.marketplace.handleError(soajs, 409, null));
					}
					inputmaskData.response = response;
					modelObj.update_item_configuration(inputmaskData, (err, response) => {
						if (err) {
							return cb(bl.marketplace.handleError(soajs, 602, err));
						}
						return cb(null, "Catalog Item Configuration Successfully updated!");
					});
				});
				
			});
		});
	}
	
};


module.exports = function (_bl) {
	bl = _bl;
	return local;
};
