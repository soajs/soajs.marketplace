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
	Favorite.prototype.get = function (data, cb) {
		let __self = this;
		if (!data || !data.type || !data.who || !data.who._id) {
			let error = new Error("Favorite: type, and who are required.");
			return cb(error, null);
		}
		let condition = {"type": data.type, "userid": data.who._id};

		let options = {};
		__self.mongoCore.findOne(colName, condition, options, (error, response) => {
			if (error) {
				return cb(error);
			} else {
				return cb(null, response);
			}
		});
	};
};
