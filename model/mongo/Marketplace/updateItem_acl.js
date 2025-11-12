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
	Marketplace.prototype.updateItem_acl = function (data, cb) {
		let __self = this;
		if (!data || !data.id || !data.type || !data.groups) {
			let error = new Error("Marketplace: id, type and groups are required.");
			return cb(error, null);
		}
		let allowedTypes = ["blacklist", "whitelist"];
		if (!allowedTypes.includes(data.type)) {
			let error = new Error("Marketplace: type can only be one of the following: " + allowedTypes.join(","));
			return cb(error, null);
		}
		if (!Array.isArray(data.groups)) {
			let error = new Error("Marketplace: groups must be an array.");
			return cb(error, null);
		}
		__self.validateId(data.id, (err, _id) => {
			if (err) {
				return cb(err, null);
			}

			let condition = {"_id": _id};
			if (data.soajs) {
				condition["configuration.subType"] = "soajs";
			} else {
				condition["configuration.subType"] = {$ne: "soajs"};
			}

			let s = {
				'$set': {
					"settings.acl.groups.value": data.groups,
					"settings.acl.groups.type": data.type,
					"settings.acl.groups.config": data.config || {}
				}
			};

			//condition = __self.add_acl_2_condition(data, condition);
			__self.check_if_can_access(data, condition, {}, (error) => {
				if (error) {
					return cb(error);
				}
				__self.mongoCore.updateOne(colName, condition, s, null, (err, record) => {
					if (err) {
						return cb(err);
					}
					if (!record || (record && !record.nModified)) {
						let error = new Error("Marketplace: item [" + data.id + "] was not updated.");
						return cb(error);
					}
					return cb(null, record.nModified);
				});
			});
		});
	};
};
