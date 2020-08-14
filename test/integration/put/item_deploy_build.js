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

describe("Testing API: PUT /item/deploy/build", () => {
	
	before(function (done) {
		done();
	});
	
	afterEach((done) => {
		console.log("=======================================");
		done();
	});
	
	it("Success - will build an item", (done) => {
		let params = {
			qs: {
				"name": "marketplace",
				"type": "service"
			},
			body : {
				config : {
					env : "dashboard",
					version : "1",
					recipe : {
						id : "123",
						readinessProbe: {}
					},
					settings : {
						memory : "0",
						mode: "Deployment"
					},
					cd : {
						strategy : "notify"
					}
				}
			}
		};
		requester('/item/deploy/build', 'put', params, (error, body) => {
			assert.ok(body);
			done();
		});
	});
	
});