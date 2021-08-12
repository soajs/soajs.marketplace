"use strict";

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const helper = require("../../../helper.js");
const assert = require('assert');
const nock = require("nock");
const sinon = require("sinon");
const lib_cd = helper.requireModule('./bl/lib/cd.js');
const sdk = helper.requireModule('./lib/sdk.js');

describe("Unit test for: BL - lib/cd", () => {
	let soajs = {
		"urac": {
			"id": "1111111111",
			"groups": ["owner"],
			"username": "antoinehage"
		},
		"log": {
			error: () => {
				console.log();
			},
			debug: () => {
				console.log();
			}
		},
		awareness: {
			connect: (service, version, cb) => {
				return cb({
					headers: {},
					host: "www.example.com"
				});
			}
		}
	};
	let bl = {
		marketplace: {
			"handleError": (soajs, errCode) => {
				return ({
					"code": errCode,
				});
			},
		}
	};
	
	
	before((done) => {
		lib_cd.localConfig = helper.requireModule("config.js");
		done();
	});
	
	afterEach((done) => {
		bl.marketplace.mp = null;
		nock.cleanAll();
		sinon.restore();
		done();
	});
	let local = {};
	
	it("cd - fail no inputmaskData", function (done) {
		lib_cd.cd(soajs, null, {}, bl, local, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 400);
			done();
		});
	});
	
	it("cd - fail get check_cd_token error", function (done) {
		bl.marketplace.mp = {
			getModel: () => {
				return {
					getItem: (data, cb) => {
						return cb(null);
					}
				};
			}
		};
		nock('http://www.example.com')
			.get('/cd/token')
			.reply(200, {
				"result": false,
				"errors": {
					"details": [
						{
							"code": 1,
							"message": "error 1"
						},
						{
							"code": 2,
							"message": "error 2"
						}
					]
				}
			});
		let inputmaskData = {
			"token": "123",
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"config": {
				"from": {
					"tag": "1"
				}
			}
		};
		lib_cd.cd(soajs, inputmaskData, {}, bl, local, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 503);
			done();
		});
	});
	
	it("cd - fail get check_cd_token", function (done) {
		let inputmaskData = {
			"token": "123",
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"config": {
				"from": {
					"tag": "1"
				}
			}
		};
		bl.marketplace.mp = {
			getModel: () => {
				return {
					getItem: (data, cb) => {
						return cb(null);
					}
				};
			}
		};
		nock('http://www.example.com')
			.get('/cd/token')
			.query({
				token: inputmaskData.token,
			})
			.reply(200, {
				"result": false,
				"errors": {
					"details": [
						{
							"code": 1,
							"message": "error 1"
						},
						{
							"code": 2,
							"message": "error 2"
						}
					]
				}
			});
		lib_cd.cd(soajs, inputmaskData, {}, bl, local, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 503);
			done();
		});
	});
	
	it("cd - success no cd token", function (done) {
		let inputmaskData = {
			"token": "123",
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"config": {
				"from": {
					"tag": "1"
				}
			}
		};
		bl.marketplace.mp = {
			getModel: () => {
				return {
					getItem: (data, cb) => {
						return cb(null);
					}
				};
			}
		};
		
		nock('http://www.example.com')
			.get('/cd/token')
			.query({
				token: inputmaskData.token,
			})
			.reply(200, {
				"result": true
			});
		
		lib_cd.cd(soajs, inputmaskData, {}, bl, local, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response, {
				"stage_1": {
					"success": [],
					"fail": [
						"Deploy token not found!"
					]
				}
			});
			done();
		});
	});
	
	it("cd - success cd token not active", function (done) {
		let inputmaskData = {
			"token": "123",
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"config": {
				"from": {
					"tag": "1"
				}
			}
		};
		bl.marketplace.mp = {
			getModel: () => {
				return {
					getItem: (data, cb) => {
						return cb(null);
					}
				};
			}
		};
		
		nock('http://www.example.com')
			.get('/cd/token')
			.query({
				token: inputmaskData.token,
			})
			.reply(200, {
				"result": true,
				"data": {
					"token": inputmaskData.token,
					"status": "inactive"
				}
			});
		
		lib_cd.cd(soajs, inputmaskData, {}, bl, local, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response, {
				"stage_1": {
					"success": [],
					"fail": [
						"Deploy token not active!"
					]
				}
			});
			done();
		});
	});
	
	it("cd - success getItem not found", function (done) {
		let inputmaskData = {
			"token": "123",
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"config": {
				"from": {
					"tag": "1"
				}
			}
		};
		bl.marketplace.mp = {
			getModel: () => {
				return {
					getItem: (data, cb) => {
						return cb(null);
					}
				};
			}
		};
		
		nock('http://www.example.com')
			.get('/cd/token')
			.query({
				token: inputmaskData.token,
			})
			.reply(200, {
				"result": true,
				"data": {
					"token": inputmaskData.token,
					"status": "active"
				}
			});
		
		lib_cd.cd(soajs, inputmaskData, {}, bl, local, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response, {
				"stage_1": {
					"success": ["Deploy token authenticated Successfully"],
					"fail": []
				},
				"stage_2": {
					"success": [],
					"fail": [
						"Item not found!"
					]
				}
			});
			done();
		});
	});
	
	it("cd - fail error getItem", function (done) {
		let inputmaskData = {
			"token": "123",
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"config": {
				"from": {
					"tag": "1"
				}
			}
		};
		bl.marketplace.mp = {
			getModel: () => {
				return {
					getItem: (data, cb) => {
						return cb(new Error("error mongo"));
					}
				};
			}
		};
		
		nock('http://www.example.com')
			.get('/cd/token')
			.query({
				token: inputmaskData.token,
			})
			.reply(200, {
				"result": true,
				"data": {
					"token": inputmaskData.token,
					"status": "active"
				}
			});
		
		lib_cd.cd(soajs, inputmaskData, {}, bl, local, (error) => {
			assert.ok(error);
			assert.ok(error.code, 602);
			done();
		});
	});
	
	it("cd - success check_acl not found", function (done) {
		let inputmaskData = {
			"token": "123",
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"config": {
				"from": {
					"tag": "1"
				}
			}
		};
		let item = {
			"_id": "123",
			"name": "marketplace",
			"settings": {
				"environments": {
					"value": ["NEW"],
					"type": "whitelist"
				}
			}
		};
		bl.marketplace.mp = {
			getModel: () => {
				return {
					getItem: (data, cb) => {
						return cb(null, item);
					}
				};
			}
		};
		
		nock('http://www.example.com')
			.get('/cd/token')
			.query({
				token: inputmaskData.token,
			})
			.reply(200, {
				"result": true,
				"data": {
					"token": inputmaskData.token,
					"status": "active"
				}
			});
		
		lib_cd.cd(soajs, inputmaskData, {}, bl, local, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response, {
				"stage_1": {
					"success": ["Deploy token authenticated Successfully"],
					"fail": []
				},
				"stage_2": {
					"success": ["Item found!"],
					"fail": []
				},
				"stage_3": {
					"success": [],
					"fail": ["No environments found!"]
				}
			});
			done();
		});
	});
	
	it("cd - success check_acl env not whitelisted", function (done) {
		let inputmaskData = {
			"token": "123",
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"config": {
				"from": {
					"tag": "1"
				}
			},
			
		};
		let item = {
			"_id": "123",
			"name": "marketplace",
			"settings": {
				"environments": {
					"value": ["DEV"],
					"type": "whitelist"
				}
			},
			"deploy": {
				"NEW": [
					{
						recipe: {
							id: "5ef5a98e707a10af2f5d84c8",
							image: {
								prefix: "soajsorg",
								name: "marketplace",
								tag: "latest"
							},
							readinessProbe: {
								exec: {
									command: [
										"ls"
									]
								},
								initialDelaySeconds: 6,
								timeoutSeconds: 2,
								periodSeconds: 5,
								successThreshold: 1,
								failureThreshold: 3
							},
							ports: {
								type: "kubernetes",
								portType: "Internal",
								values: [
									{
										name: "http",
										target: 80,
										isPublished: true,
										published: 30000
									}
								]
							}
						},
						settings: {
							memory: "0",
							mode: "Deployment"
						},
						cd: {
							strategy: "notify"
						},
						"src": {
							"from": {
								"tag": "1"
							}
						},
						version: "1"
					}
				]
			}
		};
		bl.marketplace.mp = {
			getModel: () => {
				return {
					getItem: (data, cb) => {
						return cb(null, item);
					}
				};
			}
		};
		
		nock('http://www.example.com')
			.get('/cd/token')
			.query({
				token: inputmaskData.token,
			})
			.reply(200, {
				"result": true,
				"data": {
					"token": inputmaskData.token,
					"status": "active"
				}
			});
		
		lib_cd.cd(soajs, inputmaskData, {}, bl, local, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response, {
				"stage_1": {
					"success": ["Deploy token authenticated Successfully"],
					"fail": []
				},
				"stage_2": {
					"success": ["Item found!"],
					"fail": []
				},
				"stage_3": {
					"success": [],
					"fail": ["You have no access to the following environments NEW"]
				}
			});
			done();
		});
	});
	
	it("cd - success check_acl env is blacklisted", function (done) {
		let inputmaskData = {
			"token": "123",
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"config": {
				"from": {
					"tag": "1"
				}
			},
			
		};
		let item = {
			"_id": "123",
			"name": "marketplace",
			"settings": {
				"environments": {
					"value": ["NEW"],
					"type": "blacklist"
				}
			},
			"deploy": {
				"NEW": [
					{
						recipe: {
							id: "5ef5a98e707a10af2f5d84c8",
							image: {
								prefix: "soajsorg",
								name: "marketplace",
								tag: "latest"
							},
							readinessProbe: {
								exec: {
									command: [
										"ls"
									]
								},
								initialDelaySeconds: 6,
								timeoutSeconds: 2,
								periodSeconds: 5,
								successThreshold: 1,
								failureThreshold: 3
							},
							ports: {
								type: "kubernetes",
								portType: "Internal",
								values: [
									{
										name: "http",
										target: 80,
										isPublished: true,
										published: 30000
									}
								]
							}
						},
						settings: {
							memory: "0",
							mode: "Deployment"
						},
						cd: {
							strategy: "notify"
						},
						"src": {
							"from": {
								"tag": "1"
							}
						},
						version: "1"
					}
				]
			}
		};
		bl.marketplace.mp = {
			getModel: () => {
				return {
					getItem: (data, cb) => {
						return cb(null, item);
					}
				};
			}
		};
		
		nock('http://www.example.com')
			.get('/cd/token')
			.query({
				token: inputmaskData.token,
			})
			.reply(200, {
				"result": true,
				"data": {
					"token": inputmaskData.token,
					"status": "active"
				}
			});
		
		lib_cd.cd(soajs, inputmaskData, {}, bl, local, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response, {
				"stage_1": {
					"success": ["Deploy token authenticated Successfully"],
					"fail": []
				},
				"stage_2": {
					"success": ["Item found!"],
					"fail": []
				},
				"stage_3": {
					"success": [],
					"fail": ["You have no access to the following environments NEW"]
				}
			});
			done();
		});
	});
	
	it("cd - success check_acl no env in deploy", function (done) {
		let inputmaskData = {
			"token": "123",
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"config": {
				"from": {
					"tag": "1"
				}
			},
			
		};
		let item = {
			"_id": "123",
			"name": "marketplace",
			"settings": {
				"environments": {
					"value": ["NEW"],
					"type": "blacklist"
				}
			},
			"deploy": {}
		};
		bl.marketplace.mp = {
			getModel: () => {
				return {
					getItem: (data, cb) => {
						return cb(null, item);
					}
				};
			}
		};
		
		nock('http://www.example.com')
			.get('/cd/token')
			.query({
				token: inputmaskData.token,
			})
			.reply(200, {
				"result": true,
				"data": {
					"token": inputmaskData.token,
					"status": "active"
				}
			});
		
		lib_cd.cd(soajs, inputmaskData, {}, bl, local, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response, {
				"stage_1": {
					"success": ["Deploy token authenticated Successfully"],
					"fail": []
				},
				"stage_2": {
					"success": ["Item found!"],
					"fail": []
				},
				"stage_3": {
					"success": [],
					"fail": ["No environments found!"]
				}
			});
			done();
		});
	});
	
	it("cd - success check_acl env is blacklisted", function (done) {
		let inputmaskData = {
			"token": "123",
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"config": {
				"from": {
					"tag": "1",
					"env": ["NEW", "DEV"]
				}
			},
			
		};
		let item = {
			"_id": "123",
			"name": "marketplace",
			"deploy": {
				"new": [
					{
						recipe: {
							id: "5ef5a98e707a10af2f5d84c8",
							image: {
								prefix: "soajsorg",
								name: "marketplace",
								tag: "latest"
							},
							readinessProbe: {
								exec: {
									command: [
										"ls"
									]
								},
								initialDelaySeconds: 6,
								timeoutSeconds: 2,
								periodSeconds: 5,
								successThreshold: 1,
								failureThreshold: 3
							},
							ports: {
								type: "kubernetes",
								portType: "Internal",
								values: [
									{
										name: "http",
										target: 80,
										isPublished: true,
										published: 30000
									}
								]
							}
						},
						settings: {
							memory: "0",
							mode: "Deployment"
						},
						cd: {
							strategy: "notify"
						},
						"src": {
							"from": {
								"tag": "1"
							}
						},
						version: "1"
					}
				]
			}
		};
		bl.marketplace.mp = {
			getModel: () => {
				return {
					getItem: (data, cb) => {
						return cb(null, item);
					}
				};
			}
		};
		
		nock('http://www.example.com')
			.get('/cd/token')
			.query({
				token: inputmaskData.token,
			})
			.reply(200, {
				"result": true,
				"data": {
					"token": inputmaskData.token,
					"status": "active"
				}
			});
		
		lib_cd.cd(soajs, inputmaskData, {}, bl, local, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response, {
				"stage_1": {
					"success": ["Deploy token authenticated Successfully"],
					"fail": []
				},
				"stage_2": {
					"success": ["Item found!"],
					"fail": []
				},
				"stage_3": {
					"success": [],
					"fail": ["Environments: dev were not found."]
				}
			});
			done();
		});
	});
	
	it("cd - success check_acl empty selected env", function (done) {
		let inputmaskData = {
			"token": "123",
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"config": {
				"from": {
					"tag": "1",
					"env": []
				}
			},
			
		};
		let item = {
			"_id": "123",
			"name": "marketplace",
			"deploy": {
				"new": [
					{
						recipe: {
							id: "5ef5a98e707a10af2f5d84c8",
							image: {
								prefix: "soajsorg",
								name: "marketplace",
								tag: "latest"
							},
							readinessProbe: {
								exec: {
									command: [
										"ls"
									]
								},
								initialDelaySeconds: 6,
								timeoutSeconds: 2,
								periodSeconds: 5,
								successThreshold: 1,
								failureThreshold: 3
							},
							ports: {
								type: "kubernetes",
								portType: "Internal",
								values: [
									{
										name: "http",
										target: 80,
										isPublished: true,
										published: 30000
									}
								]
							}
						},
						settings: {
							memory: "0",
							mode: "Deployment"
						},
						cd: {
							strategy: "notify"
						},
						"src": {
							"from": {
								"tag": "1"
							}
						},
						version: "1"
					}
				]
			}
		};
		bl.marketplace.mp = {
			getModel: () => {
				return {
					getItem: (data, cb) => {
						return cb(null, item);
					}
				};
			}
		};
		
		nock('http://www.example.com')
			.get('/cd/token')
			.query({
				token: inputmaskData.token,
			})
			.reply(200, {
				"result": true,
				"data": {
					"token": inputmaskData.token,
					"status": "active"
				}
			});
		
		lib_cd.cd(soajs, inputmaskData, {}, bl, local, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response, {
				"stage_1": {
					"success": ["Deploy token authenticated Successfully"],
					"fail": []
				},
				"stage_2": {
					"success": ["Item found!"],
					"fail": []
				},
				"stage_3": {
					"success": [],
					"fail": ["No environments found!"]
				}
			});
			done();
		});
	});
	
	it("cd - success create_deploy_notice tag and branch", function (done) {
		let inputmaskData = {
			"token": "123",
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"config": {
				"from": {
					"branch": "master"
				}
			},
			
		};
		let item = {
			"_id": "123",
			"name": "marketplace",
			"deploy": {
				"new": [
					{
						recipe: {
							id: "5ef5a98e707a10af2f5d84c8",
							image: {
								prefix: "soajsorg",
								name: "marketplace",
								tag: "latest"
							},
							readinessProbe: {
								exec: {
									command: [
										"ls"
									]
								},
								initialDelaySeconds: 6,
								timeoutSeconds: 2,
								periodSeconds: 5,
								successThreshold: 1,
								failureThreshold: 3
							},
							ports: {
								type: "kubernetes",
								portType: "Internal",
								values: [
									{
										name: "http",
										target: 80,
										isPublished: true,
										published: 30000
									}
								]
							}
						},
						settings: {
							memory: "0",
							mode: "Deployment"
						},
						cd: {
							strategy: "notify"
						},
						"src": {
							"tag": "1"
						},
						version: "1"
					}
				]
			}
		};
		bl.marketplace.mp = {
			getModel: () => {
				return {
					getItem: (data, cb) => {
						return cb(null, item);
					}
				};
			}
		};
		
		nock('http://www.example.com')
			.get('/cd/token')
			.query({
				token: inputmaskData.token,
			})
			.reply(200, {
				"result": true,
				"data": {
					"token": inputmaskData.token,
					"status": "active"
				}
			});
		
		lib_cd.cd(soajs, inputmaskData, {}, bl, local, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response, {
				"stage_1": {
					"success": [
						"Deploy token authenticated Successfully"
					],
					"fail": []
				},
				"stage_2": {
					"success": [
						"Item found!"
					],
					"fail": []
				},
				"stage_3": {
					"success": [
						"Environments: new environments have been found"
					],
					"fail": []
				},
				"stage_4": {
					"success": [
						'Item Version 1 for environment new was selected with cd status notify'
					],
					"fail": []
				},
				"stage_5": {
					"success": [
						'Notification sent for item marketplace v 1 with cd status notify in environment new'
					],
					"fail": []
				},
			});
			done();
		});
	});
	
	it("cd - success create_deploy_notice different version", function (done) {
		let inputmaskData = {
			"token": "123",
			"name": "marketplace",
			"type": "service",
			"version": "2",
			"config": {
				"from": {
					"tag": "1"
				}
			},
			
		};
		let item = {
			"_id": "123",
			"name": "marketplace",
			"deploy": {
				"NEW": [
					{
						recipe: {
							id: "5ef5a98e707a10af2f5d84c8",
							image: {
								prefix: "soajsorg",
								name: "marketplace",
								tag: "latest"
							},
							readinessProbe: {
								exec: {
									command: [
										"ls"
									]
								},
								initialDelaySeconds: 6,
								timeoutSeconds: 2,
								periodSeconds: 5,
								successThreshold: 1,
								failureThreshold: 3
							},
							ports: {
								type: "kubernetes",
								portType: "Internal",
								values: [
									{
										name: "http",
										target: 80,
										isPublished: true,
										published: 30000
									}
								]
							}
						},
						settings: {
							memory: "0",
							mode: "Deployment"
						},
						cd: {
							strategy: "notify"
						},
						"src": {
							"from": {
								"tag": "1"
							}
						},
						version: "1"
					}
				]
			}
		};
		bl.marketplace.mp = {
			getModel: () => {
				return {
					getItem: (data, cb) => {
						return cb(null, item);
					}
				};
			}
		};
		
		nock('http://www.example.com')
			.get('/cd/token')
			.query({
				token: inputmaskData.token,
			})
			.reply(200, {
				"result": true,
				"data": {
					"token": inputmaskData.token,
					"status": "active"
				}
			});
		
		lib_cd.cd(soajs, inputmaskData, {}, bl, local, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response, {
				"stage_1": {
					"success": [
						"Deploy token authenticated Successfully"
					],
					"fail": []
				},
				"stage_2": {
					"success": [
						"Item found!"
					],
					"fail": []
				},
				"stage_3": {
					"success": [
						"Environments: NEW environments have been found"
					],
					"fail": []
				},
				"stage_4": {
					"success": [],
					"fail": [
						"No items for selected version found!"
					]
				}
			});
			done();
		});
	});
	
	it("cd - success create_deploy_notice - notice - tag", function (done) {
		sinon.stub(sdk, 'ledger').callsFake(function fakeFn(soajs, doc, response, cb) {
			return cb();
		});
		let inputmaskData = {
			"token": "123",
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"config": {
				"from": {
					"tag": "1"
				}
			},
			
		};
		let item = {
			"_id": "123",
			"name": "marketplace",
			"deploy": {
				"NEW": [
					{
						recipe: {
							id: "5ef5a98e707a10af2f5d84c8",
							image: {
								prefix: "soajsorg",
								name: "marketplace",
								tag: "latest"
							},
							readinessProbe: {
								exec: {
									command: [
										"ls"
									]
								},
								initialDelaySeconds: 6,
								timeoutSeconds: 2,
								periodSeconds: 5,
								successThreshold: 1,
								failureThreshold: 3
							},
							ports: {
								type: "kubernetes",
								portType: "Internal",
								values: [
									{
										name: "http",
										target: 80,
										isPublished: true,
										published: 30000
									}
								]
							}
						},
						settings: {
							memory: "0",
							mode: "Deployment"
						},
						cd: {
							strategy: "notify"
						},
						"src": {
							"tag": "1"
						},
						version: "1"
					}
				]
			}
		};
		bl.marketplace.mp = {
			getModel: () => {
				return {
					getItem: (data, cb) => {
						return cb(null, item);
					}
				};
			}
		};
		
		nock('http://www.example.com')
			.get('/cd/token')
			.query({
				token: inputmaskData.token,
			})
			.reply(200, {
				"result": true,
				"data": {
					"token": inputmaskData.token,
					"status": "active"
				}
			});
		
		lib_cd.cd(soajs, inputmaskData, {}, bl, local, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response, {
				"stage_1": {
					"success": [
						"Deploy token authenticated Successfully"
					],
					"fail": []
				},
				"stage_2": {
					"success": [
						"Item found!"
					],
					"fail": []
				},
				"stage_3": {
					"success": [
						"Environments: NEW environments have been found"
					],
					"fail": []
				},
				"stage_4": {
					"success": [
						"Item Version 1 for environment NEW was selected with cd status notify"
					],
					"fail": []
				},
				"stage_5": {
					"success": [
						"Notification sent for item marketplace v 1 with cd status notify in environment NEW"
					],
					"fail": []
				}
			});
			done();
		});
	});
	
	it("cd - success create_deploy_notice - notice - branch", function (done) {
		sinon.stub(sdk, 'ledger').callsFake(function fakeFn(soajs, doc, response, cb) {
			return cb();
		});
		let inputmaskData = {
			"token": "123",
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"config": {
				"from": {
					"branch": "master",
					"commit": "1234"
				}
			},
			
		};
		let item = {
			"_id": "123",
			"name": "marketplace",
			"deploy": {
				"NEW": [
					{
						recipe: {
							id: "5ef5a98e707a10af2f5d84c8",
							image: {
								prefix: "soajsorg",
								name: "marketplace",
								tag: "latest"
							},
							readinessProbe: {
								exec: {
									command: [
										"ls"
									]
								},
								initialDelaySeconds: 6,
								timeoutSeconds: 2,
								periodSeconds: 5,
								successThreshold: 1,
								failureThreshold: 3
							},
							ports: {
								type: "kubernetes",
								portType: "Internal",
								values: [
									{
										name: "http",
										target: 80,
										isPublished: true,
										published: 30000
									}
								]
							}
						},
						settings: {
							memory: "0",
							mode: "Deployment"
						},
						cd: {
							strategy: "notify"
						},
						"src": {
							"branch": "master",
							"commit": "123"
						},
						version: "1"
					}
				]
			}
		};
		bl.marketplace.mp = {
			getModel: () => {
				return {
					getItem: (data, cb) => {
						return cb(null, item);
					}
				};
			}
		};
		
		nock('http://www.example.com')
			.get('/cd/token')
			.query({
				token: inputmaskData.token,
			})
			.reply(200, {
				"result": true,
				"data": {
					"token": inputmaskData.token,
					"status": "active"
				}
			});
		
		lib_cd.cd(soajs, inputmaskData, {}, bl, local, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response, {
				"stage_1": {
					"success": [
						"Deploy token authenticated Successfully"
					],
					"fail": []
				},
				"stage_2": {
					"success": [
						"Item found!"
					],
					"fail": []
				},
				"stage_3": {
					"success": [
						"Environments: NEW environments have been found"
					],
					"fail": []
				},
				"stage_4": {
					"success": [
						"Item Version 1 for environment NEW was selected with cd status notify"
					],
					"fail": []
				},
				"stage_5": {
					"success": [
						"Notification sent for item marketplace v 1 with cd status notify in environment NEW"
					],
					"fail": []
				}
			});
			done();
		});
	});
	
	it("cd - success create_deploy_notice - notice - image", function (done) {
		sinon.stub(sdk, 'ledger').callsFake(function fakeFn(soajs, doc, response, cb) {
			return cb();
		});
		let inputmaskData = {
			"token": "123",
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"config": {
				"from": {
					"image_name": "marketplace",
					"image_prefix": "test",
					"image_tag": "1.123",
				}
			},
			
		};
		let item = {
			"_id": "123",
			"name": "marketplace",
			"deploy": {
				"NEW": [
					{
						recipe: {
							id: "5ef5a98e707a10af2f5d84c8",
							image: {
								prefix: "test",
								name: "marketplace",
								tag: "1.123"
							},
							readinessProbe: {
								exec: {
									command: [
										"ls"
									]
								},
								initialDelaySeconds: 6,
								timeoutSeconds: 2,
								periodSeconds: 5,
								successThreshold: 1,
								failureThreshold: 3
							},
							ports: {
								type: "kubernetes",
								portType: "Internal",
								values: [
									{
										name: "http",
										target: 80,
										isPublished: true,
										published: 30000
									}
								]
							}
						},
						settings: {
							memory: "0",
							mode: "Deployment"
						},
						cd: {
							strategy: "notify"
						},
						"src": {
							"tag": "1"
						},
						version: "1"
					}
				]
			}
		};
		bl.marketplace.mp = {
			getModel: () => {
				return {
					getItem: (data, cb) => {
						return cb(null, item);
					}
				};
			}
		};
		
		nock('http://www.example.com')
			.get('/cd/token')
			.query({
				token: inputmaskData.token,
			})
			.reply(200, {
				"result": true,
				"data": {
					"token": inputmaskData.token,
					"status": "active"
				}
			});
		
		lib_cd.cd(soajs, inputmaskData, {}, bl, local, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response, {
				"stage_1": {
					"success": [
						"Deploy token authenticated Successfully"
					],
					"fail": []
				},
				"stage_2": {
					"success": [
						"Item found!"
					],
					"fail": []
				},
				"stage_3": {
					"success": [
						"Environments: NEW environments have been found"
					],
					"fail": []
				},
				"stage_4": {
					"success": [
						"Item Version 1 for environment NEW was selected with cd status notify"
					],
					"fail": []
				},
				"stage_5": {
					"success": [
						"Notification sent for item marketplace v 1 with cd status notify in environment NEW"
					],
					"fail": []
				}
			});
			done();
		});
	});
	
	it("cd - success create_deploy_notice - deploy - tag", function (done) {
		sinon.stub(sdk, 'ledger').callsFake(function fakeFn(soajs, doc, response, cb) {
			if (cb) {
				return cb();
			}
			return null;
		});
		let inputmaskData = {
			"token": "123",
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"config": {
				"from": {
					"tag": "1",
					"image_tag": "1.123",
				}
			},
			
		};
		let item = {
			"_id": "123",
			"name": "marketplace",
			"type": "service",
			"deploy": {
				"NEW": [
					{
						recipe: {
							id: "5ef5a98e707a10af2f5d84c8",
							image: {
								prefix: "test",
								name: "marketplace",
								tag: "1.123"
							},
							readinessProbe: {
								exec: {
									command: [
										"ls"
									]
								},
								initialDelaySeconds: 6,
								timeoutSeconds: 2,
								periodSeconds: 5,
								successThreshold: 1,
								failureThreshold: 3
							},
							ports: {
								type: "kubernetes",
								portType: "Internal",
								values: [
									{
										name: "http",
										target: 80,
										isPublished: true,
										published: 30000
									}
								]
							}
						},
						settings: {
							memory: "0",
							mode: "Deployment"
						},
						cd: {
							strategy: "deploy"
						},
						"src": {
							"tag": "1"
						},
						version: "1"
					}
				]
			}
		};
		bl.marketplace.mp = {
			getModel: () => {
				return {
					getItem: (data, cb) => {
						return cb(null, item);
					}
				};
			}
		};
		
		nock('http://www.example.com')
			.get('/cd/token')
			.query({
				token: inputmaskData.token,
			})
			.reply(200, {
				"result": true,
				"data": {
					"token": inputmaskData.token,
					"status": "active"
				}
			});
		
		let local = {
			saveConfigurationAndDeploy: (soajs, input, options, cb) => {
				return cb(null, true);
			}
		};
		lib_cd.cd(soajs, inputmaskData, {}, bl, local, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response, {
				"stage_1": {
					"success": [
						"Deploy token authenticated Successfully"
					],
					"fail": []
				},
				"stage_2": {
					"success": [
						"Item found!"
					],
					"fail": []
				},
				"stage_3": {
					"success": [
						"Environments: NEW environments have been found"
					],
					"fail": []
				},
				"stage_4": {
					"success": [
						"Item Version 1 for environment NEW was selected with cd status deploy"
					],
					"fail": []
				},
				"stage_5": {
					"success": [
						"Item marketplace v 1 with cd status deploy in environment NEW has been successfully deployed"
					],
					"fail": []
				}
			});
			done();
		});
	});
	
	it("cd - success create_deploy_notice - deploy - branch", function (done) {
		sinon.stub(sdk, 'ledger').callsFake(function fakeFn(soajs, doc, response, cb) {
			if (cb) {
				return cb();
			}
			return null;
		});
		let inputmaskData = {
			"token": "123",
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"config": {
				"from": {
					"branch": "master",
					"commit": "1234",
					"image_tag": "1.123",
				}
			}
		};
		let item = {
			"_id": "123",
			"name": "marketplace",
			"deploy": {
				"NEW": [
					{
						recipe: {
							id: "5ef5a98e707a10af2f5d84c8",
							image: {
								prefix: "test",
								name: "marketplace",
								tag: "1.123"
							},
							readinessProbe: {
								exec: {
									command: [
										"ls"
									]
								},
								initialDelaySeconds: 6,
								timeoutSeconds: 2,
								periodSeconds: 5,
								successThreshold: 1,
								failureThreshold: 3
							},
							ports: {
								type: "kubernetes",
								portType: "Internal",
								values: [
									{
										name: "http",
										target: 80,
										isPublished: true,
										published: 30000
									}
								]
							}
						},
						settings: {
							memory: "0",
							mode: "Deployment"
						},
						cd: {
							strategy: "deploy"
						},
						"src": {
							"branch": "master",
							"commit": "123"
						},
						version: "1"
					}
				]
			}
		};
		bl.marketplace.mp = {
			getModel: () => {
				return {
					getItem: (data, cb) => {
						return cb(null, item);
					}
				};
			}
		};
		
		nock('http://www.example.com')
			.get('/cd/token')
			.query({
				token: inputmaskData.token,
			})
			.reply(200, {
				"result": true,
				"data": {
					"token": inputmaskData.token,
					"status": "active"
				}
			});
		
		let local = {
			saveConfigurationAndDeploy: (soajs, input, options, cb) => {
				return cb(null, true);
			}
		};
		lib_cd.cd(soajs, inputmaskData, {}, bl, local, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response, {
				"stage_1": {
					"success": [
						"Deploy token authenticated Successfully"
					],
					"fail": []
				},
				"stage_2": {
					"success": [
						"Item found!"
					],
					"fail": []
				},
				"stage_3": {
					"success": [
						"Environments: NEW environments have been found"
					],
					"fail": []
				},
				"stage_4": {
					"success": [
						"Item Version 1 for environment NEW was selected with cd status deploy"
					],
					"fail": []
				},
				"stage_5": {
					"success": [
						"Item marketplace v 1 with cd status deploy in environment NEW has been successfully deployed"
					],
					"fail": []
				}
			});
			done();
		});
	});
	
	it("cd - success create_deploy_notice - deploy - image", function (done) {
		sinon.stub(sdk, 'ledger').callsFake(function fakeFn(soajs, doc, response, cb) {
			if (cb) {
				return cb();
			}
			return null;
		});
		let inputmaskData = {
			"token": "123",
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"config": {
				"from": {
					"image_name": "marketplace",
					"image_prefix": "test",
					"image_tag": "1.123",
				}
			},
			
		};
		let item = {
			"_id": "123",
			"name": "marketplace",
			"deploy": {
				"NEW": [
					{
						recipe: {
							id: "5ef5a98e707a10af2f5d84c8",
							image: {
								prefix: "test",
								name: "marketplace",
								tag: "1.123"
							},
							readinessProbe: {
								exec: {
									command: [
										"ls"
									]
								},
								initialDelaySeconds: 6,
								timeoutSeconds: 2,
								periodSeconds: 5,
								successThreshold: 1,
								failureThreshold: 3
							},
							ports: {
								type: "kubernetes",
								portType: "Internal",
								values: [
									{
										name: "http",
										target: 80,
										isPublished: true,
										published: 30000
									}
								]
							}
						},
						settings: {
							memory: "0",
							mode: "Deployment"
						},
						cd: {
							strategy: "deploy"
						},
						"src": {
							"tag": "1"
						},
						version: "1"
					}
				]
			}
		};
		bl.marketplace.mp = {
			getModel: () => {
				return {
					getItem: (data, cb) => {
						return cb(null, item);
					}
				};
			}
		};
		
		nock('http://www.example.com')
			.get('/cd/token')
			.query({
				token: inputmaskData.token,
			})
			.reply(200, {
				"result": true,
				"data": {
					"token": inputmaskData.token,
					"status": "active"
				}
			});
		
		let local = {
			saveConfigurationAndDeploy: (soajs, input, options, cb) => {
				return cb(null, true);
			}
		};
		lib_cd.cd(soajs, inputmaskData, {}, bl, local, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response, {
				"stage_1": {
					"success": [
						"Deploy token authenticated Successfully"
					],
					"fail": []
				},
				"stage_2": {
					"success": [
						"Item found!"
					],
					"fail": []
				},
				"stage_3": {
					"success": [
						"Environments: NEW environments have been found"
					],
					"fail": []
				},
				"stage_4": {
					"success": [
						"Item Version 1 for environment NEW was selected with cd status deploy"
					],
					"fail": []
				},
				"stage_5": {
					"success": [
						"Item marketplace v 1 with cd status deploy in environment NEW has been successfully deployed"
					],
					"fail": []
				}
			});
			done();
		});
	});
	
	it("cd - success create_deploy_notice - deploy - error", function (done) {
		sinon.stub(sdk, 'ledger').callsFake(function fakeFn(soajs, doc, response, cb) {
			if (cb) {
				return cb();
			}
			return null;
		});
		let inputmaskData = {
			"token": "123",
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"config": {
				"from": {
					"image_name": "marketplace",
					"image_prefix": "test",
					"image_tag": "1.123",
				}
			},
			
		};
		let item = {
			"_id": "123",
			"name": "marketplace",
			"deploy": {
				"NEW": [
					{
						recipe: {
							id: "5ef5a98e707a10af2f5d84c8",
							image: {
								prefix: "test",
								name: "marketplace",
								tag: "1.123"
							},
							readinessProbe: {
								exec: {
									command: [
										"ls"
									]
								},
								initialDelaySeconds: 6,
								timeoutSeconds: 2,
								periodSeconds: 5,
								successThreshold: 1,
								failureThreshold: 3
							},
							ports: {
								type: "kubernetes",
								portType: "Internal",
								values: [
									{
										name: "http",
										target: 80,
										isPublished: true,
										published: 30000
									}
								]
							}
						},
						settings: {
							memory: "0",
							mode: "Deployment"
						},
						cd: {
							strategy: "deploy"
						},
						"src": {
							"tag": "1"
						},
						version: "1"
					}
				]
			}
		};
		bl.marketplace.mp = {
			getModel: () => {
				return {
					getItem: (data, cb) => {
						return cb(null, item);
					}
				};
			}
		};
		
		nock('http://www.example.com')
			.get('/cd/token')
			.query({
				token: inputmaskData.token,
			})
			.reply(200, {
				"result": true,
				"data": {
					"token": inputmaskData.token,
					"status": "active"
				}
			});
		
		let local = {
			saveConfigurationAndDeploy: (soajs, input, options, cb) => {
				return cb(new Error("error"));
			}
		};
		lib_cd.cd(soajs, inputmaskData, {}, bl, local, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response, {
				"stage_1": {
					"success": [
						"Deploy token authenticated Successfully"
					],
					"fail": []
				},
				"stage_2": {
					"success": [
						"Item found!"
					],
					"fail": []
				},
				"stage_3": {
					"success": [
						"Environments: NEW environments have been found"
					],
					"fail": []
				},
				"stage_4": {
					"success": [
						"Item Version 1 for environment NEW was selected with cd status deploy"
					],
					"fail": []
				},
				"stage_5": {
					"success": [],
					"fail": [
						"Item marketplace v 1 with cd status deploy in environment NEW failed to deploy!"
					]
				}
			});
			done();
		});
	});
});