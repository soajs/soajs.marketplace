/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";
const colName = "favorite";
const core = require("soajs");
const Mongo = core.mongo;

let indexing = {};

function Favorite(service, options, mongoCore) {
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
		
		let index = "default";
		if (options && options.index) {
			index = options.index;
		}
		if (indexing && !indexing[index]) {
			indexing[index] = true;
			
			__self.mongoCore.createIndex(colName, {'type': 1, 'userid': 1}, {}, (err, index) => {
				service.log.debug("Index: " + index + " created with error: " + err);
			});
			
			service.log.debug("favorite: Indexes for " + index + " Updated!");
		}
	}
}

Favorite.prototype.add = function (data, cb) {
	let __self = this;
	if (!data || !data.type || !data.service || !data.who || !data.who._id) {
		let error = new Error("Favorite: type, service, and who are required.");
		return cb(error, null);
	}
	let condition = {"type": data.type, "userid": data.who._id};
	let s = {
		$set: {
			"type": data.type,
			"userid": data._id
		},
		$addToSet: {
			"favorites": data.service
		}
	};
	
	__self.mongoCore.updateOne(colName, condition, s, {"upsert": true}, cb);
};

Favorite.prototype.get = function (data, cb) {
	let __self = this;
	if (!data || !data.type || !data.who || !data.who._id) {
		let error = new Error("Favorite: type, and who are required.");
		return cb(error, null);
	}
	let condition = {"type": data.type, "userid": data.who._id};
	
	let options = {};
	__self.mongoCore.findOne(colName, condition, options, (error, response) => {
		if (error) {
			return cb(error);
		} else {
			return cb(null, response);
		}
	});
};

Favorite.prototype.delete = function (data, cb) {
	let __self = this;
	if (!data || !data.type || !data.service || !data.who || !data.who._id) {
		let error = new Error("Favorite: type, service, and who are required.");
		return cb(error, null);
	}
	
	let condition = {"type": data.type, "userid": data.who._id};
	let s = {"$pull": {favorites: data.service}};
	
	__self.mongoCore.updateOne(colName, condition, s, null, cb);
};

Favorite.prototype.closeConnection = function () {
	let __self = this;
	__self.mongoCore.closeDb();
};

module.exports = Favorite;