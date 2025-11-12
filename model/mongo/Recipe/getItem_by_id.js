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
};
