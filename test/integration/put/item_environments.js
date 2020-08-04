"use strict";
const assert = require('assert');
const requester = require('../requester');

describe("Testing API: PUT /item/environments", () => {
	
	before(function (done) {
		done();
	});
	
	afterEach((done) => {
		console.log("=======================================");
		done();
	});
	
	it("Success - will update environments for a pay item", (done) => {
		let params = {
			body: {
				"id": "5e409c94c5a59210a815262c",
				"type": "whitelist",
				"environments": ["dev", "app"]
			}
		};
		requester('/item/environments', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, 1);
			done();
		});
	});
	
});