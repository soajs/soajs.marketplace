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
	Marketplace.prototype.update_item_configuration = function (data, cb) {
		let __self = this;
		if (!data || !data.type || !data.name || !data.config || !data.response) {
			let error = new Error("Marketplace: type, name, response, and config are required.");
			return cb(error, null);
		}
		if (!data.response || !data.config.env) {
			let error = new Error("Marketplace: Bad configuration.");
			return cb(error, null);
		}
		let condition = {
			name: data.name,
			type: data.type
		};
		let deploy = data.response.deploy || {};
		let env = data.config.env.toLowerCase();
		delete data.config.env;
		let newDeploy = [];
		if (!deploy[env]) {
			deploy[env] = [];
		}
		if (deploy[env].length === 0) {
			deploy[env] = [data.config];
		} else {
			let found = false;
			deploy[env].forEach((one) => {
				if (one.version === data.config.version) {
					newDeploy.push(data.config);
					found = true;
				} else {
					newDeploy.push(one);
				}
			});
			if (!found) {
				deploy[env].push(data.config);
			} else {
				deploy[env] = newDeploy;
			}
		}
		// let s = {
		// 	'$set': {
		// 		deploy: deploy
		// 	}
		// };
		let s = {
			'$set': {}
		};
		s.$set["deploy." + env] = deploy[env];

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
	};
};
