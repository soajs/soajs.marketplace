'use strict';

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

let bl = null;
const lib_deploy = require("./lib/deploy");
const lib_redeploy = require("./lib/redeploy");
const lib_cd = require("./lib/cd");
const request = require("request");

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
		lib_redeploy.redeploy(soajs, inputmaskData, options, bl, cb);
	},
	"cd": (soajs, inputmaskData, options, cb) => {
		lib_cd.cd(soajs, inputmaskData, options, bl, local, cb);
	},
	"deploy": (soajs, inputmaskData, options, cb) => {
		lib_deploy.deploy(soajs, inputmaskData, options, bl, cb);
	},
	"saveConfigurationAndDeploy": (soajs, inputmaskData, options, cb) => {
		if (!inputmaskData) {
			return cb(bl.marketplace.handleError(soajs, 400, null));
		}
		local.saveConfiguration(soajs, inputmaskData, options, (error, item) => {
			if (error && error.code !== 603) {
				return cb(error);
			}
			inputmaskData.env = inputmaskData.config.env;
			lib_deploy.deploy(soajs, inputmaskData, item, bl, cb);
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
					response.settings.recipes.indexOf(inputmaskData.config.recipe.id) === -1) {
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
							response.settings.environments.value.indexOf(inputmaskData.config.env.toUpperCase()) > -1) {
							return cb(bl.marketplace.handleError(soajs, 406, null));
						}
					}
				}
			}
			
			soajs.awareness.connect('dashboard', "1", function (res) {
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
					if (error || !body.result) {
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
					
					if (!inputmaskData.config.recipe.image){
						inputmaskData.config.recipe.image = {};
					}
					
					if (!inputmaskData.config.recipe.image.prefix){
						inputmaskData.config.recipe.image.prefix = body.data.recipe.deployOptions.image.prefix;
					}
					if (!inputmaskData.config.recipe.image.name){
						inputmaskData.config.recipe.image.name = body.data.recipe.deployOptions.image.name;
					}
					if (!inputmaskData.config.recipe.image.tag){
						inputmaskData.config.recipe.image.tag = body.data.recipe.deployOptions.image.tag;
					}
					if (inputmaskData.config.src) {
						let src = inputmaskData.config.src.from;
						src.id = inputmaskData.config.src.id;
						inputmaskData.config.src = src;
					}
					if (userInputFound) {
						return cb(bl.marketplace.handleError(soajs, 408, null));
					}
					if (secretFound) {
						return cb(bl.marketplace.handleError(soajs, 409, null));
					}
					inputmaskData.response = response;
					let opts = JSON.parse(JSON.stringify(inputmaskData));
					modelObj.update_item_configuration(opts, (err) => {
						if (err) {
							if (err.message && err.message === 'Marketplace: item [' + opts.name + '] was not updated.'){
								return cb(bl.marketplace.handleError(soajs, 603, err));
							}
							return cb(bl.marketplace.handleError(soajs, 602, err));
						}
						return cb(null, "Catalog Item Configuration Successfully updated!");
					});
				});
				
			});
		});
	},
	
	"inspect": (soajs, inputmaskData, options, cb) => {
		return cb (null, true);
	}
	
};


module.exports = function (_bl) {
	bl = _bl;
	return local;
};
