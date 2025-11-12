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
const async = require('async');

let bl;

function local(soajs, inputmaskData, options, cb) {
	if (!inputmaskData) {
		return cb(bl.handleError(soajs, 400, null));
	}
	inputmaskData._groups = getGroups(soajs);
	let modelObj = bl.mp.getModel(soajs, options);
	modelObj.getItems_by_ids(inputmaskData, (err, records) => {
		bl.mp.closeModel(soajs, modelObj);
		if (err) {
			return cb(bl.handleError(soajs, 602, err));
		}
		async.map(records, function (oneRecord, callback) {
			if (oneRecord.recipe.deployOptions && oneRecord.recipe.deployOptions.labels) {
				utils.normalizeKeyValues(oneRecord.recipe.deployOptions.labels, bl.localConfig.tokens.dotToken, bl.localConfig.tokens.dotValue, function (error, updatedRecord) {
					oneRecord.recipe.deployOptions.labels = updatedRecord;
					return callback(null, oneRecord);
				});
			} else {
				return callback(null, oneRecord);
			}
		}, cb);
	});
}

module.exports = function(_bl) {
	bl = _bl;
	return local;
};
