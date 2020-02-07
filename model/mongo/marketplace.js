/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";
const colName = "marketplace";
const core = require("soajs");
//const async = require("async");
const Mongo = core.mongo;

let indexing = {};

function Marketplace(service, options, mongoCore) {
	let __self = this;
	
	if (mongoCore) {
		__self.mongoCore = mongoCore;
	}
	if (!__self.mongoCore) {
		if (options && options.dbConfig) {
			__self.mongoCore = new Mongo(options.dbConfig);
		} else {
			let registry = service.registry.get();
			__self.mongoCore = new Mongo(registry.coreDB.provision);
		}
	}
	let index = "default";
	if (options && options.index) {
		index = options.index;
	}
	if (indexing && !indexing[index]) {
		indexing[index] = true;
		
		__self.mongoCore.createIndex(colName, {
			"name": "text",
			"description": "text"
		}, {}, (err, index) => {
			service.log.debug("Index: " + index + " created with error: " + err);
		});
		__self.mongoCore.createIndex(colName, {
			"type": 1,
			"configuration.subType": 1
		}, {}, (err, index) => {
			service.log.debug("Index: " + index + " created with error: " + err);
		});
		service.log.debug("Marketplace: Indexes for " + index + " Updated!");
	}
}

Marketplace.prototype.getItems_by_keywords = function (data, cb) {
	let __self = this;
	let condition = {};
	let options = {
		"skip": 0,
		"limit": 100
	};
	if (data && data.limit) {
		options.skip = data.start;
		options.limit = data.limit;
		options.sort = {};
	}
	if (data && data.keywords) {
		condition = {$text: {$search: data.keywords}};
	}
	__self.mongoCore.find(colName, condition, options, (err, items) => {
		if (err) {
			return cb(err, null);
		}
		let response = {};
		response.limit = options.limit;
		response.start = options.skip;
		response.size = items.length;
		response.records = items;
		if (items.length < options.limit) {
			response.count = items.length;
			return cb(null, response);
		} else {
			__self.mongoCore.count(colName, condition, (err, count) => {
				if (err) {
					return cb(err, null);
				}
				response.count = count;
				return cb(null, response);
			});
		}
	});
};
Marketplace.prototype.getItems_by_type_subtype = function (data, cb) {
	let __self = this;
	if (!data || !data.type) {
		let error = new Error("Marketplace: type is required.");
		return cb(error, null);
	}
	let condition = {
		"type": data.type
	};
	let options = {
		"skip": 0,
		"limit": 100
	};
	if (data && data.limit) {
		options.skip = data.start;
		options.limit = data.limit;
		options.sort = {};
	}
	if (data.subType) {
		condition["configuration.subType"] = data.subType;
	}
	__self.mongoCore.find(colName, condition, options, (err, items) => {
		if (err) {
			return cb(err, null);
		}
		let response = {};
		response.limit = options.limit;
		response.start = options.skip;
		response.size = items.length;
		response.records = items;
		if (items.length < options.limit) {
			response.count = items.length;
			return cb(null, response);
		} else {
			__self.mongoCore.count(colName, condition, (err, count) => {
				if (err) {
					return cb(err, null);
				}
				response.count = count;
				return cb(null, response);
			});
		}
	});
};

Marketplace.prototype.closeConnection = function () {
	let __self = this;
	__self.mongoCore.closeDb();
};

module.exports = Marketplace;