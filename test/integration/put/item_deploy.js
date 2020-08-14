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

describe("Testing API: PUT /item/deploy", () => {
	
	before(function (done) {
		done();
	});
	
	afterEach((done) => {
		console.log("=======================================");
		done();
	});
	
	it("Success - will deploy an item", (done) => {
		let params = {
			qs: {
				"name": "marketplace",
				"type": "service",
				"env": "marketplace",
				"version": "1"
			}
		};
		requester('/item/deploy', 'put', params, (error, body) => {
			assert.ok(body);
			done();
		});
	});
	
});