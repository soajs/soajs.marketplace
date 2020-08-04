"use strict";
const assert = require('assert');
const requester = require('../requester');

describe("Testing API: PUT /item/acl", () => {
	
	before(function (done) {
		done();
	});
	
	afterEach((done) => {
		console.log("=======================================");
		done();
	});
	
	it("Success - will update acl for a pay item", (done) => {
		let params = {
			body: {
				"id": "5e409c94c5a59210a815262c",
				"type": "whitelist",
				"groups": ["owner", "catalog"]
			}
		};
		requester('/item/acl', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, 1);
			done();
		});
	});
	
});