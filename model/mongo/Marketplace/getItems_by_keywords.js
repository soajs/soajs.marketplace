/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

const colName = "marketplace";

module.exports = (Marketplace) => {
	Marketplace.prototype.getItems_by_keywords = function (data, cb) {
		let __self = this;
		let options = {
			"skip": 0,
			"limit": 100
		};
		options.sort = {
			name: 1
		};
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
		if (data.soajs) {
			condition["configuration.subType"] = "soajs";
		} else {
			if (data.subType && data.subType.toLocaleLowerCase() !== "soajs") {
				condition["configuration.subType"] = data.subType;
			} else {
				condition["configuration.subType"] = {$ne: "soajs"};
			}
		}
		if (data.type) {
			condition.type = data.type;
		}
		if (data.types && Array.isArray(data.types)) {
			condition.type = {$in: data.types};
		}
		if (data.compact) {
			options.projection = {
				"deploy": 0,
				"versions.swagger": 0,
				"versions.soa": 0,
				"versions.documentation": 0
			};
		}
		condition = __self.add_acl_2_condition(data, condition);
		__self.mongoCore.find(colName, condition, options, (err, items) => {
			if (err) {
				return cb(err, null);
			}
			let response = {};
			response.limit = options.limit;
			response.start = options.skip;
			response.records = items;
			__self.mongoCore.countDocuments(colName, condition, {}, (err, count) => {
				if (err) {
					return cb(err, null);
				}
				response.count = count;
				return cb(null, response);
			});
		});
	};
};
