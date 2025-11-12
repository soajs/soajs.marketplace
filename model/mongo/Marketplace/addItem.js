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
	Marketplace.prototype.addItem = function (data, cb) {
		let __self = this;
		if (!data || !data.item) {
			let error = new Error("Marketplace: item is required.");
			return cb(error, null);
		}
		let condition = {
			name: data.item.name,
			type: data.item.type
		};

		let options = {'upsert': true, 'safe': true};
		let fields = {
			'$set': data.item
		};
		__self.mongoCore.updateOne(colName, condition, fields, options, cb);
	};
};
