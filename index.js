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

const service = new soajs.server.service(config);

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
		
		//DELETE methods
		
		
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
		
		//POST methods
		
		service.start();
	});
});