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
	if (!inputmaskData) {
		return cb(bl.handleError(soajs, 400, null));
	}

	// Get the saveConfiguration function from deploy index
	const deployBL = require('./index.js');
	const saveConfiguration = deployBL.saveConfiguration(bl);

	saveConfiguration(soajs, inputmaskData, options, (error) => {
		if (error && error.code !== 603) {
			return cb(error);
		}
		inputmaskData.env = inputmaskData.config.env;
		inputmaskData.version = inputmaskData.config.version;
		lib_deploy.deploy(soajs, inputmaskData, options, bl, cb);
	});
}

module.exports = function(_bl) {
	bl = _bl;
	return local;
};
