"use strict";
const assert = require('assert');
const requester = require('../../requester');
const _data = require("../data/custom.js");

describe("Testing API: PUT /item/custom", () => {
	
	before(function (done) {
		done();
	});
	
	afterEach((done) => {
		console.log("=======================================");
		done();
	});
	
	it("Success - add item custom_1 of type custom to the catalog", (done) => {
		let params = {
			body: {"item": _data.custom_1.item}
		};
		requester('/item/custom', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully Added!");
			
			//let check = validator.validate(body, listUsersSchema);
			//assert.deepEqual(check.valid, true);
			//assert.deepEqual(check.errors, []);
			done();
		});
	});
	
	it("Success - update item custom_1_2 of type custom to the catalog", (done) => {
		let params = {
			body: {"item": _data.custom_1_2.item}
		};
		requester('/item/custom', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully updated!");
			
			//let check = validator.validate(body, listUsersSchema);
			//assert.deepEqual(check.valid, true);
			//assert.deepEqual(check.errors, []);
			done();
		});
	});
	
	it("Success - update item custom_1_3 of type custom to the catalog", (done) => {
		let params = {
			body: {"item": _data.custom_1_3.item}
		};
		requester('/item/custom', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully updated!");
			
			//let check = validator.validate(body, listUsersSchema);
			//assert.deepEqual(check.valid, true);
			//assert.deepEqual(check.errors, []);
			done();
		});
	});
	it("Success - add item custom_2 of type custom to the catalog", (done) => {
		let params = {
			body: {"item": _data.custom_2.item}
		};
		requester('/item/custom', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully Added!");
			
			//let check = validator.validate(body, listUsersSchema);
			//assert.deepEqual(check.valid, true);
			//assert.deepEqual(check.errors, []);
			done();
		});
	});
	
	it("Success - update item custom_2_2 of type custom to the catalog", (done) => {
		let params = {
			body: {"item": _data.custom_2_2.item}
		};
		requester('/item/custom', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully updated!");
			
			//let check = validator.validate(body, listUsersSchema);
			//assert.deepEqual(check.valid, true);
			//assert.deepEqual(check.errors, []);
			done();
		});
	});
	
	it("Success - update item custom_2_3 of type custom to the catalog", (done) => {
		let params = {
			body: {"item": _data.custom_2_3.item}
		};
		requester('/item/custom', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully updated!");
			
			//let check = validator.validate(body, listUsersSchema);
			//assert.deepEqual(check.valid, true);
			//assert.deepEqual(check.errors, []);
			done();
		});
	});
});