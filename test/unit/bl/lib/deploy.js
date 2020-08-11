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
const lib_deploy = helper.requireModule('./bl/lib/deploy.js');
const sdk = helper.requireModule('./lib/sdk.js');

describe("Unit test for: BL - lib/deploy", () => {
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
			"handleError": (soajs, errCode, err) => {
				return ({
					"code": errCode,
					"message":err && err.message?  err.message : err
				});
			},
		}
	};
	
	
	before((done) => {
		lib_deploy.localConfig = helper.requireModule("config.js");
		done();
	});
	
	afterEach((done) => {
		bl.marketplace.mp = null;
		nock.cleanAll();
		sinon.restore();
		done();
	});
	
	it("deploy - fail no inputmaskData", function (done) {
		lib_deploy.deploy(soajs, null, {}, bl, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 400);
			done();
		});
	});
	
	it("deploy - fail get_item mongo error", function (done) {
		bl.marketplace.mp = {
			getModel: () => {
				return {
					getItem: (data, cb) => {
						return cb(new Error("mongo error"), null);
					}
				};
			}
		};
		let inputmaskData = {};
		
		lib_deploy.deploy(soajs, inputmaskData, {}, bl, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 602);
			done();
		});
	});
	
	it("deploy - fail item not found", function (done) {
		bl.marketplace.mp = {
			getModel: () => {
				return {
					getItem: (data, cb) => {
						return cb(null, null);
					}
				};
			}
		};
		let inputmaskData = {};
		
		lib_deploy.deploy(soajs, inputmaskData, {}, bl, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 501);
			done();
		});
	});
	
	it("deploy - fail item not whitelisted in env", function (done) {
		bl.marketplace.mp = {
			getModel: () => {
				return {
					getItem: (data, cb) => {
						return cb(null, {
							"_id": "123",
							"name": "marketplace",
							"settings": {
								"environments": {
									"value": ["DEV"],
									"type": "whitelist"
								}
							}
						});
					}
				};
			}
		};
		let inputmaskData = {
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"env": "NEW"
		};
		
		lib_deploy.deploy(soajs, inputmaskData, {}, bl, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 406);
			done();
		});
	});
	
	it("deploy - fail item blacklist in env", function (done) {
		bl.marketplace.mp = {
			getModel: () => {
				return {
					getItem: (data, cb) => {
						return cb(null, {
							"_id": "123",
							"name": "marketplace",
							"settings": {
								"environments": {
									"value": ["NEW"],
									"type": "blacklist"
								}
							}
						});
					}
				};
			}
		};
		let inputmaskData = {
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"env": "NEW"
		};
		
		lib_deploy.deploy(soajs, inputmaskData, {}, bl, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 406);
			done();
		});
	});
	
	it("deploy - fail item no deploy object", function (done) {
		bl.marketplace.mp = {
			getModel: () => {
				return {
					getItem: (data, cb) => {
						return cb(null, {
							"_id": "123",
							"name": "marketplace",
							"versions" :[{
								"version": "1"
							}],
							"settings": {
								"environments": {
									"value": ["test"],
									"type": "blacklist"
								}
							}
						});
					}
				};
			}
		};
		let inputmaskData = {
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"env": "NEW"
		};
		
		lib_deploy.deploy(soajs, inputmaskData, {}, bl, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 407);
			done();
		});
	});
	
	it("deploy - fail item different version 1", function (done) {
		bl.marketplace.mp = {
			getModel: () => {
				return {
					getItem: (data, cb) => {
						return cb(null, {
							"_id": "123",
							"name": "marketplace",
							"settings": {
								"environments": {}
							},
							"deploy": {
								"NEW": [{
									"version": "2",
									"recipe": {
										"id": "9090"
									}
								}]
							}
						});
					}
				};
			}
		};
		let inputmaskData = {
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"env": "NEW"
		};
		
		nock('http://www.example.com')
			.get('/catalog/recipes/get')
			.query({
				id: "9090"
			})
			.reply(200, {
				"result": false,
				"errors": {
					"details": [{
						code: 1,
						message: "error 1"
					},
						{
							code: 2,
							message: "error 2"
						}]
				}
			});
		
		lib_deploy.deploy(soajs, inputmaskData, {}, bl, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 418);
			done();
		});
	});
	
	it("deploy - fail item different version 2", function (done) {
		bl.marketplace.mp = {
			getModel: () => {
				return {
					getItem: (data, cb) => {
						return cb(null, {
							"_id": "123",
							"name": "marketplace",
							"settings": {
								"environments": {}
							},
							"versions" :[{
								"version": "1"
							}],
							"deploy": {
								"NEW": [{
									"version": "2",
									"recipe": {
										"id": "9090"
									}
								}]
							}
						});
					}
				};
			}
		};
		let inputmaskData = {
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"env": "NEW"
		};
		
		nock('http://www.example.com')
			.get('/catalog/recipes/get')
			.query({
				id: "9090"
			})
			.reply(200, {
				"result": false,
				"errors": {
					"details": [{
						code: 1,
						message: "error 1"
					},
						{
							code: 2,
							message: "error 2"
						}]
				}
			});
		
		lib_deploy.deploy(soajs, inputmaskData, {}, bl, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 410);
			done();
		});
	});
	
	it("deploy - fail catalog recipe no found", function (done) {
		bl.marketplace.mp = {
			getModel: () => {
				return {
					getItem: (data, cb) => {
						return cb(null, {
							"_id": "123",
							"name": "marketplace",
							"settings": {
								"environments": {}
							},
							"versions" :[{
								"version": "1"
							}],
							"deploy": {
								"NEW": [{
									"version": "1",
									"recipe": {
										"id": "9090"
									}
								}]
							}
						});
					}
				};
			}
		};
		let inputmaskData = {
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"env": "NEW"
		};
		
		nock('http://www.example.com')
			.get('/catalog/recipes/get')
			.query({
				id: "9090"
			})
			.reply(200, {
				"result": false,
				"errors": {
					"details": [{
						code: 1,
						message: "error 1"
					},
						{
							code: 2,
							message: "error 2"
						}]
				}
			});
		
		lib_deploy.deploy(soajs, inputmaskData, {}, bl, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 503);
			done();
		});
	});
	
	it("deploy - fail no registry", function (done) {
		bl.marketplace.mp = {
			getModel: () => {
				return {
					getItem: (data, cb) => {
						return cb(null, {
							"_id": "123",
							"name": "marketplace",
							"settings": {
								"environments": {}
							},
							"versions" :[{
								"version": "1"
							}],
							"deploy": {
								"NEW": [{
									"version": "1",
									"recipe": {
										"id": "9090"
									}
								}]
							}
						});
					}
				};
			}
		};
		let inputmaskData = {
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"env": "NEW"
		};
		
		sinon.stub(sdk, 'get_env_registry').callsFake(function fakeFn(soajs, data, cb) {
			return cb(new Error("error"));
		});
		nock('http://www.example.com')
			.get('/catalog/recipes/get')
			.query({
				id: "9090"
			})
			.reply(200, {
				"result": true,
				"data": {
					_id: "recipe"
				}
			});
		
		
		lib_deploy.deploy(soajs, inputmaskData, {}, bl, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 417);
			done();
		});
	});
	
	it("deploy - fail registry error", function (done) {
		bl.marketplace.mp = {
			getModel: () => {
				return {
					getItem: (data, cb) => {
						return cb(null, {
							"_id": "123",
							"name": "marketplace",
							"settings": {
								"environments": {}
							},
							"versions" :[{
								"version": "1"
							}],
							"deploy": {
								"NEW": [{
									"version": "1",
									"recipe": {
										"id": "9090"
									}
								}]
							}
						});
					}
				};
			}
		};
		let inputmaskData = {
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"env": "NEW"
		};
		
		sinon.stub(sdk, 'get_env_registry').callsFake(function fakeFn(soajs, data, cb) {
			return cb(new Error("error"));
		});
		nock('http://www.example.com')
			.get('/catalog/recipes/get')
			.query({
				id: "9090"
			})
			.reply(200, {
				"result": true,
				"data": {
					_id: "recipe",
					recipe: {
						deployOptions: {}
					}
				}
			});
		
		lib_deploy.deploy(soajs, inputmaskData, {}, bl, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 416);
			done();
		});
	});
	
	it("deploy - fail registry not found", function (done) {
		bl.marketplace.mp = {
			getModel: () => {
				return {
					getItem: (data, cb) => {
						return cb(null, {
							"_id": "123",
							"name": "marketplace",
							"settings": {
								"environments": {}
							},
							"versions" :[{
								"version": "1"
							}],
							"deploy": {
								"NEW": [{
									"version": "1",
									"recipe": {
										"id": "9090"
									}
								}]
							}
						});
					}
				};
			}
		};
		let inputmaskData = {
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"env": "NEW"
		};
		
		sinon.stub(sdk, 'get_env_registry').callsFake(function fakeFn(soajs, data, cb) {
			return cb(null);
		});
		nock('http://www.example.com')
			.get('/catalog/recipes/get')
			.query({
				id: "9090"
			})
			.reply(200, {
				"result": true,
				"data": {
					_id: "recipe",
					recipe: {
						deployOptions: {}
					}
				}
			});
		
		lib_deploy.deploy(soajs, inputmaskData, {}, bl, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 416);
			done();
		});
	});
	
	it("deploy - fail failed to get source information error", function (done) {
		bl.marketplace.mp = {
			getModel: () => {
				return {
					getItem: (data, cb) => {
						return cb(null, {
							"_id": "123",
							"name": "marketplace",
							"settings": {
								"environments": {}
							},
							"versions" :[{
								"version": "1"
							}],
							"deploy": {
								"NEW": [{
									"version": "1",
									"recipe": {
										"id": "9090"
									},
									"src": {
										"id": "14687"
									}
								}]
							}
						});
					}
				};
			}
		};
		let inputmaskData = {
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"env": "NEW"
		};
		
		sinon.stub(sdk, 'get_env_registry').callsFake(function fakeFn(soajs, data, cb) {
			return cb(null, {
				code: "NEW"
			});
		});
		nock('http://www.example.com')
			.get('/catalog/recipes/get')
			.query({
				id: "9090"
			})
			.reply(200, {
				"result": true,
				"data": {
					_id: "9090",
					name: "marketplace",
					type: "service",
					subtype: "nodejs",
					description: "Deploy Node.js service",
					recipe: {
						deployOptions: {
							image: {
								prefix: "soajsorg",
								name: "marketplace",
								tag: "latest",
								pullPolicy: "Always",
								repositoryType: "public",
								override: true,
								shell: "shell/bin/bash",
								binary: false
							},
							sourceCode: {},
							readinessProbe: {
								exec: {
									command: [
										"ls"
									]
								},
								initialDelaySeconds: 5,
								timeoutSeconds: 5,
								periodSeconds: 5,
								successThreshold: 5,
								failureThreshold: 5,
							},
							livenessProbe: null,
							ports: [
								{
									name: "http",
									target: 80,
									isPublished: true,
									published: 30080
								}
							],
							voluming: [
								{
									docker: {},
									kubernetes: {
										volume: {
											name: "soajsprofile",
											secret: {
												secretName: "soajsprofile"
											}
										},
										volumeMount: {
											mountPath: "/opt/soajs/profile/",
											name: "soajsprofile"
										}
									}
								}
							],
							restartPolicy: {
								condition: "any",
								maxAttempts: 4
							},
							container: {
								network: "soajsnet",
								workingDir: ""
							},
							labels: {
								ragheb: "ragheb"
							},
							execCommands: {
								list: "ls -l"
							}
						},
						buildOptions: {
							env: {
								SOAJS_ENV: {
									type: "computed",
									value: "$SOAJS_ENV"
								},
								SOAJS_DEPLOY_HA: {
									type: "computed",
									value: "$SOAJS_DEPLOY_HA"
								},
								SOAJS_PROFILE: {
									type: "static",
									value: "/opt/soajs/profile/soajsprofile"
								},
								SOAJS_MONGO_CON_KEEPALIVE: {
									type: "static",
									value: "true"
								},
								SOAJS_EXTKEY: {
									type: "computed",
									value: "$SOAJS_EXTKEY"
								}
							},
							cmd: {
								deploy: {
									command: [
										"bash"
									],
									args: [
										"-c",
										"node ."
									]
								}
							}
						}
					}
				}
			});
		
		nock('http://www.example.com')
			.get('/git/repo/info')
			.query({
				id: "14687"
			})
			.reply(200, {
				"result": false
			});
		
		lib_deploy.deploy(soajs, inputmaskData, {}, bl, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 503);
			done();
		});
	});
	
	it("deploy - fail failed to get source information", function (done) {
		bl.marketplace.mp = {
			getModel: () => {
				return {
					getItem: (data, cb) => {
						return cb(null, {
							"_id": "123",
							"name": "marketplace",
							"settings": {
								"environments": {}
							},
							"versions" :[{
								"version": "1"
							}],
							"deploy": {
								"NEW": [{
									"version": "1",
									"recipe": {
										"id": "9090"
									},
									"src": {
										"id": "14687"
									}
								}]
							}
						});
					}
				};
			}
		};
		let inputmaskData = {
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"env": "NEW"
		};
		
		sinon.stub(sdk, 'get_env_registry').callsFake(function fakeFn(soajs, data, cb) {
			return cb(null, {
				code: "NEW"
			});
		});
		nock('http://www.example.com')
			.get('/catalog/recipes/get')
			.query({
				id: "9090"
			})
			.reply(200, {
				"result": true,
				"data": {
					_id: "9090",
					name: "marketplace",
					type: "service",
					subtype: "nodejs",
					description: "Deploy Node.js service",
					recipe: {
						deployOptions: {
							image: {
								prefix: "soajsorg",
								name: "marketplace",
								tag: "latest",
								pullPolicy: "Always",
								repositoryType: "public",
								override: true,
								shell: "shell/bin/bash",
								binary: false
							},
							sourceCode: {},
							readinessProbe: {
								exec: {
									command: [
										"ls"
									]
								},
								initialDelaySeconds: 5,
								timeoutSeconds: 5,
								periodSeconds: 5,
								successThreshold: 5,
								failureThreshold: 5,
							},
							livenessProbe: null,
							ports: [
								{
									name: "http",
									target: 80,
									isPublished: true,
									published: 30080
								}
							],
							voluming: [
								{
									docker: {},
									kubernetes: {
										volume: {
											name: "soajsprofile",
											secret: {
												secretName: "soajsprofile"
											}
										},
										volumeMount: {
											mountPath: "/opt/soajs/profile/",
											name: "soajsprofile"
										}
									}
								}
							],
							restartPolicy: {
								condition: "any",
								maxAttempts: 4
							},
							container: {
								network: "soajsnet",
								workingDir: ""
							},
							labels: {
								ragheb: "ragheb"
							},
							execCommands: {
								list: "ls -l"
							}
						},
						buildOptions: {
							env: {
								SOAJS_ENV: {
									type: "computed",
									value: "$SOAJS_ENV"
								},
								SOAJS_DEPLOY_HA: {
									type: "computed",
									value: "$SOAJS_DEPLOY_HA"
								},
								SOAJS_PROFILE: {
									type: "static",
									value: "/opt/soajs/profile/soajsprofile"
								},
								SOAJS_MONGO_CON_KEEPALIVE: {
									type: "static",
									value: "true"
								},
								SOAJS_EXTKEY: {
									type: "computed",
									value: "$SOAJS_EXTKEY"
								}
							},
							cmd: {
								deploy: {
									command: [
										"bash"
									],
									args: [
										"-c",
										"node ."
									]
								}
							}
						}
					}
				}
			});
		
		nock('http://www.example.com')
			.get('/git/repo/info')
			.query({
				id: "14687"
			})
			.reply(200, {
				"result": true,
				"data": {}
			});
		
		lib_deploy.deploy(soajs, inputmaskData, {}, bl, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 412);
			done();
		});
	});
	
	it("deploy - fail failed to get source information", function (done) {
		bl.marketplace.mp = {
			getModel: () => {
				return {
					getItem: (data, cb) => {
						if (data.type === "config") {
							return cb(null, {
								name: "config",
								type: "config",
								configuration: {
									group: "config"
								},
								"versions" : [{
									"version" : "2",
									"tags": ["1.1"]
								}],
								src: {
									provider: "manual"
								}
							});
						}
						else {
							return cb(null, {
								type: "service",
								name: "marketplace",
								configuration: {
									subType: "soajs",
									group: "Console",
									port: 4007,
									requestTimeout: 30,
									requestTimeoutRenewal: 5
								},
								versions: [
									{
										version: "1",
										maintenance: {
											readiness: "/heartbeat",
											port: {
												type: "maintenance"
											},
											commands: [
												{
													label: "Reload Registry",
													path: "/reloadRegistry",
													icon: "fas fa-undo"
												},
												{
													label: "Resource Info",
													path: "/resourceInfo",
													icon: "fas fa-info"
												}
											]
										},
										apis: []
									}
								],
								deploy: {
									NEW: [
										{
											recipe: {
												id: "9090",
												image: {
													prefix: "soajsorg",
													name: "gateway",
													tag: "latest"
												},
												ports: {
													type: "kubernetes",
													portType: "Internal",
													values: [
														{
															name: "http",
															target: 80,
															isPublished: true
														},
														{
															name: "https",
															target: 443,
															isPublished: true
														}
													]
												},
												sourceCode :{
													"label" : "test",
													"catalog" : "test",
													"id" : "98023",
													"version" : "2",
													"tag" : "1.1",
												},
											},
											settings: {
												memory: "0",
												mode: "Deployment",
												replicas: 1
											},
											cd: {
												strategy: "notify"
											},
											"src": {
												"id": "14687",
												"owner": "soajs",
												"commit": "123"
											},
											version: "1"
										}
									]
								}
							});
						}
						
					}
				};
			}
		};
		let inputmaskData = {
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"env": "NEW"
		};
		
		sinon.stub(sdk, 'get_env_registry').callsFake(function fakeFn(soajs, data, cb) {
			return cb(null, {
				code: "NEW",
				description: "new",
				domain: "soajs.org",
				sitePrefix: "site",
				apiPrefix: "api",
				port: 443,
				protocol: "https",
				deployer: {
					type: "container",
					selected: "container.kubernetes",
					container: {
						kubernetes: {
							id: "5ef30a5b5f04686c4f63f693",
							namespace: "new"
						}
					}
				},
				dbs: {
					config: {
						prefix: ""
					},
					databases: {}
				},
				services: {
					controller: {
						authorization: false,
					},
					config: {
						ports: {
							controller: 4000,
							maintenanceInc: 1000,
							randomInc: 100
						}
					}
				}
			});
		});
		nock('http://www.example.com')
			.get('/catalog/recipes/get')
			.query({
				id: "9090"
			})
			.reply(200, {
				"result": true,
				"data": {
					_id: "9090",
					name: "marketplace",
					type: "service",
					subtype: "nodejs",
					description: "Deploy Node.js service",
					recipe: {
						deployOptions: {
							image: {
								prefix: "soajsorg",
								name: "marketplace",
								tag: "latest",
								pullPolicy: "Always",
								repositoryType: "public",
								override: true,
								shell: "shell/bin/bash",
								binary: false
							},
							sourceCode: {
								"label" : "test",
								"catalog" : "test",
								"id" : "98023",
								"version" : "test",
								"tag" : "1.1",
							},
							readinessProbe: {
								exec: {
									command: [
										"ls"
									]
								},
								initialDelaySeconds: 5,
								timeoutSeconds: 5,
								periodSeconds: 5,
								successThreshold: 5,
								failureThreshold: 5,
							},
							livenessProbe: null,
							ports: [
								{
									name: "http",
									target: 80,
									isPublished: true,
									published: 30080
								}
							],
							voluming: [
								{
									docker: {},
									kubernetes: {
										volume: {
											name: "soajsprofile",
											secret: {
												secretName: "soajsprofile"
											}
										},
										volumeMount: {
											mountPath: "/opt/soajs/profile/",
											name: "soajsprofile"
										}
									}
								}
							],
							restartPolicy: {
								condition: "any",
								maxAttempts: 4
							},
							container: {
								network: "soajsnet",
								workingDir: ""
							},
							labels: {
								ragheb: "ragheb"
							},
							execCommands: {
								list: "ls -l"
							}
						},
						buildOptions: {
							env: {
								SOAJS_ENV: {
									type: "computed",
									value: "$SOAJS_ENV"
								},
								SOAJS_DEPLOY_HA: {
									type: "computed",
									value: "$SOAJS_DEPLOY_HA"
								},
								SOAJS_PROFILE: {
									type: "static",
									value: "/opt/soajs/profile/soajsprofile"
								},
								SOAJS_MONGO_CON_KEEPALIVE: {
									type: "static",
									value: "true"
								},
								SOAJS_NX_DOMAIN: {
									type: "computed",
									value: "$SOAJS_NX_DOMAIN"
								},
								SOAJS_NX_SITE_DOMAIN: {
									type: "computed",
									value: "$SOAJS_NX_SITE_DOMAIN"
								},
								SOAJS_NX_API_DOMAIN: {
									type: "computed",
									value: "$SOAJS_NX_API_DOMAIN"
								},
								SOAJS_SRV_PORT: {
									type: "computed",
									value: "$SOAJS_SRV_PORT"
								},
								SOAJS_SRV_PORT_MAINTENANCE: {
									type: "computed",
									value: "$SOAJS_SRV_PORT_MAINTENANCE"
								},
								SOAJS_SERVICE_NAME: {
									type: "computed",
									value: "$SOAJS_SERVICE_NAME"
								},
								SOAJS_NX_CONTROLLER_PORT: {
									type: "computed",
									value: "$SOAJS_NX_CONTROLLER_PORT"
								},
								SOAJS_CONTROLLER_PORT_MAINTENANCE: {
									type: "computed",
									value: "$SOAJS_CONTROLLER_PORT_MAINTENANCE"
								},
								SOAJS_NX_CONTROLLER_IP: {
									type: "computed",
									value: "$SOAJS_NX_CONTROLLER_IP"
								},
								SOAJS_REGISTRY_API: {
									type: "computed",
									value: "$SOAJS_REGISTRY_API"
								},
								SOAJS_EXTKEY: {
									type: "computed",
									value: "$SOAJS_EXTKEY"
								}
							},
							cmd: {
								deploy: {
									command: [
										"bash"
									],
									args: [
										"-c",
										"node ."
									]
								}
							}
						}
					}
				}
			});
		
		nock('http://www.example.com')
			.get('/git/repo/info')
			.query({
				id: "14687"
			})
			.reply(200, {
				"result": true,
				"data": {
					domain: "github.com",
					repository: "soajs.marketplace",
					name: "marketplace",
					owner: "soajs",
					provider: "github",
					access: "public",
					token: "12345678"
				}
			});
		
		nock('http://www.example.com')
			.get('/git/repo/info')
			.query({
				id: "98023"
			})
			.reply(200, {
				"result": true,
				"data": {
					domain: "github.com",
					repository: "config.test",
					name: "github",
					owner: "soajs",
					provider: "github",
					access: "public",
					token: "576322"
				}
			});
		nock('http://www.example.com')
			.get('/console/tenant')
			.query({
				code: "DBTN"
			})
			.reply(200, {
				"result": true,
				"data": {
					code: "DBTN",
					applications: [
						{
							product: "DSBRD",
							package: "DSBRD_GUEST",
							description: "Dashboard application for DSBRD_GUEST package",
							keys: [
								{
									key: "a139786a6e6d18e48b4987e83789430b",
									extKeys: [
										{
											extKey: "98",
											device: null,
											geo: null,
											env: "DASHBOARD",
											dashboardAccess: true,
											expDate: null
										}
									]
								}
							]
						}
					],
					console: true,
					description: "This is the tenant that holds the access rights and configuration for the console users with DSBRD_GUEST as Guest default package",
					locked: true,
					name: "Console Tenant",
					tag: "Console",
					type: "product"
				}
			});
		
		nock('http://www.example.com')
			.post('/kubernetes/item/deploy/soajs')
			.query({
				configuration: {
					env: "new"
				}
			})
			.reply(200, {
				"result": true,
				"data": true
			});
		
		nock('http://www.example.com')
			.get('/kubernetes/services/Service')
			.query({
				configuration: {
					env: "new"
				},
				filter :{
					labelSelector : 'soajs.env.code=new, soajs.service.name=controller'
				},
				"limit": 100
			})
			.reply(200, {
				"result": true,
				"data": {
					items : [{
						"metadata" :{
							"name": "marketplace",
						},
						"spec" :{
							"clusterIP" : "1.0.0.1"
						}
					}]
				}
			});
		
		lib_deploy.deploy(soajs, inputmaskData, {}, bl, (error, response) => {
			assert.ifError(error);
			assert.ok(response);
			done();
		});
	});
});