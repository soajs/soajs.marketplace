/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

'use strict';

const async = require("async");
const fs = require("fs");

let SSOT = {};
let model = process.env.SOAJS_SERVICE_MODEL || "mongo";
const BLs = ["marketplace", "recipe", "favorite"];

// Require modular BL exports
const _marketplace = require("./marketplace/index.js");
const _recipe = require("./recipe/index.js");
const _favorite = require("./favorite/index.js");
const _deploy = require("./deploy/index.js");

let BL = {
	init: init,
	marketplace: null,
	recipe: null,
	favorite: null,
	deploy: null
};

function init(service, localConfig, cb) {
	// Initialize shared error handler
	const handleError = (soajs, errCode, err) => {
		if (err) {
			soajs.log.error(err.message);
		}
		return ({
			"code": errCode,
			"msg": localConfig.errors[errCode] + ((err && (errCode === 602 || errCode === 503 || errCode === 422)) ? err.message : "")
		});
	};

	// Initialize shared model helpers
	const mp = {
		"getModel": (soajs) => {
			let modelObj = BL.modelObj_marketplace || BL.modelObj_recipe || BL.modelObj_favorite;
			if (soajs && soajs.tenant && soajs.tenant.type === "client" && soajs.tenant.dbConfig) {
				let opts = {
					"dbConfig": soajs.tenant.dbConfig,
					"index": soajs.tenant.id
				};
				// Determine which model to use based on context
				if (BL.model_marketplace) {
					modelObj = new BL.model_marketplace(service, opts, null);
				} else if (BL.model_recipe) {
					modelObj = new BL.model_recipe(service, opts, null);
				} else if (BL.model_favorite) {
					modelObj = new BL.model_favorite(service, opts, null);
				}
			}
			return modelObj;
		},
		"closeModel": (soajs, modelObj) => {
			if (soajs && soajs.tenant && soajs.tenant.type === "client" && soajs.tenant.dbConfig) {
				modelObj.closeConnection();
			}
		}
	};

	// Initialize models for each BL
	let fillModels = (blName, callback) => {
		// Capitalize first letter for directory name (marketplace -> Marketplace)
		let capitalizedName = blName.charAt(0).toUpperCase() + blName.slice(1);
		let typeModel = __dirname + `/../model/${model}/${capitalizedName}/index.js`;

		if (fs.existsSync(typeModel)) {
			SSOT[`${blName}Model`] = require(typeModel);
			SSOT[`${blName}ModelObj`] = new SSOT[`${blName}Model`](service, null, null);
		}
		if (SSOT[`${blName}ModelObj`]) {
			BL[`modelObj_${blName}`] = SSOT[`${blName}ModelObj`];
			BL[`model_${blName}`] = SSOT[`${blName}Model`];
			return callback(null);
		} else {
			return callback({name: blName, model: typeModel});
		}
	};

	async.each(BLs, fillModels, function (err) {
		if (err) {
			service.log.error(`Requested model not found. make sure you have a model for ${err.name} @ ${err.model}`);
			return cb({"code": 601, "msg": localConfig.errors[601]});
		}

		// Create the BL context to inject into all modules
		const blContext = {
			handleError,
			mp,
			localConfig,
			soajs_service: service,
			modelObj_marketplace: BL.modelObj_marketplace,
			modelObj_recipe: BL.modelObj_recipe,
			modelObj_favorite: BL.modelObj_favorite,
			model_marketplace: BL.model_marketplace,
			model_recipe: BL.model_recipe,
			model_favorite: BL.model_favorite
		};

		// Initialize marketplace BL with factory pattern
		BL.marketplace = {};
		for (let op in _marketplace) {
			if (_marketplace.hasOwnProperty(op)) {
				BL.marketplace[op] = _marketplace[op](blContext);
			}
		}
		blContext.marketplace = BL.marketplace;

		// Initialize recipe BL with factory pattern
		BL.recipe = {};
		for (let op in _recipe) {
			if (_recipe.hasOwnProperty(op)) {
				BL.recipe[op] = _recipe[op](blContext);
			}
		}
		blContext.recipe = BL.recipe;

		// Initialize favorite BL with factory pattern
		BL.favorite = {};
		for (let op in _favorite) {
			if (_favorite.hasOwnProperty(op)) {
				BL.favorite[op] = _favorite[op](blContext);
			}
		}
		blContext.favorite = BL.favorite;

		// Initialize deploy BL with factory pattern
		BL.deploy = {};
		for (let op in _deploy) {
			if (_deploy.hasOwnProperty(op)) {
				BL.deploy[op] = _deploy[op](blContext);
			}
		}
		blContext.deploy = BL.deploy;

		// Expose necessary properties
		BL.handleError = handleError;
		BL.mp = mp;
		BL.localConfig = localConfig;

		return cb(null);
	});
}

module.exports = BL;
