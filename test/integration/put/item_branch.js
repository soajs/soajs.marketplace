"use strict";
const assert = require('assert');
const requester = require('../requester');

describe("Testing API: PUT /item/branch", () => {
	
	before(function (done) {
		done();
	});
	
	afterEach((done) => {
		console.log("=======================================");
		done();
	});
	
	it("Success - will delete version by branch", (done) => {
		let params = {
			qs: {
				"name": "sniper",
				"type": "service",
				"branch": "master"
			}
		};
		requester('/item/branch', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, 1);
			done();
		});
	});
	
});