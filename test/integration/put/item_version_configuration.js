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

describe("Testing API: PUT /item/version/configuration", () => {
	
	before(function (done) {
		done();
	});
	
	afterEach((done) => {
		console.log("=======================================");
		done();
	});
	
	it("Success - will update item configuration by version", (done) => {
		let params = {
			"body": {
				"name": "sniper",
				"type": "service",
				"env": "NEW",
				"version": "1",
				"settings": {
					"extKeyRequired": true,
					"oauth": "test"
				}
			}
		};
		requester('/item/version/configuration', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, 1);
			done();
		});
	});
	
});