/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

'use strict';

/**
 * Test-compatible wrapper for deploy BL
 * This file maintains backward compatibility with existing tests
 * while using the new modular structure internally
 */

const _deploy = require("./deploy/index.js");

module.exports = function(BL) {
	// Initialize all operations with the BL context
	let deploy = {};
	for (let op in _deploy) {
		if (_deploy.hasOwnProperty(op)) {
			deploy[op] = _deploy[op](BL);
		}
	}
	return deploy;
};
