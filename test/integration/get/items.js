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

    it("Success - will return soajs items", (done) => {
        let params = {
            qs: {
            	"keywords": "marketplace",
                "limit": 10,
                "start": 0
            }
        };
        requester('/items', 'get', params, (error, body) => {
            assert.ok(body);
            assert.ok(body.data.records.length > 0);
            let id_array = [];
            for (let i = 0; i < body.data.records.length; i++) {
                id_array.push(body.data.records[i]._id);
            }
            assert.deepEqual(id_array.includes('5e409c82c5a59210a815262b'), true);
            done();
        });
    });
    
});