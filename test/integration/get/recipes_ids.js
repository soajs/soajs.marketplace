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

describe("Testing API: GET /items", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    it("Success - will return a recipe", (done) => {
        let params = {
            qs: {
            	"ids": ["5ef5a98e707a10af2f5d84c8"]
            }
        };
        requester('/recipes/ids', 'get', params, (error, body) => {
            assert.ok(body);
	        assert.deepStrictEqual(body.data[0]._id, "5ef5a98e707a10af2f5d84c8");
            done();
        });
    });
    
});