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
//let core = require('soajs').core;
//let validator = new core.validator.Validator();
//let listUsersSchema = require("../schemas/getUsers.js");

describe("Testing API: PUT /soajs/item/recipes", () => {
	
	before(function (done) {
		done();
	});
	
	afterEach((done) => {
		console.log("=======================================");
		done();
	});
	
	it("Success - will update recipes for a soajs oauth item", (done) => {
		let params = {
			body: {
				"id": "5db1f85be9253564357b303d",
				"recipes": ["123456", "111111"]
			}
		};
		requester('/soajs/item/recipes', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, 1);
			
			//let check = validator.validate(body, listUsersSchema);
			//assert.deepEqual(check.valid, true);
			//assert.deepEqual(check.errors, []);
			
			done();
		});
	});
	
});