"use strict";

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const helper = require("../../../helper.js");
const Model = helper.requireModule('./model/mongo/recipe.js');
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
								"useUnifiedTopology": true
							}
						}
					}
				};
			}
		}
	};
	before((done) => {
		//custom index for unit mongo tests cases
		modelObj = new Model(service, {index: "test"});
		
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
	
	it("getItem_by_id - success", function (done) {
		let data = {
			"id": "5ef5a98e707a10af2f5d84c8",
		};
		modelObj.getItem_by_id(data, (error, response) => {
			assert.ok(response);
			assert.deepStrictEqual(response._id.toString(), "5ef5a98e707a10af2f5d84c8");
			done();
		});
	});
	
	it("getItem_by_id - error no id", function (done) {
		let data = {};
		modelObj.getItem_by_id(data, (error) => {
			assert.ok(error);
			done();
		});
	});
	
	
	it("getItems - ", function (done) {
		let data = {
			"limit": 10,
			"skip": 0
		};
		modelObj.getItems(data, (error, response) => {
			assert.ok(response);
			assert.deepStrictEqual(response[0]._id.toString(), "5ef5a98e707a10af2f5d84c8");
			done();
		});
	});
	
	it("getItems - model error", function (done) {
		modelObj.getItems(null, (error) => {
			assert.ok(error);
			done();
		});
	});
	
	it("getItems_by_ids - ", function (done) {
		let data = {
			"limit": 10,
			"skip": 0,
			"ids": ["5ef5a98e707a10af2f5d84c8"]
		};
		modelObj.getItems_by_ids(data, (error, response) => {
			assert.ok(response);
			assert.deepStrictEqual(response[0]._id.toString(), "5ef5a98e707a10af2f5d84c8");
			done();
		});
	});
	
	it("getItems_by_ids - model error", function (done) {
		let data = {
		};
		modelObj.getItems_by_ids(data, (error) => {
			assert.ok(error);
			done();
		});
	});
	
	it("getItem_by_id - success with version", function (done) {
		let data = {
			"id": "5ef5a98e707a10af2f5d84c8",
			"version": 1
		};
		modelObj.getItem_by_id(data, (error, response) => {
			assert.ok(response);
			done();
		});
	});
	
	it("getItems - with version", function (done) {
		let data = {
			"limit": 10,
			"skip": 0,
			"version": true
		};
		modelObj.getItems(data, (error, response) => {
			assert.ok(response);
			done();
		});
	});
	
	it("addItem - error model", function (done) {
		let data = {
		
		};
		modelObj.addItem(data, (error) => {
			assert.ok(error);
			done();
		});
	});
	
	it("addItem - ", function (done) {
		let data = {
			"catalog": {}
		};
		modelObj.addItem(data, (error, response) => {
			assert.ok(response);
			done();
		});
	});
	
	it("editItem - ", function (done) {
		let data = {
		};
		modelObj.editItem(data, (error) => {
			assert.ok(error);
			done();
		});
	});
	
	it("editItem - success", function (done) {
		let data = {
			"catalog": {
				name: "Controller",
				type: "service",
				subtype: "nodejs",
				description: "Deploy Node.js service",
				restriction: {
					deployment: [
						"container"
					]
				},
				recipe: {
					deployOptions: {
						image: {
							prefix: "soajsorg",
							name: "gateway",
							tag: "latest",
							pullPolicy: "Always",
							repositoryType: "public",
							override: true,
							shell: "shell/bin/bash",
							binary: true
						},
						sourceCode: {},
						readinessProbe: {
							exec: {
								command: [
									"ls"
								]
							},
							initialDelaySeconds: 5,
							timeoutSeconds: 2,
							periodSeconds: 5,
							successThreshold: 1,
							failureThreshold: 4
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
							maxAttempts: 5
						},
						container: {
							network: "soajsnet",
							workingDir: ""
						},
						labels: {
							ragheb: "ragheb"
						},
						execCommands: {
							list: "ls -la"
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
			},
			"id": "5ef5a98e707a10af2f5d84c8"
		};
		modelObj.editItem(data, (error, response) => {
			assert.ok(response);
			done();
		});
	});
	
	it("editItem - error validate", function (done) {
		let data = {
			"catalog": {
				name: "Controller",
				type: "service",
				subtype: "nodejs",
				description: "Deploy Node.js service",
				restriction: {
					deployment: [
						"container"
					]
				},
				recipe: {
					deployOptions: {
						image: {
							prefix: "soajsorg",
							name: "gateway",
							tag: "latest",
							pullPolicy: "Always",
							repositoryType: "public",
							override: true,
							shell: "shell/bin/bash",
							binary: true
						},
						sourceCode: {},
						readinessProbe: {
							exec: {
								command: [
									"ls"
								]
							},
							initialDelaySeconds: 5,
							timeoutSeconds: 2,
							periodSeconds: 5,
							successThreshold: 1,
							failureThreshold: 4
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
							maxAttempts: 5
						},
						container: {
							network: "soajsnet",
							workingDir: ""
						},
						labels: {
							ragheb: "ragheb"
						},
						execCommands: {
							list: "ls -la"
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
			},
			"id": "123"
		};
		modelObj.editItem(data, (error) => {
			assert.ok(error);
			done();
		});
	});
	
	it("editItem - error updateOne", function (done) {
		let data = {
			"catalog": {
				name: "Controller",
				type: "service",
				subtype: "nodejs",
				description: "Deploy Node.js service",
				restriction: {
					deployment: [
						"container"
					]
				},
				recipe: {
					deployOptions: {
						image: {
							prefix: "soajsorg",
							name: "gateway",
							tag: "latest",
							pullPolicy: "Always",
							repositoryType: "public",
							override: true,
							shell: "shell/bin/bash",
							binary: true
						},
						sourceCode: {},
						readinessProbe: {
							exec: {
								command: [
									"ls"
								]
							},
							initialDelaySeconds: 5,
							timeoutSeconds: 2,
							periodSeconds: 5,
							successThreshold: 1,
							failureThreshold: 4
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
							maxAttempts: 5
						},
						container: {
							network: "soajsnet",
							workingDir: ""
						},
						labels: {
							ragheb: "ragheb"
						},
						execCommands: {
							list: "ls -la"
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
			},
			"id": "5ef5a98e707a10af2f5d84c7"
		};
		modelObj.editItem(data, (error) => {
			assert.ok(error);
			done();
		});
	});
	
	it("deleteItem -model error ", function (done) {
		let data = {
		};
		modelObj.deleteItem(data, (error) => {
			assert.ok(error);
			done();
		});
	});
	
	it("deleteItem - ", function (done) {
		let data = {
			"id": "5ef5a98e707a10af2f5d84c8"
		};
		modelObj.deleteItem(data, (error) => {
			assert.ifError(error);
			done();
		});
	});
	
	it("deleteItem - version", function (done) {
		let data = {
			"id": "5ef5a98e707a10af2f5d84c8",
			"version": 2
		};
		modelObj.deleteItem(data, (error) => {
			assert.ifError(error);
			done();
		});
	});
});
