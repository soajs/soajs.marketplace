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

describe("Testing API: Delete /recipe", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    it("Success - will delete a recipe", (done) => {
        let params = {
            qs: {
            	"id": "5ef5a98e707a10af2f5d84c8"
            }
        };
        requester('/recipe', 'delete', params, (error, body) => {
            assert.ok(body);
	        assert.deepStrictEqual(body.data, "Catalog Recipe Successfully deleted!");
            done();
        });
    });
	
	it("Success - will delete a recipe", (done) => {
		let params = {
			qs: {
				"id": "5f44de4b2d965eb8a10de30c",
				"version": 1
			}
		};
		requester('/recipe', 'delete', params, (error, body) => {
			assert.ok(body);
			assert.deepStrictEqual(body.data, "Catalog Recipe Successfully deleted!");
			done();
		});
	});
});