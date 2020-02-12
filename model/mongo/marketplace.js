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
	
	let condition = {};
	if (data.keywords) {
		condition.$text = {$search: data.keywords};
	}
	if (data.type) {
		condition.type = data.type;
	}
	if (data.soajs) {
		condition["configuration.subType"] = "soajs";
	} else {
		if (data.subType && data.subType.toLocaleLowerCase() !== "soajs") {
			condition["configuration.subType"] = data.subType;
		} else {
			condition["configuration.subType"] = {$ne: "soajs"};
		}
	}
	condition = __self.add_acl_2_condition(data, condition);
	
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
	
	let condition = {"type": data.type};
	if (data.soajs) {
		condition["configuration.subType"] = "soajs";
	} else {
		if (data.subType && data.subType.toLocaleLowerCase() !== "soajs") {
			condition["configuration.subType"] = data.subType;
		} else {
			condition["configuration.subType"] = {$ne: "soajs"};
		}
	}
	
	condition = __self.add_acl_2_condition(data, condition);
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
		
		let condition = {"_id": _id};
		if (data.soajs) {
			condition["configuration.subType"] = "soajs";
		} else {
			condition["configuration.subType"] = {$ne: "soajs"};
		}
		
		let s = {
			'$set': {
				"settings.recipes": data.recipes
			}
		};
		
		//condition = __self.add_acl_2_condition(data, condition);
		__self.check_if_can_access(data, condition, {}, (error) => {
			if (error) {
				return cb(error);
			}
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
		
		let condition = {"_id": _id};
		if (data.soajs) {
			condition["configuration.subType"] = "soajs";
		} else {
			condition["configuration.subType"] = {$ne: "soajs"};
		}
		
		let s = {
			'$set': {
				"settings.environments.value": data.environments,
				"settings.environments.type": data.type,
				"settings.environments.config": data.config || {}
			}
		};
		
		//condition = __self.add_acl_2_condition(data, condition);
		__self.check_if_can_access(data, condition, {}, (error) => {
			if (error) {
				return cb(error);
			}
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
		
		let condition = {"_id": _id};
		if (data.soajs) {
			condition["configuration.subType"] = "soajs";
		} else {
			condition["configuration.subType"] = {$ne: "soajs"};
		}
		
		let s = {
			'$set': {
				"settings.acl.value": data.acl,
				"settings.acl.type": data.type,
				"settings.acl.config": data.config || {}
			}
		};
		
		//condition = __self.add_acl_2_condition(data, condition);
		__self.check_if_can_access(data, condition, {}, (error) => {
			if (error) {
				return cb(error);
			}
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

Marketplace.prototype.check_if_can_access = function (data, condition, options, cb) {
	let __self = this;
	__self.mongoCore.findOne(colName, condition, options, (err, item) => {
		if (err) {
			return cb(err, null);
		}
		if (!item) {
			let error = new Error("Marketplace: item not found.");
			return cb(error, null);
		}
		if (data.groups && Array.isArray(data.groups)) {
			if (item.settings && item.settings.acl && item.settings.acl.type && item.settings.acl.value && Array.isArray(item.settings.acl.value) && item.settings.acl.value.length > 0) {
				let acl = item.settings.acl;
				let groupsFound = data.groups.some(o => acl.value.includes(o));
				if (acl.type === "whitelist") {
					if (groupsFound) {
						return cb(null, true);
					} else {
						let error = new Error("Marketplace: Access restricted to this item.");
						return cb(error, null);
					}
				}
				if (acl.type === "blacklist") {
					if (groupsFound) {
						let error = new Error("Marketplace: Access restricted to this item.");
						return cb(error, null);
					} else {
						return cb(null, true);
					}
				}
			}
			return cb(null, true);
		} else {
			return cb(null, true);
		}
	});
};

Marketplace.prototype.add_acl_2_condition = function (data, condition) {
	if (data.groups) {
		condition.$or = [
			{"settings.acl.type": {"$exists": false}},
			{"settings.acl.value": {"$exists": false}},
			{
				"$and": [{"settings.acl.type": {"$exists": true, "$eq": "whitelist"}}, {
					"settings.acl.value": {
						"$exists": true,
						"$in": data.groups
					}
				}]
			},
			{
				"$and": [{"settings.acl.type": {"$exists": true, "$eq": "blacklist"}}, {
					"settings.acl.value": {
						"$exists": true,
						"$nin": data.groups
					}
				}]
			}
		];
	}
	if (data.public) {
		if (condition.$or) {
			condition.$or.push({"settings.acl.public.ro": {"$exists": true, "$eq": true}});
		} else {
			condition["settings.acl.public.ro"] = {"$exists": true, "$eq": true};
		}
	}
	return condition;
};

Marketplace.prototype.closeConnection = function () {
	let __self = this;
	__self.mongoCore.closeDb();
};

module.exports = Marketplace;