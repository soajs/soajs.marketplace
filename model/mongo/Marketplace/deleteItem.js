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
	Marketplace.prototype.deleteItem = function (data, cb) {
		let __self = this;
		if (!data || !data.type || !data.name) {
			let error = new Error("Marketplace: type and name are required.");
			return cb(error, null);
		}

		let condition = {'type': data.type, 'name': data.name};
		condition = __self.add_acl_2_condition(data, condition);
		__self.mongoCore.deleteOne(colName, condition, {}, (err) => {
			return cb(err);
		});
	};
};
