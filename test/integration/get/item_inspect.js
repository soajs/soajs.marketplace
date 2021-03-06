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

describe("Testing API: PUT /item/deploy/inspect", () => {
	
	before(function (done) {
		done();
	});
	
	afterEach((done) => {
		console.log("=======================================");
		done();
	});
	
	it("Success - will inspect an item", (done) => {
		let params = {
			qs: {
				"id": "marketplace"
			}
		};
		requester('/item/deploy/inspect', 'get', params, (error, body) => {
			assert.ok(body);
			done();
		});
	});
	
});