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
	inputmaskData._groups = getGroups(soajs);
	let modelObj = bl.mp.getModel(soajs, options);

	if (inputmaskData.catalog.locked) {
		// do not allow user to lock a record
		delete inputmaskData.catalog.locked;
	}

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
			bl.mp.closeModel(soajs, modelObj);
			return cb(error);
		}
		if (inputmaskData.catalog.recipe && inputmaskData.catalog.recipe.deployOptions && inputmaskData.catalog.recipe.deployOptions.labels) {
			let recipeLabels = inputmaskData.catalog.recipe.deployOptions.labels;
			utils.normalizeKeyValues(recipeLabels, bl.localConfig.tokens.dotRegexString, bl.localConfig.tokens.dotToken, function (error, updatedRecord) {
				inputmaskData.catalog.recipe.deployOptions.labels = updatedRecord;
				return save();
			});
		} else {
			return save();
		}
	});

	function save() {
		if (inputmaskData.catalog &&
			inputmaskData.catalog.recipe &&
			inputmaskData.catalog.recipe.deployOptions) {
			if (inputmaskData.catalog.recipe.deployOptions.livenessProbe &&
				typeof (inputmaskData.catalog.recipe.deployOptions.livenessProbe) === 'object' &&
				Object.keys(inputmaskData.catalog.recipe.deployOptions.livenessProbe).length === 0) {
				inputmaskData.catalog.recipe.deployOptions.livenessProbe = null;
			}
		}
		modelObj.addItem(inputmaskData, (err, record) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			return cb(null, {
				id: record._id
			});
		});
	}
}

module.exports = function(_bl) {
	bl = _bl;
	return local;
};
