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
	Marketplace.prototype.deleteItem_version = function (data, cb) {
		let __self = this;
		if (!data || !data.name || !data.type || !data.hasOwnProperty("versions")) {
			let error = new Error("Marketplace: name, type, and versions are required.");
			return cb(error, null);
		}

		let condition = {'type': data.type, 'name': data.name};

		let options = {'upsert': false, 'safe': true};
		let fields = {
			'$set': {
				versions: data.versions
			}
		};
		condition = __self.add_acl_2_condition(data, condition);
		__self.mongoCore.updateOne(colName, condition, fields, options, cb);
	};
};
