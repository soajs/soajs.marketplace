"use strict";
const assert = require('assert');
const requester = require('../requester');
const _data = require("./data.js");

describe("Testing API: POST /items/resource", () => {
	
	before(function (done) {
		done();
	});
	
	afterEach((done) => {
		console.log("=======================================");
		done();
	});
	
	it("Success - add items of type resource to the catalog", (done) => {
		let params = {
			body: {"items": _data}
		};
		requester('/items/resource', 'post', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data.length, 3);
			
			//let check = validator.validate(body, listUsersSchema);
			//assert.deepEqual(check.valid, true);
			//assert.deepEqual(check.errors, []);
			done();
		});
	});
	
});