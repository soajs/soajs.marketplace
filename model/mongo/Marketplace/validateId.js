/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

module.exports = (Marketplace) => {
	Marketplace.prototype.validateId = function (id, cb) {
		let __self = this;

		if (!id) {
			let error = new Error("User: must provide an id.");
			return cb(error, null);
		}

		try {
			id = __self.mongoCore.ObjectId(id);
			return cb(null, id);
		} catch (e) {
			__self.log(e.message);
			return cb(new Error("A valid ID is required"), null);
		}
	};
};
