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
};
