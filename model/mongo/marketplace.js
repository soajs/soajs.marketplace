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
	if (__self.log) {
		__self.log = service.log;
	} else {
		__self.log = (log) => {
			console.log(log);
		};
	}
	
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
			"description": "text",
			"type": 1,
			"configuration.subType": 1
		}, {}, (err, index) => {
			service.log.debug("Index: " + index + " created with error: " + err);
		});
		__self.mongoCore.createIndex(colName, {
			"name": "text",
			"description": "text",
			"configuration.subType": 1
		}, {}, (err, index) => {
			service.log.debug("Index: " + index + " created with error: " + err);
		});
		__self.mongoCore.createIndex(colName, {
			"type": 1,
			"configuration.subType": 1
		}, {}, (err, index) => {
			service.log.debug("Index: " + index + " created with error: " + err);
		});
		__self.mongoCore.createIndex(colName, {
			"configuration.subType": 1
		}, {}, (err, index) => {
			service.log.debug("Index: " + index + " created with error: " + err);
		});
		service.log.debug("Marketplace: Indexes for " + index + " Updated!");
	}
}

Marketplace.prototype.getItems_by_keywords = function (data, cb) {
	let __self = this;
	let options = {
		"skip": 0,
		"limit": 100
	};
	options.sort = {};
	if (data && data.limit) {
		options.limit = data.limit;
	}
	if (data && data.start) {
		options.skip = data.start;
	}
	
	let condition = {$and: []};
	if (data.keywords) {
		condition.$and.push({$text: {$search: data.keywords}});
	}
	if (data.type) {
		condition.$and.push({type: data.type});
	}
	if (data.subType && data.subType.toLocaleLowerCase() !== "soajs") {
		condition.$and.push({"configuration.subType": data.subType});
	}
	if (data.soajs) {
		condition.$and.push({"configuration.subType": "soajs"});
	} else {
		condition.$and.push({"configuration.subType": {$ne: "soajs"}});
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
			__self.mongoCore.countDocuments(colName, condition, {}, (err, count) => {
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
	let options = {
		"skip": 0,
		"limit": 100
	};
	options.sort = {};
	if (data && data.limit) {
		options.limit = data.limit;
	}
	if (data && data.start) {
		options.skip = data.start;
	}
	
	let condition = {$and: [{"type": data.type}]};
	if (data.subType && data.subType.toLocaleLowerCase() !== "soajs") {
		condition.$and.push({"configuration.subType": data.subType});
	}
	if (data.soajs) {
		condition.$and.push({"configuration.subType": "soajs"});
	} else {
		condition.$and.push({"configuration.subType": {$ne: "soajs"}});
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
			__self.mongoCore.countDocuments(colName, condition, {}, (err, count) => {
				if (err) {
					return cb(err, null);
				}
				response.count = count;
				return cb(null, response);
			});
		}
	});
};

Marketplace.prototype.updateItem_recipes = function (data, cb) {
	let __self = this;
	if (!data || !data.id || !data.recipes) {
		let error = new Error("Marketplace: id and recipes are required.");
		return cb(error, null);
	}
	if (!Array.isArray(data.recipes)) {
		let error = new Error("Marketplace: recipes must be an array.");
		return cb(error, null);
	}
	__self.validateId(data.id, (err, _id) => {
		if (err) {
			return cb(err, null);
		}
		
		let condition = {$and: [{"_id": _id}]};
		if (data.soajs) {
			condition.$and.push({"configuration.subType": "soajs"});
		} else {
			condition.$and.push({"configuration.subType": {$ne: "soajs"}});
		}
		
		let s = {
			'$set': {
				"settings.recipes": data.recipes
			}
		};
		__self.mongoCore.updateOne(colName, condition, s, null, (err, record) => {
			if (err) {
				return cb(err);
			}
			if (!record || (record && !record.nModified)) {
				let error = new Error("Marketplace: item [" + data.id + "] was not updated.");
				return cb(error);
			}
			return cb(null, record.nModified);
		});
		
	});
};

Marketplace.prototype.updateItem_environments = function (data, cb) {
	let __self = this;
	if (!data || !data.id || !data.type || !data.environments) {
		let error = new Error("Marketplace: id, type and environments are required.");
		return cb(error, null);
	}
	let allowedTypes = ["blackList", "whitelist"];
	if (!allowedTypes.includes(data.type)) {
		let error = new Error("Marketplace: type can only be one of the following: " + allowedTypes.join(","));
		return cb(error, null);
	}
	if (!Array.isArray(data.environments)) {
		let error = new Error("Marketplace: environments must be an array.");
		return cb(error, null);
	}
	__self.validateId(data.id, (err, _id) => {
		if (err) {
			return cb(err, null);
		}
		
		let condition = {$and: [{"_id": _id}]};
		if (data.soajs) {
			condition.$and.push({"configuration.subType": "soajs"});
		} else {
			condition.$and.push({"configuration.subType": {$ne: "soajs"}});
		}
		
		let s = {
			'$set': {
				"settings.environments.value": data.environments,
				"settings.environments.type": data.type,
				"settings.environments.config": data.config || {}
			}
		};
		__self.mongoCore.updateOne(colName, condition, s, null, (err, record) => {
			if (err) {
				return cb(err);
			}
			if (!record || (record && !record.nModified)) {
				let error = new Error("Marketplace: item [" + data.id + "] was not updated.");
				return cb(error);
			}
			return cb(null, record.nModified);
		});
		
	});
};

Marketplace.prototype.updateItem_acl = function (data, cb) {
	let __self = this;
	if (!data || !data.id || !data.type || !data.acl) {
		let error = new Error("Marketplace: id, type and acl are required.");
		return cb(error, null);
	}
	let allowedTypes = ["blackList", "whitelist"];
	if (!allowedTypes.includes(data.type)) {
		let error = new Error("Marketplace: type can only be one of the following: " + allowedTypes.join(","));
		return cb(error, null);
	}
	if (!Array.isArray(data.acl)) {
		let error = new Error("Marketplace: acl must be an array.");
		return cb(error, null);
	}
	__self.validateId(data.id, (err, _id) => {
		if (err) {
			return cb(err, null);
		}
		
		let condition = {$and: [{"_id": _id}]};
		if (data.soajs) {
			condition.$and.push({"configuration.subType": "soajs"});
		} else {
			condition.$and.push({"configuration.subType": {$ne: "soajs"}});
		}
		
		let s = {
			'$set': {
				"settings.acl.value": data.acl,
				"settings.acl.type": data.type,
				"settings.acl.config": data.config || {}
			}
		};
		__self.mongoCore.updateOne(colName, condition, s, null, (err, record) => {
			if (err) {
				return cb(err);
			}
			if (!record || (record && !record.nModified)) {
				let error = new Error("Marketplace: item [" + data.id + "] was not updated.");
				return cb(error);
			}
			return cb(null, record.nModified);
		});
		
	});
};

Marketplace.prototype.validateId = function (id, cb) {
	let __self = this;
	
	if (!id) {
		let error = new Error("User: must provide an id.");
		return cb(error, null);
	}
	
	try {
		id = __self.mongoCore.ObjectId(id);
		return cb(null, id);
	} catch (e) {
		__self.log(e);
		return cb(new Error("A valid ID is required"), null);
	}
};

Marketplace.prototype.closeConnection = function () {
	let __self = this;
	__self.mongoCore.closeDb();
};

module.exports = Marketplace;