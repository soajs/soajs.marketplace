/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

const access = require("../access");

module.exports = (Marketplace) => {
	Marketplace.prototype.check_can_access = function (data, item, cb) {
		return access.check_can_access(data, item, cb);
	};
};
