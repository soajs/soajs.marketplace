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

describe("Testing API: PUT /item/deploy/cd", () => {
	
	before(function (done) {
		done();
	});
	
	afterEach((done) => {
		console.log("=======================================");
		done();
	});
	
	it("Success - will make cd operation", (done) => {
		let params = {
			qs: {
				"token": "123",
				"name": "marketplace",
				"type": "service",
				"version": "1",
			},
			body : {
				config : {
					from : {
						image_tag : "test",
						image_name : "test",
						image_prefix : "test"
					}
				}
			}
		};
		requester('/item/deploy/cd', 'put', params, (error, body) => {
			assert.ok(body);
			done();
		});
	});
	
});