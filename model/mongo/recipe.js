/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";
const colName = "catalogs";
const core = require("soajs");
const Mongo = core.mongo;
const async = require('async');

let indexing = {};

function Recipe(service, options, mongoCore) {
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
		service.log.debug("Recipe: Indexes for " + index + " Updated!");
	}
}


Recipe.prototype.validateId = function (id, cb) {
	let __self = this;
	
	if (!id) {
		let error = new Error("Recipe: must provide an id.");
		return cb(error, null);
	}
	
	try {
		id = __self.mongoCore.ObjectId(id);
		return cb(null, id);
	} catch (e) {
		__self.log(e.message);
		return cb(new Error("A valid ID is required"), null);
	}
};

Recipe.prototype.getItem_by_id = function (data, cb) {
	let __self = this;
	if (!data || !data.id) {
		let error = new Error("Recipe: id is required.");
		return cb(error, null);
	}
	let condition = {};
	if (data.version) {
		condition = {
			refId: data.id,
			v: data.version
		};
		let final_coll = colName + "_versioning";
		__self.mongoCore.findOne(final_coll, condition, {}, (err, item) => {
			if (err) {
				return cb(err);
			}
			return cb(null, item);
		});
	} else {
		let final_coll = colName;
		__self.validateId(data.id, (err, _id) => {
			if (err) {
				return cb(err, null);
			}
			
			condition = {"_id": _id};
			__self.mongoCore.findOne(final_coll, condition, {}, (err, item) => {
				if (err) {
					return cb(err);
				}
				return cb(null, item);
			});
		});
	}
};

Recipe.prototype.getItems = function (data, cb) {
	let __self = this;
	if (!data) {
		let error = new Error("Recipe: data is required.");
		return cb(error, null);
	}
	let condition = {};
	let options = {
		"skip": 0,
		"limit": 500
	};
	if (data.hasOwnProperty("limit")) {
		options.limit = data.limit;
	}
	if (data.hasOwnProperty("start")) {
		options.skip = data.start;
	}
	let final_coll = colName;
	if (Object.hasOwnProperty.call(data, 'version') && data.version) {
		final_coll = colName + "_versioning";
	}
	if (data && data.keywords) {
		let rePattern = new RegExp(data.keywords, 'i');
		condition.$or = [
			{"name": {"$regex": rePattern}},
			{"description": {"$regex": rePattern}}
		];
	}
	__self.mongoCore.find(final_coll, condition, options, (err, items) => {
		if (err) {
			return cb(err);
		}
		if (data.count) {
			let response = {};
			response.limit = options.limit;
			response.start = options.skip;
			// response.size = items.length;
			response.records = items;
			// if (items.length < options.limit) {
			// 	response.count = items.length;
			// 	return cb(null, response);
			// } else {
				__self.mongoCore.countDocuments(final_coll, condition, {}, (err, count) => {
					if (err) {
						return cb(err, null);
					}
					response.count = count;
					return cb(null, response);
				});
			// }
		} else {
			return cb(null, items);
		}
	});
};

Recipe.prototype.getItems_by_ids = function (data, cb) {
	let __self = this;
	if (!data || !data.ids || data.ids.length === 0) {
		let error = new Error("Recipe: ids is required.");
		return cb(error, null);
	}
	let condition = {};
	
	let _ids = [];
	async.each(data.ids, function (id, callback) {
		__self.validateId(id, (err, _id) => {
			if (err) {
				return callback(err);
			}
			_ids.push(_id);
			return callback();
		});
	}, function (error) {
		if (error) {
			return cb(error);
		}
		condition = {_id: {$in: _ids}};
		__self.mongoCore.find(colName, condition, {}, (err, items) => {
			if (err) {
				return cb(err);
			}
			return cb(null, items);
		});
	});
};

Recipe.prototype.addItem = function (data, cb) {
	let __self = this;
	if (!data || !data.catalog) {
		let error = new Error("Recipe: catalog is required.");
		return cb(error, null);
	}
	let options = {};
	let versioning = true;
	__self.mongoCore.insertOne(colName, data.catalog, options, versioning, cb);
};

Recipe.prototype.editItem = function (data, cb) {
	let __self = this;
	if (!data || !data.catalog || !data.id) {
		let error = new Error("Recipe: id and catalog are required.");
		return cb(error, null);
	}
	let options = {};
	let versioning = true;
	__self.validateId(data.id, (err, _id) => {
		if (err) {
			return cb(err, null);
		}
		
		let condition = {"_id": _id};
		let s = {
			'$set': data.catalog
		};
		__self.mongoCore.updateOne(colName, condition, s, options, versioning, (err, record) => {
			if (err) {
				return cb(err);
			}
			if (!record || (record && !record.nModified)) {
				let error = new Error("Recipe: item [" + data.id + "] was not updated.");
				return cb(error);
			}
			return cb(null, record.nModified);
		});
	});
	
};

Recipe.prototype.deleteItem = function (data, cb) {
	let __self = this;
	if (!data || !data.id) {
		let error = new Error("Recipe: id is required.");
		return cb(error, null);
	}
	let condition = {};
	if (data.version) {
		condition = {
			refId: data.id,
			v: data.version
		};
		let final_coll = colName + "_versioning";
		__self.mongoCore.deleteOne(final_coll, condition, {}, (err) => {
			return cb(err);
		});
	} else {
		let final_coll = colName;
		__self.validateId(data.id, (err, _id) => {
			if (err) {
				return cb(err, null);
			}
			
			condition = {"_id": _id};
			__self.mongoCore.deleteOne(final_coll, condition, {}, (err) => {
				return cb(err);
			});
		});
	}
};

Recipe.prototype.closeConnection = function () {
	let __self = this;
	__self.mongoCore.closeDb();
};

module.exports = Recipe;