/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

module.exports = (Recipe) => {
	Recipe.prototype.closeConnection = function () {
		let __self = this;
		__self.mongoCore.closeDb();
	};
};
