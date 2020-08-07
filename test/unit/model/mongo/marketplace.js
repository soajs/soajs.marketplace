"use strict";

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

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
	
	it("validateId - error", function (done) {
		modelObj.validateId(null, (error) => {
			assert.ok(error);
			done();
		});
	});
	
	it("validateId - error invalid id", function (done) {
		modelObj.validateId("121212", (error) => {
			assert.ok(error);
			done();
		});
	});
	
	it("validateId - with id", function (done) {
		modelObj.validateId("5cfb05c22ac09278709d0141", (error, _id) => {
			assert.ok(_id);
			done();
		});
	});
	
	it("getItems_by_keywords - with keywords", function (done) {
		let data = {
			"keywords": "marketplace",
			"limit": 10,
			"start": 1,
			"types": ["service"]
		};
		modelObj.getItems_by_keywords(data, (error, response) => {
			assert.ok(response);
			assert.ok(response.records.length > 1);
			done();
		});
	});
	it("getItems_by_keywords - with keywords and subtype", function (done) {
		let data = {
			"keywords": "marketplace",
			"subType": "soajs",
			"limit": 10,
			"start": 0
		};
		modelObj.getItems_by_keywords(data, (error, response) => {
			assert.ok(response);
			assert.deepEqual(response.records.length, 3);
			done();
		});
	});
	it("getItems_by_keywords - with keywords", function (done) {
		let data = {
			"keywords": "marketplace",
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
			"subType": "ecommerce",
			"limit": 10,
			"start": 1,
			"types": ["service"]
		};
		modelObj.getItems_by_type_subtype(data, (error, response) => {
			assert.ok(response);
			done();
		});
	});
	it("getItems_by_type_subtype - with type and subtype", function (done) {
		let data = {
			"type": "service",
			"subType": "ecommerce",
			"limit": 2,
			"start": 0
		};
		modelObj.getItems_by_type_subtype(data, (error, response) => {
			assert.ok(response);
			assert.ok(response.size < response.count);
			done();
		});
	});
	
	it("getItems_by_type_subtype - of type soajs", function (done) {
		let data = {
			"type": "service",
			"soajs": true,
			"limit": 3,
			"start": 0
		};
		modelObj.getItems_by_type_subtype(data, (error, response) => {
			assert.ok(response);
			assert.ok(response.records.length > 1);
			done();
		});
	});
	it("getItems_by_type_subtype - of non-soajs", function (done) {
		let data = {
			"type": "service",
			"soajs": false,
			"limit": 3,
			"start": 0
		};
		modelObj.getItems_by_type_subtype(data, (error, response) => {
			assert.ok(response);
			assert.ok(response.records.length > 1);
			done();
		});
	});
	
	it("updateItem_recipes - for urac SOAJS", function (done) {
		let main_data = {
			"soajs": true,
			"id": "5db1f85be9253564357b303e",
			"recipes": ["core1", "core2"]
		};
		modelObj.updateItem_recipes(main_data, (error, response) => {
			assert.ok(response);
			assert.deepEqual(response, 1);
			let data = {
				"keywords": "urac",
				"soajs": true,
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
			"groups": ["owner", "devops"]
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
				assert.deepEqual(response.records[0].settings.acl.groups.type, main_data.type);
				assert.deepEqual(response.records[0].settings.acl.groups.value, main_data.groups);
				done();
			});
		});
	});
	
	it("getItem_by_source - fail", function (done) {
		let data = {};
		modelObj.getItem_by_source(data, (error) => {
			assert.ok(error);
			done();
		});
	});
	
	it("getItem_by_source - success", function (done) {
		let main_data = {
			"provider": "github",
			"owner": "ht",
			"repo": "mkpl.order"
		};
		modelObj.getItem_by_source(main_data, (error, response) => {
			assert.ok(response);
			assert.deepEqual(response[0].src, main_data);
			done();
		});
	});
	
	it("getItem_by_type - fail", function (done) {
		let data = {};
		modelObj.getItem_by_type(data, (error) => {
			assert.ok(error);
			done();
		});
	});
	
	it("getItem_by_type - success", function (done) {
		let main_data = {
			"type": "service",
			"name": "console",
		};
		modelObj.getItem_by_type(main_data, (error, response) => {
			assert.deepEqual(response.type, "service");
			assert.deepEqual(response.name, "console");
			done();
		});
	});
	
	it("updateItem_recipes - fail", function (done) {
		let data = {};
		modelObj.updateItem_recipes(data, (error) => {
			assert.ok(error);
			done();
		});
	});
	
	it("updateItem_recipes - fail recipes not array", function (done) {
		let main_data = {
			"id": "service",
			"recipes": "console",
		};
		modelObj.updateItem_recipes(main_data, (error) => {
			assert.ok(error);
			done();
		});
	});
	
	it("updateItem_recipes - fail not found", function (done) {
		let main_data = {
			"id": "5efdb1ffd7fe1767a37ba771",
			"recipes": ["5efdb1ffd7fe1767a3rdt123"],
		};
		modelObj.updateItem_recipes(main_data, (error) => {
			assert.ok(error);
			done();
		});
	});
	it("updateItem_recipes - success", function (done) {
		let main_data = {
			"id": "5efdb1ffd7fe1767a37ba771",
			"recipes": ["5efdb1ffd7fe1767a3rdt123"],
			"soajs" : true
		};
		modelObj.updateItem_recipes(main_data, (error, response) => {
			assert.ok(response);
			done();
		});
	});
	
	it("updateItem_recipes - fail no change", function (done) {
		let main_data = {
			"id": "5efdb1ffd7fe1767a37ba771",
			"recipes": ["5efdb1ffd7fe1767a3rdt123"],
			"soajs" : true
		};
		modelObj.updateItem_recipes(main_data, (error) => {
			assert.ok(error);
			done();
		});
	});
	
	it("updateItem_environments - fail", function (done) {
		let data = {};
		modelObj.updateItem_environments(data, (error) => {
			assert.ok(error);
			done();
		});
	});
	
	it("updateItem_environments - fail invalid type ", function (done) {
		let data = {
			"id": "5efdb1ffd7fe1767a37ba771",
			"environments": ["Dashboard"],
			"soajs" : true,
			"type": "blacklists"
		};
		modelObj.updateItem_environments(data, (error) => {
			assert.ok(error);
			done();
		});
	});
	
	it("updateItem_environments - fail invalid environments ", function (done) {
		let data = {
			"id": "5efdb1ffd7fe1767a37ba771",
			"environments": "Dashboard",
			"soajs" : true,
			"type": "blacklist"
		};
		modelObj.updateItem_environments(data, (error) => {
			assert.ok(error);
			done();
		});
	});
	
	it("updateItem_environments - success ", function (done) {
		let data = {
			"id": "5efdb1ffd7fe1767a37ba771",
			"environments": ["Dashboard"],
			"soajs" : true,
			"type": "blacklist"
		};
		modelObj.updateItem_environments(data, (error, response) => {
			assert.ok(response);
			done();
		});
	});
	
	it("updateItem_environments - fail no change ", function (done) {
		let data = {
			"id": "5efdb1ffd7fe1767a37ba771",
			"environments": ["Dashboard"],
			"soajs" : true,
			"type": "blacklist"
		};
		modelObj.updateItem_environments(data, (error) => {
			assert.ok(error);
			done();
		});
	});
	
	it("updateItem_acl - fail", function (done) {
		let data = {};
		modelObj.updateItem_acl(data, (error) => {
			assert.ok(error);
			done();
		});
	});
	
	it("updateItem_acl - fail invalid type ", function (done) {
		let data = {
			"id": "5efdb1ffd7fe1767a37ba771",
			"groups": ["owner"],
			"soajs" : true,
			"type": "blacklists"
		};
		modelObj.updateItem_acl(data, (error) => {
			assert.ok(error);
			done();
		});
	});
	
	it("updateItem_acl - fail invalid group ", function (done) {
		let data = {
			"id": "5efdb1ffd7fe1767a37ba771",
			"groups": "owner",
			"soajs" : true,
			"type": "blacklist"
		};
		modelObj.updateItem_acl(data, (error) => {
			assert.ok(error);
			done();
		});
	});
	
	it("updateItem_acl - success group ", function (done) {
		let data = {
			"id": "5efdb1ffd7fe1767a37ba771",
			"groups": ["owner"],
			"soajs" : true,
			"type": "blacklist"
		};
		modelObj.updateItem_acl(data, (error, response) => {
			assert.ok(response);
			done();
		});
	});
	
	it("updateItem_acl - fail no change in groups ", function (done) {
		let data = {
			"id": "5efdb1ffd7fe1767a37ba771",
			"groups": ["owner"],
			"soajs" : true,
			"type": "blacklist"
		};
		modelObj.updateItem_acl(data, (error) => {
			assert.ok(error);
			done();
		});
	});
	
	it("addItem - fail", function (done) {
		let data = {};
		modelObj.addItem(data, (error) => {
			assert.ok(error);
			done();
		});
	});
	
	it("addItem - success", function (done) {
		let data = {
			"item" : {
				"name": "testItem",
				"description": "MS shopping cart service for marketplace",
				"type": "service",
				"configuration": {
					"subType": "ecommerce",
					"port": 5100,
					"group": "Marketplace",
					"requestTimeout": 30,
					"requestTimeoutRenewal": 5,
					"maintenance": {
						"port": {
							"type": "maintenance"
						},
						"readiness": "/heartbeat"
					}
				},
				"versions": [
					{
						"version": "1",
						"extKeyRequired": true,
						"oauth": true,
						"provision_ACL": false,
						"tenant_Profile": false,
						"urac": false,
						"urac_ACL": false,
						"urac_Config": false,
						"urac_GroupConfig": false,
						"urac_Profile": false,
						"apis": [
							{
								l: "Get shopping cart items",
								v: "/items",
								m: "get",
								group: "Cart"
							},
							{
								l: "Get all carts ",
								v: "/carts",
								m: "get",
								group: "Cart"
							}
						],
						"documentation": {}
					}
				],
				"metadata": {
					"tags": ["cart", "ecommerce"],
					"program": ["marketplace"]
				},
				"ui": {
					"main": "Gateway",
					"sub": ""
				},
				"settings": {
					"acl": {},
					"recipes": [],
					"environments": {}
				},
				"src": {
					"provider": "github",
					"owner": "ht",
					"repo": "mkpl.testcat"
				}
			}
		};
		modelObj.addItem(data, (error, response) => {
			assert.ok(response);
			done();
		});
	});
	
	it("check_can_access - success", function (done) {
		let data = {};
		modelObj.check_can_access(data, {}, () => {
			done();
		});
	});
	
	it("getItem - fail", function (done) {
		let data = {};
		modelObj.getItem(data, (error) => {
			assert.ok(error);
			done();
		});
	});
	
	it("getItem - success", function (done) {
		let data = {
			"name": "pay",
			"type": "service"
		};
		modelObj.getItem(data, (error, response) => {
			assert.ok(response);
			assert.deepEqual(response.name, "pay");
			done();
		});
	});
	
	it("getItem - success", function (done) {
		let data = {
			"name": "pay",
			"type": "service"
		};
		modelObj.getItem(data, (error, response) => {
			assert.ok(response);
			assert.deepEqual(response.name, "pay");
			done();
		});
	});
	
	it("deleteItem - fail", function (done) {
		let data = {};
		modelObj.deleteItem(data, (error) => {
			assert.ok(error);
			done();
		});
	});
	
	it("deleteItem - success", function (done) {
		let data = {
			"name": "testItem",
			"type": "service"
		};
		modelObj.deleteItem(data, (error) => {
			assert.ifError(error);
			modelObj.getItem(data, (error, response) => {
				assert.deepEqual(response, null);
				done();
			});
		});
	});
	it("addItem - success", function (done) {
		let data = {
			"item" : {
				"name": "testItem",
				"description": "MS shopping cart service for marketplace",
				"type": "service",
				"configuration": {
					"subType": "ecommerce",
					"port": 5100,
					"group": "Marketplace",
					"requestTimeout": 30,
					"requestTimeoutRenewal": 5,
					"maintenance": {
						"port": {
							"type": "maintenance"
						},
						"readiness": "/heartbeat"
					}
				},
				"versions": [
					{
						"version": "1",
						"extKeyRequired": true,
						"oauth": true,
						"provision_ACL": false,
						"tenant_Profile": false,
						"urac": false,
						"urac_ACL": false,
						"urac_Config": false,
						"urac_GroupConfig": false,
						"urac_Profile": false,
						"apis": [
							{
								l: "Get shopping cart items",
								v: "/items",
								m: "get",
								group: "Cart"
							},
							{
								l: "Get all carts ",
								v: "/carts",
								m: "get",
								group: "Cart"
							}
						],
						"documentation": {}
					},
					{
						"version": "2",
						"extKeyRequired": true,
						"oauth": true,
						"provision_ACL": false,
						"tenant_Profile": false,
						"urac": false,
						"urac_ACL": false,
						"urac_Config": false,
						"urac_GroupConfig": false,
						"urac_Profile": false,
						"apis": [
							{
								l: "Get shopping cart items",
								v: "/items",
								m: "get",
								group: "Cart"
							},
							{
								l: "Get all carts ",
								v: "/carts",
								m: "get",
								group: "Cart"
							}
						],
						"documentation": {}
					}
				],
				"metadata": {
					"tags": ["cart", "ecommerce"],
					"program": ["marketplace"]
				},
				"ui": {
					"main": "Gateway",
					"sub": ""
				},
				"settings": {
					"acl": {},
					"recipes": [],
					"environments": {}
				},
				"src": {
					"provider": "github",
					"owner": "ht",
					"repo": "mkpl.testcat"
				}
			}
		};
		modelObj.addItem(data, (error, response) => {
			assert.ok(response);
			done();
		});
	});
	
	it("deleteItem_version - fail", function (done) {
		let data = {};
		modelObj.deleteItem_version(data, (error) => {
			assert.ok(error);
			done();
		});
	});
	
	it("deleteItem_version - success", function (done) {
		let data = {
			"name": "testItem",
			"type": "service",
			"versions": [{
				"version": "2",
				"extKeyRequired": true,
				"oauth": true,
				"provision_ACL": false,
				"tenant_Profile": false,
				"urac": false,
				"urac_ACL": false,
				"urac_Config": false,
				"urac_GroupConfig": false,
				"urac_Profile": false,
				"apis": [
					{
						l: "Get shopping cart items",
						v: "/items",
						m: "get",
						group: "Cart"
					},
					{
						l: "Get all carts ",
						v: "/carts",
						m: "get",
						group: "Cart"
					}
				],
				"documentation": {}
			}]
		};
		modelObj.deleteItem_version(data, (error) => {
			assert.ifError(error);
			let data = {
				"name": "testItem",
				"type": "service"
			};
			modelObj.getItem(data, (error, response) => {
				assert.deepEqual(response.versions.length, 1);
				done();
			});
		});
	});
	
	it("update_item_version_config - fail", function (done) {
		let data = {};
		modelObj.update_item_version_config(data, (error) => {
			assert.ok(error);
			done();
		});
	});
	
	it("update_item_version_config - success", function (done) {
		let data = {
			"name": "testItem",
			"type": "service",
			"version": "2",
			"env": "DASHBOARD",
			"settings": {
				"extKeyRequired" : true,
				"oauth" : true
			}
		};
		modelObj.update_item_version_config(data, (error) => {
			assert.ifError(error);
			let data = {
				"name": "testItem",
				"type": "service"
			};
			modelObj.getItem(data, (error, response) => {
				assert.deepEqual(response.versions[0].customByEnv, {
					"DASHBOARD": {
						"extKeyRequired" : true,
						"oauth" : true
					}
				});
				done();
			});
		});
	});
	
	it("update_item_version_config - fail no-change", function (done) {
		let data = {
			"name": "testItem",
			"type": "service",
			"version": "2",
			"env": "DASHBOARD",
			"settings": {
				"extKeyRequired" : true,
				"oauth" : true
			}
		};
		modelObj.update_item_version_config(data, (error) => {
			assert.ok(error);
			done();
		});
	});
	
	it("update_item_configuration - fail", function (done) {
		let data = {};
		modelObj.update_item_configuration(data, (error) => {
			assert.ok(error);
			done();
		});
	});
	it("update_item_configuration - fail", function (done) {
		let data = {
			"type": "service",
			"name": "testItem",
			"config": {
			},
			"response": {}
		};
		modelObj.update_item_configuration(data, (error) => {
			assert.ok(error);
			done();
		});
	});
	
	it("update_item_configuration - success", function (done) {
		let data = {
			"type": "service",
			"name": "testItem",
			"config": {
				"recipe": {
					"id": "5ef5a98e707a10af2f5d84c8",
					"image": {
						"prefix": "soajsorg",
						"name": "gateway",
						"tag": "latest"
					},
					"readinessProbe": {
						"exec": {
							"command": [
								"ls"
							]
						},
						"initialDelaySeconds": 6,
						"timeoutSeconds": 2,
						"periodSeconds": 5,
						"successThreshold": 1,
						"failureThreshold": 3
					},
					"ports": {
						"type": "kubernetes",
						"portType": "Internal",
						"values": [
							{
								"name": "http",
								"target": 80,
								"isPublished": true,
								"published": 30080
							}
						]
					}
				},
				"settings": {
					"memory": "0",
					"mode": "Deployment"
				},
				"cd": {
					"strategy": "notify"
				},
				"version": "1",
				"env": "new"
			},
			"_groups": [
				"owner"
			],
			"response": {
				"type": "service",
				"name": "testItem",
				"configuration": {
					"subType": "ecommerce",
					"port": 5100,
					"group": "Marketplace",
				},
				"versions": [
					{
						"version": "1",
						"maintenance": {
							"readiness": "/heartbeat",
							"port": {
								"type": "maintenance"
							},
							"commands": [
								{
									"label": "Reload Provision",
									"path": "/loadProvision",
									"icon": "fas fa-download"
								},
								{
									"label": "Reload Registry",
									"path": "/reloadRegistry",
									"icon": "fas fa-undo"
								},
								{
									"label": "Reload Awareness",
									"path": "/awarenessStat",
									"icon": "fas fa-wifi"
								}
							]
						}
					}
				]
			}
		};
		modelObj.update_item_configuration(data, (error, response) => {
			assert.ok(response);
			done();
		});
	});
	
	it("update_item_configuration - success change deployment", function (done) {
		let data = {
			"type": "service",
			"name": "testItem",
			"config": {
				"recipe": {
					"id": "5ef5a98e707a10af2f5d84c8",
					"image": {
						"prefix": "new",
						"name": "test",
						"tag": "latest"
					},
					"readinessProbe": {
						"exec": {
							"command": [
								"ls"
							]
						},
						"initialDelaySeconds": 6,
						"timeoutSeconds": 2,
						"periodSeconds": 5,
						"successThreshold": 1,
						"failureThreshold": 3
					},
					"ports": {
						"type": "kubernetes",
						"portType": "Internal",
						"values": [
							{
								"name": "http",
								"target": 80,
								"isPublished": true,
								"published": 30080
							}
						]
					}
				},
				"settings": {
					"memory": "0",
					"mode": "Deployment"
				},
				"cd": {
					"strategy": "notify"
				},
				"version": "1",
				"env": "new"
			},
			"_groups": [
				"owner"
			],
			"response": {
				"_id": "5efdb191d7fe1767a37ba770",
				"type": "service",
				"name": "testItem",
				"configuration": {
					"subType": "ecommerce",
					"port": 5100,
					"group": "Marketplace",
				},
				"versions": [
					{
						"version": "1",
						"maintenance": {
							"readiness": "/heartbeat",
							"port": {
								"type": "maintenance"
							},
							"commands": [
								{
									"label": "Reload Provision",
									"path": "/loadProvision",
									"icon": "fas fa-download"
								},
								{
									"label": "Reload Registry",
									"path": "/reloadRegistry",
									"icon": "fas fa-undo"
								},
								{
									"label": "Reload Awareness",
									"path": "/awarenessStat",
									"icon": "fas fa-wifi"
								}
							]
						}
					}
				],
				"deploy": {
					"new": [
						{
							"recipe": {
								"id": "5ef5a98e707a10af2f5d84c8",
								"image": {
									"prefix": "soajsorg",
									"name": "gateway",
									"tag": "latest"
								},
								"readinessProbe": {
									"exec": {
										"command": [
											"ls"
										]
									},
									"initialDelaySeconds": 5,
									"timeoutSeconds": 2,
									"periodSeconds": 5,
									"successThreshold": 1,
									"failureThreshold": 3
								},
								"ports": {
									"type": "kubernetes",
									"portType": "Internal",
									"values": [
										{
											"name": "http",
											"target": 80,
											"isPublished": true,
											"published": 30080
										}
									]
								}
							},
							"settings": {
								"memory": "0",
								"mode": "Deployment"
							},
							"cd": {
								"strategy": "notify"
							},
							"version": "1"
						}
					]
				}
			}
		};
		modelObj.update_item_configuration(data, (error, response) => {
			assert.ok(response);
			done();
		});
	});
	
	it("update_item_configuration - success add new version", function (done) {
		let data = {
			"type": "service",
			"name": "testItem",
			"config": {
				"recipe": {
					"id": "5ef5a98e707a10af2f5d84c8",
					"image": {
						"prefix": "new",
						"name": "test",
						"tag": "latest"
					},
					"readinessProbe": {
						"exec": {
							"command": [
								"ls"
							]
						},
						"initialDelaySeconds": 6,
						"timeoutSeconds": 2,
						"periodSeconds": 5,
						"successThreshold": 1,
						"failureThreshold": 3
					},
					"ports": {
						"type": "kubernetes",
						"portType": "Internal",
						"values": [
							{
								"name": "http",
								"target": 80,
								"isPublished": true,
								"published": 30080
							}
						]
					}
				},
				"settings": {
					"memory": "0",
					"mode": "Deployment"
				},
				"cd": {
					"strategy": "notify"
				},
				"version": "2",
				"env": "new"
			},
			"_groups": [
				"owner"
			],
			"response": {
				"_id": "5efdb191d7fe1767a37ba770",
				"type": "service",
				"name": "testItem",
				"configuration": {
					"subType": "ecommerce",
					"port": 5100,
					"group": "Marketplace",
				},
				"versions": [
					{
						"version": "1",
						"maintenance": {
							"readiness": "/heartbeat",
							"port": {
								"type": "maintenance"
							},
							"commands": [
								{
									"label": "Reload Provision",
									"path": "/loadProvision",
									"icon": "fas fa-download"
								},
								{
									"label": "Reload Registry",
									"path": "/reloadRegistry",
									"icon": "fas fa-undo"
								},
								{
									"label": "Reload Awareness",
									"path": "/awarenessStat",
									"icon": "fas fa-wifi"
								}
							]
						}
					}
				],
				"deploy": {
					"new": [
						{
							"recipe": {
								"id": "5ef5a98e707a10af2f5d84c8",
								"image": {
									"prefix": "soajsorg",
									"name": "gateway",
									"tag": "latest"
								},
								"readinessProbe": {
									"exec": {
										"command": [
											"ls"
										]
									},
									"initialDelaySeconds": 5,
									"timeoutSeconds": 2,
									"periodSeconds": 5,
									"successThreshold": 1,
									"failureThreshold": 3
								},
								"ports": {
									"type": "kubernetes",
									"portType": "Internal",
									"values": [
										{
											"name": "http",
											"target": 80,
											"isPublished": true,
											"published": 30080
										}
									]
								}
							},
							"settings": {
								"memory": "0",
								"mode": "Deployment"
							},
							"cd": {
								"strategy": "notify"
							},
							"version": "1"
						}
					]
				}
			}
		};
		modelObj.update_item_configuration(data, (error, response) => {
			assert.ok(response);
			done();
		});
	});
	
	it("update_item_configuration - fail no change", function (done) {
		let data = {
			"type": "service",
			"name": "testItem",
			"config": {
				"recipe": {
					"id": "5ef5a98e707a10af2f5d84c8",
					"image": {
						"prefix": "new",
						"name": "test",
						"tag": "latest"
					},
					"readinessProbe": {
						"exec": {
							"command": [
								"ls"
							]
						},
						"initialDelaySeconds": 6,
						"timeoutSeconds": 2,
						"periodSeconds": 5,
						"successThreshold": 1,
						"failureThreshold": 3
					},
					"ports": {
						"type": "kubernetes",
						"portType": "Internal",
						"values": [
							{
								"name": "http",
								"target": 80,
								"isPublished": true,
								"published": 30080
							}
						]
					}
				},
				"settings": {
					"memory": "0",
					"mode": "Deployment"
				},
				"cd": {
					"strategy": "notify"
				},
				"version": "2",
				"env": "new"
			},
			"_groups": [
				"owner"
			],
			"response": {
				"_id": "5efdb191d7fe1767a37ba770",
				"type": "service",
				"name": "testItem",
				"configuration": {
					"subType": "ecommerce",
					"port": 5100,
					"group": "Marketplace",
				},
				"versions": [
					{
						"version": "1",
						"maintenance": {
							"readiness": "/heartbeat",
							"port": {
								"type": "maintenance"
							},
							"commands": [
								{
									"label": "Reload Provision",
									"path": "/loadProvision",
									"icon": "fas fa-download"
								},
								{
									"label": "Reload Registry",
									"path": "/reloadRegistry",
									"icon": "fas fa-undo"
								},
								{
									"label": "Reload Awareness",
									"path": "/awarenessStat",
									"icon": "fas fa-wifi"
								}
							]
						}
					}
				],
				"deploy": {
					"new": [
						{
							"recipe": {
								"id": "5ef5a98e707a10af2f5d84c8",
								"image": {
									"prefix": "soajsorg",
									"name": "gateway",
									"tag": "latest"
								},
								"readinessProbe": {
									"exec": {
										"command": [
											"ls"
										]
									},
									"initialDelaySeconds": 5,
									"timeoutSeconds": 2,
									"periodSeconds": 5,
									"successThreshold": 1,
									"failureThreshold": 3
								},
								"ports": {
									"type": "kubernetes",
									"portType": "Internal",
									"values": [
										{
											"name": "http",
											"target": 80,
											"isPublished": true,
											"published": 30080
										}
									]
								}
							},
							"settings": {
								"memory": "0",
								"mode": "Deployment"
							},
							"cd": {
								"strategy": "notify"
							},
							"version": "1"
						}
					]
				}
			}
		};
		modelObj.update_item_configuration(data, (error) => {
			assert.ok(error);
			done();
		});
	});
	
	it("deleteItem_source - fail", function (done) {
		let data = {};
		modelObj.deleteItem_source(data, (error) => {
			assert.ok(error);
			done();
		});
	});
	
	it("deleteItem_source - success", function (done) {
		let data = {
			"provider": "github",
			"owner": "ht",
			"repo": "mkpl.testcat"
		};
		modelObj.deleteItem_source(data, (error) => {
			assert.ifError(error);
			let data = {
				"name": "testItem",
				"type": "service"
			};
			modelObj.getItem(data, (error, response) => {
				assert.deepEqual(response, null);
				done();
			});
		});
	});
});