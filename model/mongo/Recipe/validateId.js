/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

module.exports = (Recipe) => {
	Recipe.prototype.validateId = function (id, cb) {
		let __self = this;

		if (!id) {
			let error = new Error("Recipe: must provide an id.");
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
