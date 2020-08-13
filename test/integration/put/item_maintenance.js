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

describe("Testing API: PUT /item/maintenance", () => {
	
	before(function (done) {
		done();
	});
	
	afterEach((done) => {
		console.log("=======================================");
		done();
	});
	
	it("Success - will make maintenance operation", (done) => {
		let params = {
			qs: {
				"name": "marketplace",
				"type": "service",
				"env": "DASHBOARD",
				"version": "1",
				"operation": "/heartbeat"
			},
			body : {
				port : {
					portType : "maintenance"
				}
			}
		};
		requester('/item/maintenance', 'put', params, (error, body) => {
			assert.ok(body);
			done();
		});
	});
	
});