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
let recipeHelpers;

function local(soajs, inputmaskData, options, cb) {
	if (!inputmaskData) {
		return cb(bl.handleError(soajs, 400, null));
	}
	if (inputmaskData.catalog.locked) {
		delete inputmaskData.catalog.locked;
	}
	inputmaskData._groups = getGroups(soajs);
	let modelObj = bl.mp.getModel(soajs, options);

	recipeHelpers = require('../lib/recipeHelpers.js')(bl);

	async.series({
		"checkSourCode": function (mCb) {
			recipeHelpers.validateSourceCodeAttachment(soajs, inputmaskData.catalog, mCb);
		},
		"checkPorts": function (mCb) {
			recipeHelpers.checkPorts(soajs, inputmaskData.catalog, mCb);
		}
	}, (error) => {
		if (error) {
			return cb(error);
		}
		modelObj.getItem_by_id(inputmaskData, (err, record) => {
			if (err) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!record) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 433, err));
			}
			if (record.locked) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 434, err));
			}
			if (inputmaskData.catalog.recipe &&
				inputmaskData.catalog.recipe.deployOptions &&
				inputmaskData.catalog.recipe.deployOptions.labels) {

				let recipeLabels = inputmaskData.catalog.recipe.deployOptions.labels;
				utils.normalizeKeyValues(recipeLabels, bl.localConfig.tokens.dotRegexString, bl.localConfig.tokens.dotToken, function (error, updatedRecord) {
					inputmaskData.catalog.recipe.deployOptions.labels = updatedRecord;
					return save();
				});
			} else {
				return save();
			}
		});
	});

	function save() {
		modelObj.editItem(inputmaskData, (err) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			return cb(null, "Catalog Recipe Successfully updated!");
		});
	}
}

module.exports = function(_bl) {
	bl = _bl;
	return local;
};
