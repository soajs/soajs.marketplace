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
	Marketplace.prototype.update_item_version_config = function (data, cb) {
		let __self = this;
		if (!data || !data.type || !data.name) {
			let error = new Error("Marketplace: type and name are required.");
			return cb(error, null);
		}
		let condition = {
			name: data.name,
			type: data.type
		};

		__self.check_if_can_access(data, condition, {}, (error) => {
			if (error) {
				return cb(error);
			}
			let s = {
				'$set': {
					["versions.$.customByEnv." + data.env]: data.settings
				}
			};
			condition["versions.version"] = data.version;
			let options = {'upsert': false, 'safe': true};
			__self.mongoCore.updateOne(colName, condition, s, options, (err, record) => {
				if (err) {
					return cb(err);
				}
				if (!record || (record && !record.nModified)) {
					let error = new Error("Marketplace: item [" + data.name + "] was not updated.");
					return cb(error);
				}
				return cb(null, record.nModified);
			});
		});
	};
};
