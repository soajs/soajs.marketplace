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
	Marketplace.prototype.getItem_by_type = function (data, cb) {
		let __self = this;
		if (!data || !data.name || !data.type) {
			let error = new Error("Marketplace: type and name are required.");
			return cb(error, null);
		}

		let condition = {
			"name": data.name,
			"type": data.type
		};
		condition = __self.add_acl_2_condition(data, condition);
		__self.mongoCore.findOne(colName, condition, null, (err, record) => {
			if (err) {
				return cb(err);
			}
			return cb(err, record);
		});
	};
};
