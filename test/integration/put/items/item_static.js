"use strict";
const assert = require('assert');
const requester = require('../../requester');
const _data = require("../data/static.js");

describe("Testing API: PUT /item/static", () => {
	
	before(function (done) {
		done();
	});
	
	afterEach((done) => {
		console.log("=======================================");
		done();
	});
	
	it("Success - add item static_1 of type static to the catalog", (done) => {
		let params = {
			body: {"item": _data.static_1.item}
		};
		requester('/item/static', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully Added!");
			
			//let check = validator.validate(body, listUsersSchema);
			//assert.deepEqual(check.valid, true);
			//assert.deepEqual(check.errors, []);
			done();
		});
	});
	
	it("Success - update item static_1_2 of type static to the catalog", (done) => {
		let params = {
			body: {"item": _data.static_1_2.item}
		};
		requester('/item/static', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully updated!");
			
			//let check = validator.validate(body, listUsersSchema);
			//assert.deepEqual(check.valid, true);
			//assert.deepEqual(check.errors, []);
			done();
		});
	});
	
	it("Success - update item static_1_3 of type static to the catalog", (done) => {
		let params = {
			body: {"item": _data.static_1_3.item}
		};
		requester('/item/static', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully updated!");
			
			//let check = validator.validate(body, listUsersSchema);
			//assert.deepEqual(check.valid, true);
			//assert.deepEqual(check.errors, []);
			done();
		});
	});
	
	it("Success - add item static_2 of type static to the catalog", (done) => {
		let params = {
			body: {"item": _data.static_2.item}
		};
		requester('/item/static', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully Added!");
			
			//let check = validator.validate(body, listUsersSchema);
			//assert.deepEqual(check.valid, true);
			//assert.deepEqual(check.errors, []);
			done();
		});
	});
	
	it("Success - update item static_2_2 of type static to the catalog", (done) => {
		let params = {
			body: {"item": _data.static_2_2.item}
		};
		requester('/item/static', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully updated!");
			
			//let check = validator.validate(body, listUsersSchema);
			//assert.deepEqual(check.valid, true);
			//assert.deepEqual(check.errors, []);
			done();
		});
	});
	
	it("Success - update item static_2_3 of type static to the catalog", (done) => {
		let params = {
			body: {"item": _data.static_2_3.item}
		};
		requester('/item/static', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully updated!");
			
			//let check = validator.validate(body, listUsersSchema);
			//assert.deepEqual(check.valid, true);
			//assert.deepEqual(check.errors, []);
			done();
		});
	});
	
});