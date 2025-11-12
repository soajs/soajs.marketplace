'use strict';

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const { getGroups } = require('../lib/helpers.js');

let bl;

function local(soajs, inputmaskData, options, cb) {
	if (!inputmaskData) {
		return cb(bl.handleError(soajs, 400, null));
	}
	let modelObj = bl.mp.getModel(soajs, options);
	inputmaskData._groups = getGroups(soajs);
	modelObj.getItem(inputmaskData, (err, response) => {
		if (err) {
			return cb(bl.handleError(soajs, 602, err));
		}
		if (!response) {
			return cb(bl.handleError(soajs, 501, null));
		}
		if (response.locked) {
			return cb(bl.handleError(soajs, 502, null));
		}
		modelObj.deleteItem(inputmaskData, (err) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			return cb(null, true);
		});
	});
}

module.exports = function(_bl) {
	bl = _bl;
	return local;
};
