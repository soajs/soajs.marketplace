'use strict';

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const request = require("request");

/**
 * Log ledger entry to console service
 * @param {Object} soajs - SOAJS context
 * @param {Object} doc - Ledger document
 * @param {Object} response - Operation response
 * @param {Function} cb - Callback function
 */
module.exports = (soajs, doc, response, cb) => {
	if (!doc) {
		return cb();
	}
	if (response) {
		let status;
		if (response.result) {
			status = "succeeded";
		} else {
			status = "failed";
		}
		doc.status = status;
		doc.input = soajs.inputmaskData;
		if (doc.input) {
			delete doc.input.token;
			delete doc.input.repo_token;
		}
		doc.output = response;
	}
	soajs.awareness.connect("console", "1", (response) => {
		if (response && response.host) {
			let options = {
				uri: 'http://' + response.host + "/ledger",
				headers: response.headers,
				body: {"doc": doc},
				json: true
			};
			request.post(options, function (error, response, body) {
				if (error && error.message) {
					soajs.log.error(error.message);
				} else if (body && (!body.result || body.errors)) {
					soajs.log.error(body.errors);
				}
			});
		}
		if (cb && typeof cb === "function") {
			return cb();
		}
	});
};
