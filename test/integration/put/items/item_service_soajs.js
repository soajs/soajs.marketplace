"use strict";
const assert = require('assert');
const requester = require('../../requester');
const _data = require("../data/soajs.js");

describe("Testing API: PUT /item/service/soajs", () => {
	
	before(function (done) {
		done();
	});
	
	afterEach((done) => {
		console.log("=======================================");
		done();
	});
	
	it("Success - add item soajs_1 of type service to the catalog", (done) => {
		let params = {
			body: {"item": _data.soajs_1.item}
		};
		requester('/item/service/soajs', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully Added!");
			done();
		});
	});
	
	it("Success - add item soajs_1_2 of type service to the catalog", (done) => {
		let params = {
			body: {"item": _data.soajs_1_2.item}
		};
		requester('/item/service/soajs', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully updated!");
			done();
		});
	});
	
	it("Success - add item soajs_1_3 of type service to the catalog", (done) => {
		let params = {
			body: {"item": _data.soajs_1_3.item}
		};
		requester('/item/service/soajs', 'put', params, (error, body) => {
			assert.ok(body);
			console.log(JSON.stringify(body, null, 2))
			assert.deepEqual(body.data, "Catalog Entry Successfully updated!");
			done();
		});
	});
	
	it("Success - add item soajs_2 of type service to the catalog", (done) => {
		let params = {
			body: {"item": _data.soajs_2.item}
		};
		requester('/item/service/soajs', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully Added!");
			done();
		});
	});
	
	it("Success - add item soajs_2_2 of type service to the catalog", (done) => {
		let params = {
			body: {"item": _data.soajs_2_2.item}
		};
		requester('/item/service/soajs', 'put', params, (error, body) => {
			assert.ok(body);
			assert.deepEqual(body.data, "Catalog Entry Successfully updated!");
			done();
		});
	});
	
	it("Success - add item soajs_2_3 of type service to the catalog", (done) => {
		let params = {
			body: {"item": _data.soajs_2_3.item}
		};
		requester('/item/service/soajs', 'put', params, (error, body) => {
			assert.ok(body);
			console.log(JSON.stringify(body, null, 2))
			assert.deepEqual(body.data, "Catalog Entry Successfully updated!");
			done();
		});
	});
	
});