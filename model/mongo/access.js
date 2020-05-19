/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

let lib = {
	"check_can_access": (data, item, cb) => {
		if (data._groups && Array.isArray(data._groups)) {
			if (item.settings && item.settings.acl && item.settings.acl.groups && item.settings.acl.groups.type &&
				item.settings.acl.groups.value && Array.isArray(item.settings.acl.groups.value) && item.settings.acl.groups.value.length > 0) {
				let acl = item.settings.acl.groups;
				let groupsFound = data._groups.some(o => acl.value.includes(o));
				if (acl.type === "whitelist") {
					if (groupsFound) {
						return cb(null, true);
					} else {
						let error = new Error("Marketplace: Access restricted to this item.");
						return cb(error, null);
					}
				}
				if (acl.type === "blacklist") {
					if (groupsFound) {
						let error = new Error("Marketplace: Access restricted to this item.");
						return cb(error, null);
					} else {
						return cb(null, true);
					}
				}
			}
			return cb(null, true);
		} else {
			return cb(null, true);
		}
	},
	"add_acl_2_condition": (data, condition) => {
		if (data._groups) {
			condition.$or = [
				{"settings.acl.groups.type": {"$exists": false}},
				{"settings.acl.groups.value": {"$exists": false}},
				{
					"$and": [{"settings.acl.groups.type": {"$exists": true, "$eq": "whitelist"}}, {
						"settings.acl.groups.value": {
							"$exists": true,
							"$in": data._groups
						}
					}]
				},
				{
					"$and": [{"settings.acl.groups.type": {"$exists": true, "$eq": "blacklist"}}, {
						"settings.acl.groups.value": {
							"$exists": true,
							"$nin": data._groups
						}
					}]
				}
			];
		}
		if (data.public) {
			if (condition.$or) {
				condition.$or.push({"settings.acl.public.ro": {"$exists": true, "$eq": true}});
			} else {
				condition["settings.acl.public.ro"] = {"$exists": true, "$eq": true};
			}
		}
		return condition;
	}
};

module.exports = lib;