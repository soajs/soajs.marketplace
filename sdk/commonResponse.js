'use strict';

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

/**
 * Common response handler for SDK service calls
 * @param {Object} soajs - SOAJS context
 * @param {Object} body - Response body
 * @param {Error} error - Error object if any
 * @param {Function} cb - Callback function
 */
module.exports = (soajs, body, error, cb) => {
	if (error && error.message) {
		soajs.log.error(error.message);
		return cb(error, null);
	}

	if (body && (!body.result || body.errors)) {
		soajs.log.error(body.errors);
		if (body.errors && body.errors.details && body.errors.details[0] && body.errors.details[0].message) {
			error = new Error(body.errors.details[0].message);
		}
		return cb(error, null);
	}

	if (body && body.result && body.data) {
		return cb(null, body.data);
	}

	return cb(null, null);
};
