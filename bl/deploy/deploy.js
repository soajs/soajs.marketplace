'use strict';

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const lib_deploy = require("../lib/deploy");

let bl;

function local(soajs, inputmaskData, options, cb) {
	lib_deploy.deploy(soajs, inputmaskData, options, bl, cb);
}

module.exports = function(_bl) {
	bl = _bl;
	return local;
};
