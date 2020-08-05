"use strict";
const assert = require('assert');
const requester = require('../../requester');
const _data = require("../data/service.js");
const core = require('soajs').core;
let validator = new core.validator.Validator();

const validatorSchema = require("../schemas/service.js");

describe("Testing API: PUT /item/service", () => {
	
	before(function (done) {
		done();
	});
	
	afterEach((done) => {
		console.log("=======================================");
		done();
	});
	
	it("Success - add item service_1 of type service to the catalog", (done) => {
		let params = {
			body: {"item": _data.service_1.item}
		};
		requester('/item/service', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully Added!");
			params = {
				qs: {
					"name": _data.service_1.item.soa.name,
					"type": 'service',
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
	
	it("Success - update item service_1_2 of type service to the catalog", (done) => {
		let params = {
			body: {"item": _data.service_1_2.item}
		};
		requester('/item/service', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully updated!");
			params = {
				qs: {
					"name": _data.service_1.item.soa.name,
					"type": 'service',
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
	
	it("Success - update item service_1_3 of type service to the catalog", (done) => {
		let params = {
			body: {"item": _data.service_1_3.item}
		};
		requester('/item/service', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully updated!");
			params = {
				qs: {
					"name": _data.service_1.item.soa.name,
					"type": 'service',
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
	
	it("Success - add item service_2 of type service to the catalog", (done) => {
		let params = {
			body: {"item": _data.service_2.item}
		};
		requester('/item/service', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully Added!");
			params = {
				qs: {
					"name": _data.service_1.item.soa.name,
					"type": 'service',
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
	
	it("Success - update item service_2_2 of type service to the catalog", (done) => {
		let params = {
			body: {"item": _data.service_2_2.item}
		};
		requester('/item/service', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully updated!");
			params = {
				qs: {
					"name": _data.service_1.item.soa.name,
					"type": 'service',
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
	
	it("Success - update item service_2_3 of type service to the catalog", (done) => {
		let params = {
			body: {"item": _data.service_2_3.item}
		};
		requester('/item/service', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully updated!");
			params = {
				qs: {
					"name": _data.service_1.item.soa.name,
					"type": 'service',
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