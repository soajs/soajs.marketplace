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

describe("Testing API: GET /public/items", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    it("Success - will return soajs items", (done) => {
        let params = {
        	public: true,
            qs: {
            	"keywords": "marketplace",
                "limit": 10,
                "start": 0
            },
	        headers : {
            	"key": "3d90163cf9d6b3076ad26aa5ed5855639bd27317e5b63490ccc982c32e15a491dd4cbd37804bd535c6dd753a5e2d299588d2add494838aecd42edb8a727113d1d4d98e06d373ce769657a6d64736deba6fb9b58ec10d4fc7e29837f137323a32"
	        }
        };
        requester('/public/items', 'get', params, (error, body) => {
            assert.ok(body);
            assert.ok(body.data.records.length > 0);
	        assert.deepEqual(body.data.records.length, 1);
            let id_array = [];
            for (let i = 0; i < body.data.records.length; i++) {
                id_array.push(body.data.records[i]._id);
            }
            assert.deepEqual(id_array.includes('5e409c94c5a59210a815262c'), true);
            
            //let check = validator.validate(body, listUsersSchema);
            //assert.deepEqual(check.valid, true);
            //assert.deepEqual(check.errors, []);
	        
            done();
        });
    });
    
});