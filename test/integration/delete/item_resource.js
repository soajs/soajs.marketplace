"use strict";

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const assert = require('assert');
const requester = require('../requester');
const _data = require("./data/resource.js");

describe("Testing API: Delete /item", () => {
	
	before(function (done) {
		done();
	});
	
	afterEach((done) => {
		console.log("=======================================");
		done();
	});
	
	it("Success - ADD item antoine of type resource to the catalog", (done) => {
		let params = {
			body: {"item": _data.resource_delete.item}
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
	
	it("Success - delete item antoine of type resource from the catalog", (done) => {
		let params = {
			qs: {"type": "resource", "name": "antoine"}
		};
		requester('/item', 'delete', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body, {"result": true, "data": true});
			//let check = validator.validate(body, listUsersSchema);
			//assert.deepEqual(check.valid, true);
			//assert.deepEqual(check.errors, []);
			done();
		});
	});
	
});