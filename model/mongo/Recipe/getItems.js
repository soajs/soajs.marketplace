/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

const colName = "catalogs";

module.exports = (Recipe) => {
	Recipe.prototype.getItems = function (data, cb) {
		let __self = this;
		if (!data) {
			let error = new Error("Recipe: data is required.");
			return cb(error, null);
		}
		let condition = {};
		let options = {
			"sort": {"name": 1},
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
};
