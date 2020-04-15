"use strict";
const assert = require('assert');
const requester = require('../../requester');
const _data = require("../data/resource.js");

describe("Testing API: PUT /item/resource", () => {
	
	before(function (done) {
		done();
	});
	
	afterEach((done) => {
		console.log("=======================================");
		done();
	});
	
	it("Success - add item resource_1 of type resource to the catalog", (done) => {
		let params = {
			body: {"item": _data.resource_1.item}
		};
		requester('/item/resource', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully Added!");
			
			//let check = validator.validate(body, listUsersSchema);
			//assert.deepEqual(check.valid, true);
			//assert.deepEqual(check.errors, []);
			done();
		});
	});
	
	it("Success - update item resource_1_2 of type resource to the catalog", (done) => {
		let params = {
			body: {"item": _data.resource_1_2.item}
		};
		requester('/item/resource', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully updated!");
			
			//let check = validator.validate(body, listUsersSchema);
			//assert.deepEqual(check.valid, true);
			//assert.deepEqual(check.errors, []);
			done();
		});
	});
	
	it("Success - update item resource_1_3 of type resource to the catalog", (done) => {
		let params = {
			body: {"item": _data.resource_1_3.item}
		};
		requester('/item/resource', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully updated!");
			
			//let check = validator.validate(body, listUsersSchema);
			//assert.deepEqual(check.valid, true);
			//assert.deepEqual(check.errors, []);
			done();
		});
	});
	
});