'use strict';

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const request = require("request");
const commonResponse = require('./commonResponse.js');

/**
 * Get environment registry from console service
 * @param {Object} soajs - SOAJS context
 * @param {Object} data - Data object with env property
 * @param {Function} cb - Callback function
 */
module.exports = (soajs, data, cb) => {
	if (!data.env) {
		return cb(null, null);
	}
	soajs.awareness.connect("console", "1", (response) => {
		if (response && response.host) {
			let options = {
				uri: 'http://' + response.host + "/registry",
				headers: response.headers,
				qs: {"env": data.env},
				json: true
			};
			request.get(options, function (error, response, body) {
				return commonResponse(soajs, body, error, cb);
			});
		} else {
			return cb(null, null);
		}
	});
};
