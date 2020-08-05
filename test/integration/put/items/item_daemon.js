"use strict";
const assert = require('assert');
const requester = require('../../requester');
const _data = require("../data/daemon.js");
const core = require('soajs').core;
let validator = new core.validator.Validator();

const validatorSchema = require("../schemas/daemon.js");

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
			params = {
				qs: {
					"name": _data.daemon_1.item.soa.name,
					"type": 'daemon',
				}
			};
			requester('/item/type', 'get', params, (error, body) => {
				delete body.data._id;
				let check = validator.validate(body.data, validatorSchema);
				assert.deepEqual(check.valid, true);
				assert.deepEqual(check.errors, []);
				done();
			});
		});
	});
	
	it("Success - update item daemon_1_2 of type daemon to the catalog", (done) => {
		let params = {
			body: {"item": _data.daemon_1_2.item}
		};
		requester('/item/daemon', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully updated!");
			params = {
				qs: {
					"name": _data.daemon_1.item.soa.name,
					"type": 'daemon',
				}
			};
			requester('/item/type', 'get', params, (error, body) => {
				delete body.data._id;
				let check = validator.validate(body.data, validatorSchema);
				assert.deepEqual(check.valid, true);
				assert.deepEqual(check.errors, []);
				done();
			});
		});
	});
	
	it("Success - update item daemon_1_3 of type daemon to the catalog", (done) => {
		let params = {
			body: {"item": _data.daemon_1_3.item}
		};
		requester('/item/daemon', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully updated!");
			params = {
				qs: {
					"name": _data.daemon_1.item.soa.name,
					"type": 'daemon',
				}
			};
			requester('/item/type', 'get', params, (error, body) => {
				delete body.data._id;
				let check = validator.validate(body.data, validatorSchema);
				assert.deepEqual(check.valid, true);
				assert.deepEqual(check.errors, []);
				done();
			});
		});
	});
	
	it("Success - add item daemon_2 of type daemon to the catalog", (done) => {
		let params = {
			body: {"item": _data.daemon_2.item}
		};
		requester('/item/daemon', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully Added!");
			params = {
				qs: {
					"name": _data.daemon_1.item.soa.name,
					"type": 'daemon',
				}
			};
			requester('/item/type', 'get', params, (error, body) => {
				delete body.data._id;
				let check = validator.validate(body.data, validatorSchema);
				assert.deepEqual(check.valid, true);
				assert.deepEqual(check.errors, []);
				done();
			});
		});
	});
	
	it("Success - update item daemon_2_2 of type daemon to the catalog", (done) => {
		let params = {
			body: {"item": _data.daemon_2_2.item}
		};
		requester('/item/daemon', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully updated!");
			params = {
				qs: {
					"name": _data.daemon_1.item.soa.name,
					"type": 'daemon',
				}
			};
			requester('/item/type', 'get', params, (error, body) => {
				delete body.data._id;
				let check = validator.validate(body.data, validatorSchema);
				assert.deepEqual(check.valid, true);
				assert.deepEqual(check.errors, []);
				done();
			});
		});
	});
	
	it("Success - update item daemon_2_3 of type daemon to the catalog", (done) => {
		let params = {
			body: {"item": _data.daemon_2_3.item}
		};
		requester('/item/daemon', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully updated!");
			params = {
				qs: {
					"name": _data.daemon_1.item.soa.name,
					"type": 'daemon',
				}
			};
			requester('/item/type', 'get', params, (error, body) => {
				delete body.data._id;
				let check = validator.validate(body.data, validatorSchema);
				assert.deepEqual(check.valid, true);
				assert.deepEqual(check.errors, []);
				done();
			});
		});
	});
	
});