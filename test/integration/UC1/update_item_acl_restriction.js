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
//let core = require('soajs').core;
//let validator = new core.validator.Validator();
//let listUsersSchema = require("../schemas/getUsers.js");

describe("Testing API: PUT /soajs/item/acl", () => {
	
	before(function (done) {
		done();
	});
	
	afterEach((done) => {
		console.log("=======================================");
		done();
	});
	
	it("Fail - will not update environment because of ACL restriction", (done) => {
		let params = {
			body: {
				"id": "5db1f85be9253564357b303d",
				"type": "whitelist",
				"groups": ["catalog"]
			}
		};
		requester('/soajs/item/acl', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, 1);
			
			//let check = validator.validate(body, listUsersSchema);
			//assert.deepEqual(check.valid, true);
			//assert.deepEqual(check.errors, []);
			
			let params = {
				body: {
					"id": "5db1f85be9253564357b303d",
					"type": "whitelist",
					"environments": ["dev", "app", "prod"]
				}
			};
			requester('/soajs/item/environments', 'put', params, (error, body) => {
				assert.ok(body);
				assert.ok(body.errors);
				assert.deepEqual(body.errors.details[0].message, 'Model error: Marketplace: Access restricted to this item.');
				
				//let check = validator.validate(body, listUsersSchema);
				//assert.deepEqual(check.valid, true);
				//assert.deepEqual(check.errors, []);
				
				done();
			});
		});
	});
	
	it("Fail - will not update environment because of ACL restriction", (done) => {
		let params = {
			body: {
				"id": "5db1f85be9253564357b303e",
				"type": "blacklist",
				"groups": ["test"]
			}
		};
		requester('/soajs/item/acl', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, 1);
			
			//let check = validator.validate(body, listUsersSchema);
			//assert.deepEqual(check.valid, true);
			//assert.deepEqual(check.errors, []);
			
			let params = {
				body: {
					"id": "5db1f85be9253564357b303e",
					"type": "whitelist",
					"environments": ["dev", "app", "prod"]
				}
			};
			
			requester('/soajs/item/environments', 'put', params, (error, body) => {
				assert.ok(body);
				assert.ok(body.result);
				
				//let check = validator.validate(body, listUsersSchema);
				//assert.deepEqual(check.valid, true);
				//assert.deepEqual(check.errors, []);
				
				params = {
					body: {
						"id": "5db1f85be9253564357b303e",
						"type": "blacklist",
						"groups": ["owner"]
					}
				};
				requester('/soajs/item/acl', 'put', params, (error, body) => {
					assert.ok(body);
					assert.deepEqual(body.data, 1);
					
					//let check = validator.validate(body, listUsersSchema);
					//assert.deepEqual(check.valid, true);
					//assert.deepEqual(check.errors, []);
					
					let params = {
						body: {
							"id": "5db1f85be9253564357b303e",
							"type": "whitelist",
							"environments": ["dev", "app", "prod"]
						}
					};
					
					requester('/soajs/item/environments', 'put', params, (error, body) => {
						assert.ok(body);
						assert.ok(body.errors);
						assert.deepEqual(body.errors.details[0].message, 'Model error: Marketplace: Access restricted to this item.');
						
						//let check = validator.validate(body, listUsersSchema);
						//assert.deepEqual(check.valid, true);
						//assert.deepEqual(check.errors, []);
						
						done();
					});
				});
			});
		});
	});
	
});