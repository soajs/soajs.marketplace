"use strict";
const assert = require('assert');
const requester = require('../requester');

describe("Testing API: PUT /item/recipes", () => {
	
	before(function (done) {
		done();
	});
	
	afterEach((done) => {
		console.log("=======================================");
		done();
	});
	
	it("Success - will update recipes for a pay item", (done) => {
		let params = {
			body: {
				"id": "5e409c94c5a59210a815262c",
				"recipes": ["123456", "111111"]
			}
		};
		requester('/item/recipes', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, 1);
			done();
		});
	});
	
});