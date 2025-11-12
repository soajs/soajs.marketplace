/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

const access = require("../access");
const colName = "marketplace";

module.exports = (Marketplace) => {
	Marketplace.prototype.check_if_can_access = function (data, condition, options, cb) {
		let __self = this;
		__self.mongoCore.findOne(colName, condition, options, (err, item) => {
			if (err) {
				return cb(err, null);
			}
			if (!item) {
				let error = new Error("Marketplace: item not found.");
				return cb(error, null);
			}
			access.check_can_access(data, item, cb);
		});
	};
};
