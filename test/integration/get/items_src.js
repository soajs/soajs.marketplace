"use strict";
const assert = require('assert');
const requester = require('../requester');
//let core = require('soajs').core;
//let validator = new core.validator.Validator();
//let listUsersSchema = require("../schemas/getUsers.js");

describe("Testing API: GET /items/src", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });
	
	it("Success - will return items by src", (done) => {
		let params = {
			qs: {
				"provider": "github",
				"owner": "soajs",
				"repo": "soajs.multitenant"
			}
		};
		requester('/items/src', 'get', params, (error, body) => {
			assert.ok(body);
			assert.ok(body.data.length > 0);
			assert.deepEqual(body.data[0]._id , '5db1f85be9253564357b303f');
			
			//let check = validator.validate(body, listUsersSchema);
			//assert.deepEqual(check.valid, true);
			//assert.deepEqual(check.errors, []);
			
			done();
		});
	});
    
});