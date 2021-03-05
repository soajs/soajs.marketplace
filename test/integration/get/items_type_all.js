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

describe("Testing API: GET /items/type/all", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });
	
	it("Success - will return item by type and name", (done) => {
		let params = {
			qs: {
				"type": ["service"]
			}
		};
		requester('/items/type/all', 'get', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data.count,  '10');
			
			//let check = validator.validate(body, listUsersSchema);
			//assert.deepEqual(check.valid, true);
			//assert.deepEqual(check.errors, []);
			
			done();
		});
	});
    
});