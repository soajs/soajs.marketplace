/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

const colName = "catalogs";

module.exports = (Recipe) => {
	Recipe.prototype.addItem = function (data, cb) {
		let __self = this;
		if (!data || !data.catalog) {
			let error = new Error("Recipe: catalog is required.");
			return cb(error, null);
		}
		let options = {};
		let versioning = true;
		__self.mongoCore.insertOne(colName, data.catalog, options, versioning, cb);
	};
};
