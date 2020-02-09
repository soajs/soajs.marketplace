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
		modelObj.getItems_by_keywords(data, (error, response) => {
			assert.ok(response);
			assert.deepEqual(response.records.length, 1);
			done();
		});
	});
	it("getItems_by_keywords - with keywords and subtype", function (done) {
		let data = {
			"keywords": "multitenant",
			"subType": "ecommerce",
			"limit": 10,
			"start": 0
		};
		modelObj.getItems_by_keywords(data, (error, response) => {
			assert.ok(response);
			assert.deepEqual(response.records.length, 0);
			done();
		});
	});
	it("getItems_by_keywords - with keywords", function (done) {
		let data = {
			"keywords": "soajs",
			"limit": 1,
			"start": 0
		};
		modelObj.getItems_by_keywords(data, (error, response) => {
			assert.ok(response);
			assert.ok(response.size < response.count);
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
		modelObj.getItems_by_type_subtype(data, (error, response) => {
			assert.ok(response);
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
		modelObj.getItems_by_type_subtype(data, (error, response) => {
			assert.ok(response);
			assert.ok(response.size < response.count);
			done();
		});
	});
	
	it("updateItem_recipes - for shopping", function (done) {
		let main_data = {
			"id": "5e3ef3f9c5a59210a815262a",
			"recipes": ["recipe1", "recipe2"]
		};
		modelObj.updateItem_recipes(main_data, (error, response) => {
			assert.ok(response);
			assert.deepEqual(response, 1);
			let data = {
				"keywords": "shopping",
				"type": "service",
				"subType": "ecommerce",
				"limit": 2,
				"start": 0
			};
			modelObj.getItems_by_keywords(data, (error, response) => {
				assert.ok(response);
				assert.deepEqual(response.records[0].settings.recipes, main_data.recipes);
				done();
			});
		});
	});
	
	it("updateItem_environments - for shopping", function (done) {
		let main_data = {
			"id": "5e3ef3f9c5a59210a815262a",
			"type": "whitelist",
			"environments": ["dev", "stg"]
		};
		modelObj.updateItem_environments(main_data, (error, response) => {
			assert.ok(response);
			assert.deepEqual(response, 1);
			let data = {
				"keywords": "shopping",
				"type": "service",
				"subType": "ecommerce",
				"limit": 2,
				"start": 0
			};
			modelObj.getItems_by_keywords(data, (error, response) => {
				assert.ok(response);
				assert.deepEqual(response.records[0].settings.environments.type, main_data.type);
				assert.deepEqual(response.records[0].settings.environments.value, main_data.environments);
				done();
			});
		});
	});
	
	it("updateItem_acl - for shopping", function (done) {
		let main_data = {
			"id": "5e3ef3f9c5a59210a815262a",
			"type": "whitelist",
			"acl": ["owner", "devops"]
		};
		modelObj.updateItem_acl(main_data, (error, response) => {
			assert.ok(response);
			assert.deepEqual(response, 1);
			let data = {
				"keywords": "shopping",
				"type": "service",
				"subType": "ecommerce",
				"limit": 2,
				"start": 0
			};
			modelObj.getItems_by_keywords(data, (error, response) => {
				assert.ok(response);
				assert.deepEqual(response.records[0].settings.acl.type, main_data.type);
				assert.deepEqual(response.records[0].settings.acl.value, main_data.acl);
				done();
			});
		});
	});
});