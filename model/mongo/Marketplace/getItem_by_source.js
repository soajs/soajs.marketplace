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
	Marketplace.prototype.getItem_by_source = function (data, cb) {
		let __self = this;
		if (!data || !data.provider || !data.owner || !data.repo) {
			let error = new Error("Marketplace: Source type, owner, and repo are required.");
			return cb(error, null);
		}

		let condition = {
			"src.provider": data.provider,
			"src.owner": data.owner,
			"src.repo": data.repo
		};
		condition = __self.add_acl_2_condition(data, condition);
		__self.mongoCore.find(colName, condition, null, (err, record) => {
			if (err) {
				return cb(err);
			}
			return cb(err, record);
		});
	};
};
