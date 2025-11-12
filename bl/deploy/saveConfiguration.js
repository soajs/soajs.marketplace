'use strict';

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const { getGroups } = require('../lib/helpers.js');

let bl;

function local(soajs, inputmaskData, options, cb) {
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

		//1- check if the recipe is allowed or no restriction
		if (response.settings) {
			if (response.settings.recipes &&
				response.settings.recipes.length > 0 &&
				response.settings.recipes.indexOf(inputmaskData.config.recipe.id) === -1) {
				return cb(bl.handleError(soajs, 405, null));
			}
			if (response.settings.environments &&
				response.settings.environments.value) {
				if (response.settings.environments.type === "whitelist") {
					if (response.settings.environments.value.length > 0 &&
						response.settings.environments.value.indexOf(inputmaskData.config.env.toUpperCase()) === -1) {
						return cb(bl.handleError(soajs, 406, null));
					}
				} else {
					if (response.settings.environments.value.length > 0 &&
						response.settings.environments.value.indexOf(inputmaskData.config.env.toUpperCase()) > -1) {
						return cb(bl.handleError(soajs, 406, null));
					}
				}
			}
		}
		let data = {
			id: inputmaskData.config.recipe.id
		};
		bl.recipe.get(soajs, data, null, (err, recipe) => {
			if (err) {
				return cb(err);
			}
			let userInputFound = false, secretFound = false;
			if (recipe && recipe.recipe && recipe.recipe.buildOptions && recipe.recipe.buildOptions.env) {
				for (let env in recipe.recipe.buildOptions.env) {
					if (env && recipe.recipe.buildOptions.env[env]) {
						if (recipe.recipe.buildOptions.env[env].type === "userInput") {
							if (!inputmaskData.config.recipe.env || !inputmaskData.config.recipe.env[env]) {
								userInputFound = true;
							}
						}
						if (recipe.recipe.buildOptions.env[env].type === "secret") {
							if (!inputmaskData.config.recipe.env || !inputmaskData.config.recipe.env[env]) {
								secretFound = true;
							}
						}
					}
				}
			}

			if (!inputmaskData.config.recipe.image) {
				inputmaskData.config.recipe.image = {};
			}

			if (!inputmaskData.config.recipe.image.prefix) {
				inputmaskData.config.recipe.image.prefix = recipe.recipe.deployOptions.image.prefix;
			}
			if (!inputmaskData.config.recipe.image.name) {
				inputmaskData.config.recipe.image.name = recipe.recipe.deployOptions.image.name;
			}
			if (!inputmaskData.config.recipe.image.tag) {
				inputmaskData.config.recipe.image.tag = recipe.recipe.deployOptions.image.tag;
			}
			if (inputmaskData.config.src) {
				let src = inputmaskData.config.src.from;
				src.id = inputmaskData.config.src.id;
				inputmaskData.config.src = src;
			}
			if (userInputFound) {
				return cb(bl.handleError(soajs, 408, null));
			}
			if (secretFound) {
				return cb(bl.handleError(soajs, 409, null));
			}
			inputmaskData.response = response;
			let opts = JSON.parse(JSON.stringify(inputmaskData));
			// let opts = Object.assign(inputmaskData);
			// opts.registry = response;
			modelObj.update_item_configuration(opts, (err) => {
				if (err) {
					if (err.message && err.message === 'Marketplace: item [' + opts.name + '] was not updated.') {
						return cb(bl.handleError(soajs, 603, err));
					}
					return cb(bl.handleError(soajs, 602, err));
				}
				return cb(null, "Catalog Item Configuration Successfully updated!");
			});
		});
	});
}

module.exports = function(_bl) {
	bl = _bl;
	return local;
};
