"use strict";
const assert = require('assert');
const requester = require('../../requester');
const _data = require("../data/daemon.js");

describe("Testing API: PUT /item/daemon", () => {
	
	before(function (done) {
		done();
	});
	
	afterEach((done) => {
		console.log("=======================================");
		done();
	});
	
	it("Success - add item daemon_1 of type daemon to the catalog", (done) => {
		let params = {
			body: {"item": _data.daemon_1.item}
		};
		requester('/item/daemon', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully Added!");
			
			//let check = validator.validate(body, listUsersSchema);
			//assert.deepEqual(check.valid, true);
			//assert.deepEqual(check.errors, []);
			done();
		});
	});
	
	it("Success - update item daemon_1_2 of type daemon to the catalog", (done) => {
		let params = {
			body: {"item": _data.daemon_1_2.item}
		};
		requester('/item/daemon', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully updated!");
			
			//let check = validator.validate(body, listUsersSchema);
			//assert.deepEqual(check.valid, true);
			//assert.deepEqual(check.errors, []);
			done();
		});
	});
	
	it("Success - update item daemon_1_3 of type daemon to the catalog", (done) => {
		let params = {
			body: {"item": _data.daemon_1_3.item}
		};
		requester('/item/daemon', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully updated!");
			
			//let check = validator.validate(body, listUsersSchema);
			//assert.deepEqual(check.valid, true);
			//assert.deepEqual(check.errors, []);
			done();
		});
	});
	
});