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

describe("Testing API: GET /items/type/names", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });
	
	it("Success - will return item by type and names", (done) => {
		let params = {
			qs: {
				"types": ["service"],
				"names": ["multitenant", "oauth"]
			}
		};
		requester('/items/type/names', 'get', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body);
			assert.ok(body.data);
			assert.ok(body.data.records);
			assert.deepEqual(body.data.records.length,  2);
			done();
		});
	});
    
});