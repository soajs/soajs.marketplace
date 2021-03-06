"use strict";

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const assert = require('assert');
const requester = require('../requester');

describe("Testing API: Delete /item", () => {
	
	before(function (done) {
		done();
	});
	
	afterEach((done) => {
		console.log("=======================================");
		done();
	});
	
	it("Success - delete items by src", (done) => {
		let params = {
			qs: {
				"provider": "github",
				"owner": "soajs",
				"repo": "soajs.multitenant"
			}
		};
		requester('/items/src', 'delete', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body, {"result": true, "data": true});
			//let check = validator.validate(body, listUsersSchema);
			//assert.deepEqual(check.valid, true);
			//assert.deepEqual(check.errors, []);
			done();
		});
	});
	
});