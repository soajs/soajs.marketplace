'use strict';

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

let bl;

function local(soajs, inputmaskData, options, cb) {
	return cb(null, true);
}

module.exports = function(_bl) {
	bl = _bl;
	return local;
};
