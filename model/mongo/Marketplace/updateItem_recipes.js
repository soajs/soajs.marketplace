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
};
