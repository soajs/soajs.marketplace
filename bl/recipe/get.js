'use strict';

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const { getGroups } = require('../lib/helpers.js');
const utils = require("../../utils/index.js");

let bl;

function local(soajs, inputmaskData, options, cb) {
	if (!inputmaskData) {
		return cb(bl.handleError(soajs, 400, null));
	}
	inputmaskData._groups = getGroups(soajs);
	let modelObj = bl.mp.getModel(soajs, options);
	modelObj.getItem_by_id(inputmaskData, (err, response) => {
		bl.mp.closeModel(soajs, modelObj);
		if (err) {
			return cb(bl.handleError(soajs, 602, err));
		}
		if (!response) {
			return cb(bl.handleError(soajs, 435, err));
		}
		if (response.recipe.deployOptions && response.recipe.deployOptions.labels) {
			utils.normalizeKeyValues(response.recipe.deployOptions.labels, bl.localConfig.tokens.dotToken, bl.localConfig.tokens.dotValue, function (error, updatedRecord) {
				response.recipe.deployOptions.labels = updatedRecord;
				return cb(null, response);
			});
		} else {
			return cb(null, response);
		}
	});
}

module.exports = function(_bl) {
	bl = _bl;
	return local;
};
