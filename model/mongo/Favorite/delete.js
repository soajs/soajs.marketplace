/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

const colName = "favorite";

module.exports = (Favorite) => {
	Favorite.prototype.delete = function (data, cb) {
		let __self = this;
		if (!data || !data.type || !data.service || !data.who || !data.who._id) {
			let error = new Error("Favorite: type, service, and who are required.");
			return cb(error, null);
		}

		let condition = {"type": data.type, "userid": data.who._id};
		let s = {"$pull": {favorites: data.service}};

		__self.mongoCore.updateOne(colName, condition, s, null, cb);
	};
};
