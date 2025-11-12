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
	Favorite.prototype.add = function (data, cb) {
		let __self = this;
		if (!data || !data.type || !data.service || !data.who || !data.who._id) {
			let error = new Error("Favorite: type, service, and who are required.");
			return cb(error, null);
		}
		let condition = {"type": data.type, "userid": data.who._id};
		let s = {
			$set: {
				"type": data.type,
				"userid": data._id
			},
			$addToSet: {
				"favorites": data.service
			}
		};

		__self.mongoCore.updateOne(colName, condition, s, {"upsert": true}, cb);
	};
};
