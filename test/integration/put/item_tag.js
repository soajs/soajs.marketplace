"use strict";
const assert = require('assert');
const requester = require('../requester');

describe("Testing API: PUT /item/tag", () => {
	
	before(function (done) {
		done();
	});
	
	afterEach((done) => {
		console.log("=======================================");
		done();
	});
	
	it("Success - will delete version by tag", (done) => {
		let params = {
			qs: {
				"name": "bullet",
				"type": "service",
				"tag": "1"
			}
		};
		requester('/item/tag', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, 1);
			done();
		});
	});
	
});