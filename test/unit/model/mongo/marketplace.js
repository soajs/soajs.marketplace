"use strict";

const helper = require("../../../helper.js");
const Model = helper.requireModule('./model/mongo/marketplace.js');
const assert = require('assert');

describe("Unit test for: model - marketplace", function () {
	let modelObj = null;
	let service = {
		config: {
			"errors": {},
		},
		log: {
			error: (msg) => {
				console.log(msg);
			},
			debug: (msg) => {
				console.log(msg);
			}
		},
		registry: {
			get: () => {
				return {
					coreDB: {
						provision: {
							"name": "core_provision",
							"prefix": '',
							"servers": [
								{
									"host": "127.0.0.1",
									"port": 27017
								}
							],
							"credentials": null,
							"URLParam": {
								"maxPoolSize": 2,
								"bufferMaxEntries": 0,
								"useUnifiedTopology": true
							}
						}
					}
				};
			}
		}
	};
	before((done) => {
		
		modelObj = new Model(service);
		
		done();
	});
	after((done) => {
		
		modelObj.closeConnection();
		
		done();
	});
	
	it("getItems_by_keywords - with keywords", function (done) {
		let data = {
			"keywords": "multitenant",
			"limit": 10,
			"start": 0
		};
		modelObj.getItems_by_keywords(data, (error, records) => {
			assert.ok(records);
			done();
		});
	});
	it("getItems_by_keywords - with keywords", function (done) {
		let data = {
			"keywords": "soajs",
			"limit": 1,
			"start": 0
		};
		modelObj.getItems_by_keywords(data, (error, records) => {
			assert.ok(records);
			assert.ok(records.size < records.count);
			done();
		});
	});
	
	it("getItems_by_type_subtype - error", function (done) {
		let data = {};
		
		modelObj.getItems_by_type_subtype(data, (error) => {
			assert.ok(error);
			done();
		});
	});
	it("getItems_by_type_subtype - with type and subtype", function (done) {
		let data = {
			"type": "service",
			"subType": "soajs",
			"limit": 10,
			"start": 0
		};
		modelObj.getItems_by_type_subtype(data, (error, records) => {
			assert.ok(records);
			done();
		});
	});
	it("getItems_by_type_subtype - with type and subtype", function (done) {
		let data = {
			"type": "service",
			"subType": "soajs",
			"limit": 2,
			"start": 0
		};
		modelObj.getItems_by_type_subtype(data, (error, records) => {
			assert.ok(records);
			assert.ok(records.size < records.count);
			done();
		});
	});
	
});