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
	if (!inputmaskData) {
		return cb(bl.handleError(soajs, 400, null));
	}
	if (soajs.urac) {
		inputmaskData.who = {
			"_id": soajs.urac._id,
			"username": soajs.urac.username
		};
	} else {
		return cb(null, {});
	}
	let modelObj = bl.mp.getModel(soajs, options);
	modelObj.get(inputmaskData, (err, response) => {
		bl.mp.closeModel(soajs, modelObj);
		if (err) {
			return cb(bl.handleError(soajs, 602, err));
		}
		if (response) {
			return cb(null, response);
		} else {
			return cb(null, {});
		}
	});
}

module.exports = function(_bl) {
	bl = _bl;
	return local;
};
