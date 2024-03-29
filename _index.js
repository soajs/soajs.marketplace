'use strict';

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const soajs = require('soajs');

let config = require('./config.js');
config.packagejson = require("./package.json");

const bl = require("./bl/index.js");
const sdk = require("./lib/sdk.js");

const service = new soajs.server.service(config);

function run(serviceStartCb) {
	service.init(() => {
		bl.init(service, config, (error) => {
			if (error) {
				throw new Error('Failed starting service');
			}
			
			//GET methods
			service.get("/soajs/items", function (req, res) {
				req.soajs.inputmaskData.soajs = true;
				bl.marketplace.getItems_by_keywords(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/public/items", function (req, res) {
				req.soajs.inputmaskData.public = true;
				bl.marketplace.getItems_by_keywords(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.get("/items", function (req, res) {
				bl.marketplace.getItems_by_keywords(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.get("/items/type", function (req, res) {
				bl.marketplace.getItems_by_type_subtype(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.get("/items/type/all", function (req, res) {
				req.soajs.inputmaskData.all = true;
				bl.marketplace.getItems_by_type_subtype(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.get("/items/type/name", function (req, res) {
				req.soajs.inputmaskData.all = true;
				req.soajs.inputmaskData.name = true;
				bl.marketplace.getItems_by_type_subtype(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/items/type/names", function (req, res) {
				bl.marketplace.getItem_by_names(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/items/src", function (req, res) {
				bl.marketplace.getItem_by_source(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/item/type", function (req, res) {
				bl.marketplace.getItem_by_type(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/item/deploy/inspect", function (req, res) {
				bl.deploy.inspect(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/recipe", function (req, res) {
				bl.recipe.get(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/recipes", function (req, res) {
				bl.recipe.list(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/recipes/ids", function (req, res) {
				bl.recipe.list_by_ids(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.get("/favorite", function (req, res) {
				bl.favorite.get(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			//DELETE methods
			service.delete("/item", function (req, res) {
				bl.marketplace.deleteItem(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.delete("/items/src", function (req, res) {
				bl.marketplace.deleteItem_source(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.delete("/recipe", function (req, res) {
				bl.recipe.delete(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.delete("/favorite", function (req, res) {
				bl.favorite.delete(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			//PUT methods
			service.put("/soajs/item/environments", function (req, res) {
				req.soajs.inputmaskData.soajs = true;
				bl.marketplace.updateItem_environments(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.put("/soajs/item/recipes", function (req, res) {
				req.soajs.inputmaskData.soajs = true;
				bl.marketplace.updateItem_recipes(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.put("/soajs/item/acl", function (req, res) {
				req.soajs.inputmaskData.soajs = true;
				bl.marketplace.updateItem_acl(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.put("/item/environments", function (req, res) {
				bl.marketplace.updateItem_environments(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.put("/item/recipes", function (req, res) {
				bl.marketplace.updateItem_recipes(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.put("/item/acl", function (req, res) {
				bl.marketplace.updateItem_acl(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.put("/item/branch", function (req, res) {
				bl.marketplace.deleteItem_branch(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.put("/items/branches", function (req, res) {
				bl.marketplace.update_items_branches(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.put("/item/tag", function (req, res) {
				bl.marketplace.deleteItem_tag(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.put("/item/resource", function (req, res) {
				req.soajs.inputmaskData.item.soa.type = "resource";
				bl.marketplace.addItem(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.put("/item/service", function (req, res) {
				req.soajs.inputmaskData.item.soa.type = "service";
				bl.marketplace.addItem(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.put("/item/daemon", function (req, res) {
				req.soajs.inputmaskData.item.soa.type = "daemon";
				bl.marketplace.addItem(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.put("/item/static", function (req, res) {
				req.soajs.inputmaskData.item.soa.type = "static";
				bl.marketplace.addItem(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.put("/item/custom", function (req, res) {
				req.soajs.inputmaskData.item.soa.type = "custom";
				bl.marketplace.addItem(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.put("/item/config", function (req, res) {
				req.soajs.inputmaskData.item.soa.type = "config";
				bl.marketplace.addItem(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			service.put("/item/version/configuration", function (req, res) {
				bl.marketplace.update_item_version_config(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.put("/item/service/soajs", function (req, res) {
				req.soajs.inputmaskData.item.soa.type = "service";
				bl.marketplace.addItem(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.put("/item/deploy/redeploy", function (req, res) {
				bl.deploy.redeploy(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					let response = req.soajs.buildResponse(error, data);
					res.json(response);
					let doc = {
						"env": req.soajs.inputmaskData.env,
						"type": "Deployment",
						"section": "Catalog",
						"locator": ["deploy", req.soajs.inputmaskData.name],
						"action": "updated"
					};
					sdk.ledger(req.soajs, doc, response, () => {
					});
				});
			});
			service.put("/item/deploy/cd", function (req, res) {
				bl.deploy.cd(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					let response = req.soajs.buildResponse(error, data);
					if (!error && data) {
						let success = true;
						for (let stage in data) {
							if (stage && data.hasOwnProperty(stage) && data[stage]) {
								if (data[stage].fail.length > 0) {
									success = false;
								}
							}
						}
						if (!success) {
							response.result = false;
						}
					}
					res.json(response);
					let doc = {
						"type": "Deployment",
						"section": "Continuous delivery",
						"locator": ["configure", "deploy", req.soajs.inputmaskData.name],
						"action": "updated"
					};
					sdk.ledger(req.soajs, doc, response, () => {
					});
				});
			});
			service.put("/item/deploy", function (req, res) {
				bl.deploy.deploy(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					let response = req.soajs.buildResponse(error, data);
					res.json(response);
					let doc = {
						"env": req.soajs.inputmaskData.config ? req.soajs.inputmaskData.config.env : req.soajs.inputmaskData.env,
						"type": "Deployment",
						"section": "Catalog",
						"locator": ["deploy", req.soajs.inputmaskData.name],
						"action": "updated"
					};
					sdk.ledger(req.soajs, doc, response, () => {
					});
				});
			});
			service.put("/item/deploy/configure", function (req, res) {
				bl.deploy.saveConfiguration(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					let response = req.soajs.buildResponse(error, data);
					res.json(response);
					let doc = {
						"env": req.soajs.inputmaskData.config ? req.soajs.inputmaskData.config.env : req.soajs.inputmaskData.env,
						"type": "Deployment",
						"section": "Catalog",
						"locator": ["configure", req.soajs.inputmaskData.name],
						"action": "updated"
					};
					sdk.ledger(req.soajs, doc, response, () => {
					});
				});
			});
			service.put("/item/deploy/build", function (req, res) {
				bl.deploy.saveConfigurationAndDeploy(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					let response = req.soajs.buildResponse(error, data);
					res.json(response);
					let doc = {
						"env": req.soajs.inputmaskData.env,
						"type": "Deployment",
						"section": "Catalog",
						"locator": ["configure", "deploy", req.soajs.inputmaskData.name],
						"action": "updated"
					};
					sdk.ledger(req.soajs, doc, response, () => {
					});
				});
			});
			service.put("/item/maintenance", function (req, res) {
				bl.marketplace.maintenance(req.soajs, req.soajs.inputmaskData, null, soajs, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.put("/recipe", function (req, res) {
				bl.recipe.edit(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			//POST methods
			
			service.post("/recipe", function (req, res) {
				bl.recipe.add(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.post("/favorite", function (req, res) {
				bl.favorite.add(req.soajs, req.soajs.inputmaskData, null, (error, data) => {
					return res.json(req.soajs.buildResponse(error, data));
				});
			});
			
			service.start(serviceStartCb);
		});
	});
}

function stop(serviceStopCb) {
	service.stop(serviceStopCb);
}

module.exports = {
	"runService": (serviceStartCb) => {
		if (serviceStartCb && typeof serviceStartCb === "function") {
			run(serviceStartCb);
		} else {
			run(null);
		}
	},
	"stopService": (serviceStopCb) => {
		if (serviceStopCb && typeof serviceStopCb === "function") {
			stop(serviceStopCb);
		} else {
			stop(null);
		}
	}
};