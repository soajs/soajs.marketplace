/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

'use strict';

/**
 * Test-compatible wrapper for marketplace BL
 * This file maintains backward compatibility with existing tests
 * while using the new modular structure internally
 */

const _marketplace = require("./marketplace/index.js");

// Create a wrapper that mimics the old monolithic structure
let bl = {
	modelObj: null,
	model: null,
	soajs_service: null,
	localConfig: null,

	handleError: (soajs, errCode, err) => {
		if (err) {
			soajs.log.error(err.message);
		}
		return ({
			"code": errCode,
			"msg": bl.localConfig.errors[errCode] + ((err && (errCode === 602 || errCode === 503 || errCode === 422)) ? err.message : "")
		});
	},

	mp: {
		"getModel": () => {
			return bl.modelObj;
		},
		"closeModel": (soajs, modelObj) => {
			if (soajs && soajs.tenant && soajs.tenant.type === "client" && soajs.tenant.dbConfig) {
				modelObj.closeConnection();
			}
		}
	}
};

// Create the BL context
const getContext = () => ({
	handleError: bl.handleError,
	mp: bl.mp,
	localConfig: bl.localConfig,
	soajs_service: bl.soajs_service,
	modelObj_marketplace: bl.modelObj,
	model_marketplace: bl.model
});

// Helper to create operation wrapper
function createOperationWrapper(operation) {
	return function(...args) {
		const context = getContext();
		return operation(context)(...args);
	};
}

// Initialize all operations and expose them directly on bl for backward compatibility
for (let op in _marketplace) {
	if (_marketplace.hasOwnProperty(op)) {
		bl[op] = createOperationWrapper(_marketplace[op]);
	}
}

module.exports = bl;
