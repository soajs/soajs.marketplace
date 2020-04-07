"use strict";
const assert = require('assert');
const requester = require('../requester');
const _data = require("./data/service.js");

describe("Testing API: POST /item/service", () => {
	
	before(function (done) {
		done();
	});
	
	afterEach((done) => {
		console.log("=======================================");
		done();
	});
	
	it("Success - add item[0] of type resource to the catalog", (done) => {
		let params = {
			body: {"item": _data[0]}
		};
		requester('/item/resource', 'post', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data.length, 1);
			
			//let check = validator.validate(body, listUsersSchema);
			//assert.deepEqual(check.valid, true);
			//assert.deepEqual(check.errors, []);
			done();
		});
	});

	
});