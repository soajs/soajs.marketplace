"use strict";

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const assert = require('assert');
const requester = require('../../requester');
const _data = require("../data/resource.js");
const core = require('soajs').core;
let validator = new core.validator.Validator();

const validatorSchema = require("../schemas/resource.js");

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
			params = {
				qs: {
					"name": _data.resource_1.item.soa.name,
					"type": 'resource',
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
	
	it("Success - update item resource_1_2 of type resource to the catalog", (done) => {
		let params = {
			body: {"item": _data.resource_1_2.item}
		};
		requester('/item/resource', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully updated!");
			params = {
				qs: {
					"name": _data.resource_1.item.soa.name,
					"type": 'resource',
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
	
	it("Success - update item resource_1_3 of type resource to the catalog", (done) => {
		let params = {
			body: {"item": _data.resource_1_3.item}
		};
		requester('/item/resource', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully updated!");
			params = {
				qs: {
					"name": _data.resource_1.item.soa.name,
					"type": 'resource',
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
	
	it("Success - update item resource_2 of type resource to the catalog", (done) => {
		let params = {
			body: {"item": _data.resource_2.item}
		};
		requester('/item/resource', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully Added!");
			params = {
				qs: {
					"name": _data.resource_1.item.soa.name,
					"type": 'resource',
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
	
	it("Success - update item resource_2_1 of type resource to the catalog", (done) => {
		let params = {
			body: {"item": _data.resource_2_1.item}
		};
		requester('/item/resource', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully updated!");
			params = {
				qs: {
					"name": _data.resource_1.item.soa.name,
					"type": 'resource',
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
	
	it("Success - update item resource_2_2 of type resource to the catalog", (done) => {
		let params = {
			body: {"item": _data.resource_2_2.item}
		};
		requester('/item/resource', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully updated!");
			params = {
				qs: {
					"name": _data.resource_1.item.soa.name,
					"type": 'resource',
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