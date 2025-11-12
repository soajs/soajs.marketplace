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
	Marketplace.prototype.add_acl_2_condition = function (data, condition) {
		return access.add_acl_2_condition(data, condition);
	};
};
