'use strict';

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const lib_cd = require("../lib/cd");

let bl;
let deployBL;

function local(soajs, inputmaskData, options, cb) {
	// Pass the full deploy BL for lib_cd to access other deploy methods
	if (!deployBL) {
		deployBL = require('./index.js');
	}
	lib_cd.cd(soajs, inputmaskData, options, bl, deployBL, cb);
}

module.exports = function(_bl) {
	bl = _bl;
	return local;
};
