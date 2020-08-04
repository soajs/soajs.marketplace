"use strict";
const assert = require('assert');
const requester = require('../../requester');
const _data = require("../data/config.js");

describe("Testing API: PUT /item/config", () => {
	
	before(function (done) {
		done();
	});
	
	afterEach((done) => {
		console.log("=======================================");
		done();
	});
	
	it("Success - add item config_1 of type config to the catalog", (done) => {
		let params = {
			body: {"item": _data.config_1.item}
		};
		requester('/item/config', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully Added!");
			
			//let check = validator.validate(body, listUsersSchema);
			//assert.deepEqual(check.valid, true);
			//assert.deepEqual(check.errors, []);
			done();
		});
	});
	
	it("Success - update item config_1_2 of type config to the catalog", (done) => {
		let params = {
			body: {"item": _data.config_1_2.item}
		};
		requester('/item/config', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully updated!");
			
			//let check = validator.validate(body, listUsersSchema);
			//assert.deepEqual(check.valid, true);
			//assert.deepEqual(check.errors, []);
			done();
		});
	});
	
	it("Success - update item config_1_3 of type config to the catalog", (done) => {
		let params = {
			body: {"item": _data.config_1_3.item}
		};
		requester('/item/config', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully updated!");
			
			//let check = validator.validate(body, listUsersSchema);
			//assert.deepEqual(check.valid, true);
			//assert.deepEqual(check.errors, []);
			done();
		});
	});
	
	it("Success - add item config_2 of type config to the catalog", (done) => {
		let params = {
			body: {"item": _data.config_2.item}
		};
		requester('/item/config', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully Added!");
			
			//let check = validator.validate(body, listUsersSchema);
			//assert.deepEqual(check.valid, true);
			//assert.deepEqual(check.errors, []);
			done();
		});
	});
	
	it("Success - update item config_2_2 of type config to the catalog", (done) => {
		let params = {
			body: {"item": _data.config_2_2.item}
		};
		requester('/item/config', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully updated!");
			
			//let check = validator.validate(body, listUsersSchema);
			//assert.deepEqual(check.valid, true);
			//assert.deepEqual(check.errors, []);
			done();
		});
	});
	
	it("Success - update item config_2_3 of type config to the catalog", (done) => {
		let params = {
			body: {"item": _data.config_2_3.item}
		};
		requester('/item/config', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully updated!");
			
			//let check = validator.validate(body, listUsersSchema);
			//assert.deepEqual(check.valid, true);
			//assert.deepEqual(check.errors, []);
			done();
		});
	});
	
});