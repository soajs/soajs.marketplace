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
	Marketplace.prototype.getItem_by_names = function (data, cb) {
		let __self = this;
		if (!data || !data.names || !data.types) {
			let error = new Error("Marketplace: type and name are required.");
			return cb(error, null);
		}

		let condition = {
			"name": {
				"$in": data.names
			},
			"type": {$in: data.types}
		};
		condition = __self.add_acl_2_condition(data, condition);
		__self.mongoCore.find(colName, condition, null, (err, records) => {
			if (err) {
				return cb(err);
			}
			return cb(err, {
				records
			});
		});
	};
};
