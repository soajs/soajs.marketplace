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
};
