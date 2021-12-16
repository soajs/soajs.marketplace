/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

const helper = require("../../helper.js");
const BL = helper.requireModule('bl/recipe.js');
const sinon = require('sinon');
const nock = require("nock");
const assert = require('assert');

describe("Unit test for: BL - catalog", () => {
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
	
	before((done) => {
		BL.localConfig = helper.requireModule("config.js");
		done();
	});
	
	afterEach((done) => {
		BL.modelObj = null;
		sinon.restore();
		nock.cleanAll();
		done();
	});
	
	
	it("get - error no inputmaskData", function (done) {
		BL.modelObj = {
			getItem_by_id: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			}
		};
		BL.get(soajs, null, {}, (error) => {
			assert.ok(error);
			assert.deepStrictEqual(error.code, 400);
			done();
		});
	});
	it("get - success with labels", function (done) {
		BL.modelObj = {
			getItem_by_id: (data, cb) => {
				return cb(null, {
					_id: "123",
					recipe: {
						deployOptions: {
							labels: {
								"tes__dot__t": "label"
							}
						}
					}
				});
			}
		};
		let inputmaskData = {
			"id": "123"
		};
		BL.get(soajs, inputmaskData, {}, (error, response) => {
			assert.ok(response);
			assert.deepStrictEqual(response, {
				_id: "123",
				recipe: {
					deployOptions: {
						labels: {
							"tes.t": "label"
						}
					}
				}
			});
			done();
		});
	});
	it("get - success", function (done) {
		BL.modelObj = {
			getItem_by_id: (data, cb) => {
				return cb(null, {
					_id: "123",
					recipe: {
						deployOptions: {}
					}
				});
			}
		};
		let inputmaskData = {
			"id": "123"
		};
		BL.get(soajs, inputmaskData, {}, (error, response) => {
			assert.ok(response);
			assert.deepStrictEqual(response, {
				_id: "123",
				recipe: {
					deployOptions: {}
				}
			});
			done();
		});
	});
	it("get - model error", function (done) {
		BL.modelObj = {
			getItem_by_id: (data, cb) => {
				return cb(new Error("dummy error"));
			}
		};
		let inputmaskData = {
			"id": "123"
		};
		BL.get(soajs, inputmaskData, {}, (error) => {
			assert.ok(error);
			assert.deepStrictEqual(error.code, 602);
			done();
		});
	});
	
	it("list - no inputmaskData", function (done) {
		BL.modelObj = {
			getItems: (data, cb) => {
				return cb(null, [{
					_id: "123",
					recipe: {
						deployOptions: {
							labels: {
								test: "label"
							}
						}
					}
				}]);
			}
		};
		BL.list(soajs, null, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 400);
			done();
		});
	});
	it("list - success", function (done) {
		BL.modelObj = {
			getItems: (data, cb) => {
				return cb(null, [{
					_id: "123",
					recipe: {
						deployOptions: {
							labels: {
								test: "label"
							}
						}
					}
				}]);
			}
		};
		let inputmaskData = {};
		BL.list(soajs, inputmaskData, {}, (error, response) => {
			assert.ok(response);
			assert.deepStrictEqual(response, [{
				_id: "123",
				recipe: {
					deployOptions: {
						labels: {
							test: "label"
						}
					}
				}
			}]);
			done();
		});
	});
	it("list - success no labels", function (done) {
		BL.modelObj = {
			getItems: (data, cb) => {
				return cb(null, [{
					_id: "123",
					recipe: {
						deployOptions: {}
					}
				}]);
			}
		};
		let inputmaskData = {};
		BL.list(soajs, inputmaskData, {}, (error, response) => {
			assert.ok(response);
			assert.deepStrictEqual(response, [{
				_id: "123",
				recipe: {
					deployOptions: {}
				}
			}]);
			done();
		});
	});
	it("list - error", function (done) {
		BL.modelObj = {
			getItems: (data, cb) => {
				return cb(new Error("dummy error"));
			}
		};
		let inputmaskData = {};
		BL.list(soajs, inputmaskData, {}, (error) => {
			assert.ok(error);
			assert.deepStrictEqual(error.code, 602);
			done();
		});
	});
	
	it("list_by_ids - no inputmaskData", function (done) {
		BL.modelObj = {
			getItems_by_ids: (data, cb) => {
				return cb(null, [{
					_id: "123",
					recipe: {
						deployOptions: {
							labels: {
								test: "label"
							}
						}
					}
				}]);
			}
		};
		BL.list_by_ids(soajs, null, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 400);
			done();
		});
	});
	it("list_by_ids - success", function (done) {
		BL.modelObj = {
			getItems_by_ids: (data, cb) => {
				return cb(null, [{
					_id: "123",
					recipe: {
						deployOptions: {
							labels: {
								test: "label"
							}
						}
					}
				}]);
			}
		};
		let inputmaskData = {
			"ids": ["123"]
		};
		BL.list_by_ids(soajs, inputmaskData, {}, (error, response) => {
			assert.ok(response);
			assert.deepStrictEqual(response, [{
				_id: "123",
				recipe: {
					deployOptions: {
						labels: {
							test: "label"
						}
					}
				}
			}]);
			done();
		});
	});
	it("list_by_ids - success no labels", function (done) {
		BL.modelObj = {
			getItems_by_ids: (data, cb) => {
				return cb(null, [{
					_id: "123",
					recipe: {
						deployOptions: {}
					}
				}]);
			}
		};
		let inputmaskData = {
			"ids": ["123"]
		};
		BL.list_by_ids(soajs, inputmaskData, {}, (error, response) => {
			assert.ok(response);
			assert.deepStrictEqual(response, [{
				_id: "123",
				recipe: {
					deployOptions: {}
				}
			}]);
			done();
		});
	});
	it("list - error", function (done) {
		BL.modelObj = {
			getItems_by_ids: (data, cb) => {
				return cb(new Error("dummy error"));
			}
		};
		let inputmaskData = {};
		BL.list_by_ids(soajs, inputmaskData, {}, (error) => {
			assert.ok(error);
			assert.deepStrictEqual(error.code, 602);
			done();
		});
	});
	
	it("delete - no inputmaskData", function (done) {
		BL.modelObj = {
			deleteItem: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			}
		};
		BL.delete(soajs, null, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 400);
			done();
		});
	});
	it("delete - success", function (done) {
		BL.modelObj = {
			deleteItem: (data, cb) => {
				return cb(null);
			}
		};
		let inputmaskData = {
			if: "123"
		};
		BL.delete(soajs, inputmaskData, {}, (error, response) => {
			assert.ifError(error);
			assert.deepStrictEqual(response, "Catalog Recipe Successfully deleted!");
			done();
		});
	});
	it("delete - model error", function (done) {
		BL.modelObj = {
			deleteItem: (data, cb) => {
				return cb(new Error("dummy"));
			}
		};
		let inputmaskData = {
			if: "123"
		};
		BL.delete(soajs, inputmaskData, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 602);
			done();
		});
	});
	
	it("add - no inputmaskData", function (done) {
		BL.modelObj = {
			addItem: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			}
		};
		BL.add(soajs, null, {}, (error) => {
			assert.ok(error);
			assert.deepStrictEqual(error.code, 400);
			done();
		});
	});
	it("add - success no ports", function (done) {
		BL.modelObj = {
			addItem: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			}
		};
		let inputmaskData = {
			"catalog": {
				"name": "test recipe",
				"locked": true,
				"type": "api",
				"subtype": "test",
				"description": "description recipe",
				"recipe": {
					"deployOptions": {
						"image": {
							"prefix": "soajsorg",
							"name": "image",
							"tag": "latest",
							"pullPolicy": "Always",
							"repositoryType": "public",
							"override": false,
							"shell": "/bin/bash",
							"binary": false
						},
						"sourceCode": {
							"configuration": {
								"label": "repo",
								"catalog": "",
								"version": "",
								"branch": "",
								"required": false
							}
						},
						"readinessProbe": {
							"httpGet": {
								"path": "/heartbeat",
								"port": "maintenance"
							},
							"initialDelaySeconds": 1,
							"timeoutSeconds": 2,
							"periodSeconds": 2,
							"successThreshold": 3,
							"failureThreshold": 0
						},
						"livenessProbe": {
						
						},
						"ports": [],
						"voluming": [{
							"docker": {},
							"kubernetes": {
								"volume": {"name": "soajsprofile", "secret": {"secretName": "soajsprofile"}},
								"volumeMount": {"mountPath": "/opt/soajs/profile/", "name": "soajsprofile"}
							}
						}],
						"restartPolicy": {"condition": "", "maxAttempts": 5},
						"container": {"network": "", "workingDir": ""},
						"labels": {"test": "label"},
						"execCommands": {"list": "ls -la"}
					},
					"buildOptions": {
						"env": {
							"secret_key": {
								"type": "secret",
								"secret": "secret",
								"key": "key"
							},
							"user_input": {
								"type": "userInput",
								"label": "label",
								"default": "value",
								"fieldMsg": "message"
							},
							"SOAJS_ENV": {
								"type": "computed",
								"value": "$SOAJS_ENV"
							},
							"test_env": {
								"type": "static",
								"value": "test_value"
							}
						},
						"cmd":
							{
								"deploy":
									{
										"command": ["bash"],
										"args": ["-c", "node ."]
									}
							}
					}
				}
			}
		};
		BL.add(soajs, inputmaskData, {}, (error, response) => {
			assert.ifError(error);
			assert.deepStrictEqual(response, {
				id: "123"
			});
			done();
		});
	});
	it("add - success with nodeport", function (done) {
		BL.modelObj = {
			addItem: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			}
		};
		let inputmaskData = {
			"catalog": {
				"name": "test recipe",
				"locked": true,
				"type": "api",
				"subtype": "test",
				"description": "description recipe",
				"recipe": {
					"deployOptions": {
						"image": {
							"prefix": "soajsorg",
							"name": "image",
							"tag": "latest",
							"pullPolicy": "Always",
							"repositoryType": "public",
							"override": false,
							"shell": "/bin/bash",
							"binary": false
						},
						"sourceCode": {
							"configuration": {
								"label": "repo",
								"catalog": "",
								"version": "",
								"branch": "",
								"required": false
							}
						},
						"readinessProbe": {
							"httpGet": {
								"path": "/heartbeat",
								"port": "maintenance"
							},
							"initialDelaySeconds": 1,
							"timeoutSeconds": 2,
							"periodSeconds": 2,
							"successThreshold": 3,
							"failureThreshold": 0
						},
						"livenessProbe": {
						
						},
						"ports": [{
							"name": "http",
							"target": 80,
							"isPublished": true,
							"published": 31001,
							"preserveClientIP": true
						}],
						"voluming": [{
							"docker": {},
							"kubernetes": {
								"volume": {"name": "soajsprofile", "secret": {"secretName": "soajsprofile"}},
								"volumeMount": {"mountPath": "/opt/soajs/profile/", "name": "soajsprofile"}
							}
						}],
						"restartPolicy": {"condition": "", "maxAttempts": 5},
						"container": {"network": "", "workingDir": ""},
						"labels": {"test": "label"},
						"execCommands": {"list": "ls -la"}
					},
					"buildOptions": {
						"env": {
							"secret_key": {
								"type": "secret",
								"secret": "secret",
								"key": "key"
							},
							"user_input": {
								"type": "userInput",
								"label": "label",
								"default": "value",
								"fieldMsg": "message"
							},
							"SOAJS_ENV": {
								"type": "computed",
								"value": "$SOAJS_ENV"
							},
							"test_env": {
								"type": "static",
								"value": "test_value"
							}
						},
						"cmd":
							{
								"deploy":
									{
										"command": ["bash"],
										"args": ["-c", "node ."]
									}
							}
					}
				}
			}
		};
		BL.add(soajs, inputmaskData, {}, (error, response) => {
			assert.ifError(error);
			assert.deepStrictEqual(response, {
				id: "123"
			});
			done();
		});
	});
	it("add - success with loadbalancer", function (done) {
		BL.modelObj = {
			addItem: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			}
		};
		let inputmaskData = {
			"catalog": {
				"name": "test recipe",
				"locked": true,
				"type": "api",
				"subtype": "test",
				"description": "description recipe",
				"recipe": {
					"deployOptions": {
						"image": {
							"prefix": "soajsorg",
							"name": "image",
							"tag": "latest",
							"pullPolicy": "Always",
							"repositoryType": "public",
							"override": false,
							"shell": "/bin/bash",
							"binary": false
						},
						"sourceCode": {
							"configuration": {
								"label": "repo",
								"catalog": "",
								"version": "",
								"branch": "",
								"required": false
							}
						},
						"readinessProbe": {
							"httpGet": {
								"path": "/heartbeat",
								"port": "maintenance"
							},
							"initialDelaySeconds": 1,
							"timeoutSeconds": 2,
							"periodSeconds": 2,
							"successThreshold": 3,
							"failureThreshold": 0
						},
						"livenessProbe": {
						
						},
						"ports": [{
							"name": "http",
							"target": 80,
							"isPublished": true,
							"preserveClientIP": true
						}],
						"voluming": [{
							"docker": {},
							"kubernetes": {
								"volume": {"name": "soajsprofile", "secret": {"secretName": "soajsprofile"}},
								"volumeMount": {"mountPath": "/opt/soajs/profile/", "name": "soajsprofile"}
							}
						}],
						"restartPolicy": {"condition": "", "maxAttempts": 5},
						"container": {"network": "", "workingDir": ""},
						"labels": {"test": "label"},
						"execCommands": {"list": "ls -la"}
					},
					"buildOptions": {
						"env": {
							"secret_key": {
								"type": "secret",
								"secret": "secret",
								"key": "key"
							},
							"user_input": {
								"type": "userInput",
								"label": "label",
								"default": "value",
								"fieldMsg": "message"
							},
							"SOAJS_ENV": {
								"type": "computed",
								"value": "$SOAJS_ENV"
							},
							"test_env": {
								"type": "static",
								"value": "test_value"
							}
						},
						"cmd":
							{
								"deploy":
									{
										"command": ["bash"],
										"args": ["-c", "node ."]
									}
							}
					}
				}
			}
		};
		BL.add(soajs, inputmaskData, {}, (error, response) => {
			assert.ifError(error);
			assert.deepStrictEqual(response, {
				id: "123"
			});
			done();
		});
	});
	it("add - success not published", function (done) {
		BL.modelObj = {
			addItem: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			}
		};
		let inputmaskData = {
			"catalog": {
				"name": "test recipe",
				"locked": true,
				"type": "api",
				"subtype": "test",
				"description": "description recipe",
				"recipe": {
					"deployOptions": {
						"image": {
							"prefix": "soajsorg",
							"name": "image",
							"tag": "latest",
							"pullPolicy": "Always",
							"repositoryType": "public",
							"override": false,
							"shell": "/bin/bash",
							"binary": false
						},
						"sourceCode": {
							"configuration": {
								"label": "repo",
								"catalog": "",
								"version": "",
								"branch": "",
								"required": false
							}
						},
						"readinessProbe": {
							"httpGet": {
								"path": "/heartbeat",
								"port": "maintenance"
							},
							"initialDelaySeconds": 1,
							"timeoutSeconds": 2,
							"periodSeconds": 2,
							"successThreshold": 3,
							"failureThreshold": 0
						},
						"livenessProbe": {
						
						},
						"ports": [{
							"name": "http",
							"target": 80,
							"isPublished": false,
							"published": 31001,
							"preserveClientIP": true
						}],
						"voluming": [{
							"docker": {},
							"kubernetes": {
								"volume": {"name": "soajsprofile", "secret": {"secretName": "soajsprofile"}},
								"volumeMount": {"mountPath": "/opt/soajs/profile/", "name": "soajsprofile"}
							}
						}],
						"restartPolicy": {"condition": "", "maxAttempts": 5},
						"container": {"network": "", "workingDir": ""},
						"execCommands": {"list": "ls -la"}
					},
					"buildOptions": {
						"env": {
							"secret_key": {
								"type": "secret",
								"secret": "secret",
								"key": "key"
							},
							"user_input": {
								"type": "userInput",
								"label": "label",
								"default": "value",
								"fieldMsg": "message"
							},
							"SOAJS_ENV": {
								"type": "computed",
								"value": "$SOAJS_ENV"
							},
							"test_env": {
								"type": "static",
								"value": "test_value"
							}
						},
						"cmd":
							{
								"deploy":
									{
										"command": ["bash"],
										"args": ["-c", "node ."]
									}
							}
					}
				}
			}
		};
		BL.add(soajs, inputmaskData, {}, (error, response) => {
			assert.ifError(error);
			assert.deepStrictEqual(response, {
				id: "123"
			});
			done();
		});
	});
	it("add - error model", function (done) {
		BL.modelObj = {
			addItem: (data, cb) => {
				return cb(new Error("dummy"));
			}
		};
		let inputmaskData = {
			"catalog": {
				"name": "test recipe",
				"locked": true,
				"type": "api",
				"subtype": "test",
				"description": "description recipe",
				"recipe": {
					"deployOptions": {
						"image": {
							"prefix": "soajsorg",
							"name": "image",
							"tag": "latest",
							"pullPolicy": "Always",
							"repositoryType": "public",
							"override": false,
							"shell": "/bin/bash",
							"binary": false
						},
						"sourceCode": {
							"configuration": {
								"label": "repo",
								"catalog": "",
								"version": "",
								"branch": "",
								"required": false
							}
						},
						"readinessProbe": {
							"httpGet": {
								"path": "/heartbeat",
								"port": "maintenance"
							},
							"initialDelaySeconds": 1,
							"timeoutSeconds": 2,
							"periodSeconds": 2,
							"successThreshold": 3,
							"failureThreshold": 0
						},
						"livenessProbe": {
						
						},
						"ports": [{
							"name": "http",
							"target": 80,
							"isPublished": true,
							"published": 31001,
							"preserveClientIP": true
						}],
						"voluming": [{
							"docker": {},
							"kubernetes": {
								"volume": {"name": "soajsprofile", "secret": {"secretName": "soajsprofile"}},
								"volumeMount": {"mountPath": "/opt/soajs/profile/", "name": "soajsprofile"}
							}
						}],
						"restartPolicy": {"condition": "", "maxAttempts": 5},
						"container": {"network": "", "workingDir": ""},
						"labels": {"test": "label"},
						"execCommands": {"list": "ls -la"}
					},
					"buildOptions": {
						"env": {
							"secret_key": {
								"type": "secret",
								"secret": "secret",
								"key": "key"
							},
							"user_input": {
								"type": "userInput",
								"label": "label",
								"default": "value",
								"fieldMsg": "message"
							},
							"SOAJS_ENV": {
								"type": "computed",
								"value": "$SOAJS_ENV"
							},
							"test_env": {
								"type": "static",
								"value": "test_value"
							}
						},
						"cmd":
							{
								"deploy":
									{
										"command": ["bash"],
										"args": ["-c", "node ."]
									}
							}
					}
				}
			}
		};
		BL.add(soajs, inputmaskData, {}, (error) => {
			assert.ok(error);
			assert.deepStrictEqual(error.code, 602);
			done();
		});
	});
	it("add - error sourceCode no labels", function (done) {
		BL.modelObj = {
			addItem: (data, cb) => {
				return cb(new Error("dummy"));
			}
		};
		let inputmaskData = {
			"catalog": {
				"name": "test recipe",
				"locked": true,
				"type": "api",
				"subtype": "test",
				"description": "description recipe",
				"recipe": {
					"deployOptions": {
						"image": {
							"prefix": "soajsorg",
							"name": "image",
							"tag": "latest",
							"pullPolicy": "Always",
							"repositoryType": "public",
							"override": false,
							"shell": "/bin/bash",
							"binary": false
						},
						"sourceCode": {
							"configuration": {
								"catalog": "",
								"version": "",
								"branch": "",
								"required": false
							}
						},
						"readinessProbe": {
							"httpGet": {
								"path": "/heartbeat",
								"port": "maintenance"
							},
							"initialDelaySeconds": 1,
							"timeoutSeconds": 2,
							"periodSeconds": 2,
							"successThreshold": 3,
							"failureThreshold": 0
						},
						"livenessProbe": {
						
						},
						"ports": [{
							"name": "http",
							"target": 80,
							"isPublished": true,
							"published": 31001,
							"preserveClientIP": true
						}],
						"voluming": [{
							"docker": {},
							"kubernetes": {
								"volume": {"name": "soajsprofile", "secret": {"secretName": "soajsprofile"}},
								"volumeMount": {"mountPath": "/opt/soajs/profile/", "name": "soajsprofile"}
							}
						}],
						"restartPolicy": {"condition": "", "maxAttempts": 5},
						"container": {"network": "", "workingDir": ""},
						"labels": {"test": "label"},
						"execCommands": {"list": "ls -la"}
					},
					"buildOptions": {
						"env": {
							"secret_key": {
								"type": "secret",
								"secret": "secret",
								"key": "key"
							},
							"user_input": {
								"type": "userInput",
								"label": "label",
								"default": "value",
								"fieldMsg": "message"
							},
							"SOAJS_ENV": {
								"type": "computed",
								"value": "$SOAJS_ENV"
							},
							"test_env": {
								"type": "static",
								"value": "test_value"
							}
						},
						"cmd":
							{
								"deploy":
									{
										"command": ["bash"],
										"args": ["-c", "node ."]
									}
							}
					}
				}
			}
		};
		BL.add(soajs, inputmaskData, {}, (error) => {
			assert.ok(error);
			assert.deepStrictEqual(error.code, 430);
			done();
		});
	});
	it("add - error sourceCode", function (done) {
		BL.modelObj = {
			addItem: (data, cb) => {
				return cb(new Error("dummy"));
			}
		};
		let inputmaskData = {
			"catalog": {
				"name": "test recipe",
				"locked": true,
				"type": "api",
				"subtype": "test",
				"description": "description recipe",
				"recipe": {
					"deployOptions": {
						"image": {
							"prefix": "soajsorg",
							"name": "image",
							"tag": "latest",
							"pullPolicy": "Always",
							"repositoryType": "public",
							"override": false,
							"shell": "/bin/bash",
							"binary": false
						},
						"sourceCode": {
							"configuration": {
								"label": "er",
								"catalog": "test",
								"required": false
							}
						},
						"readinessProbe": {
							"httpGet": {
								"path": "/heartbeat",
								"port": "maintenance"
							},
							"initialDelaySeconds": 1,
							"timeoutSeconds": 2,
							"periodSeconds": 2,
							"successThreshold": 3,
							"failureThreshold": 0
						},
						"livenessProbe": {
						
						},
						"ports": [{
							"name": "http",
							"target": 80,
							"isPublished": true,
							"published": 31001,
							"preserveClientIP": true
						}],
						"voluming": [{
							"docker": {},
							"kubernetes": {
								"volume": {"name": "soajsprofile", "secret": {"secretName": "soajsprofile"}},
								"volumeMount": {"mountPath": "/opt/soajs/profile/", "name": "soajsprofile"}
							}
						}],
						"restartPolicy": {"condition": "", "maxAttempts": 5},
						"container": {"network": "", "workingDir": ""},
						"labels": {"test": "label"},
						"execCommands": {"list": "ls -la"}
					},
					"buildOptions": {
						"env": {
							"secret_key": {
								"type": "secret",
								"secret": "secret",
								"key": "key"
							},
							"user_input": {
								"type": "userInput",
								"label": "label",
								"default": "value",
								"fieldMsg": "message"
							},
							"SOAJS_ENV": {
								"type": "computed",
								"value": "$SOAJS_ENV"
							},
							"test_env": {
								"type": "static",
								"value": "test_value"
							}
						},
						"cmd":
							{
								"deploy":
									{
										"command": ["bash"],
										"args": ["-c", "node ."]
									}
							}
					}
				}
			}
		};
		BL.add(soajs, inputmaskData, {}, (error) => {
			assert.ok(error);
			assert.deepStrictEqual(error.code, 430);
			done();
		});
	});
	it("add - error wrong port", function (done) {
		BL.modelObj = {
			addItem: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			}
		};
		let inputmaskData = {
			"catalog": {
				"name": "test recipe",
				"locked": true,
				"type": "api",
				"subtype": "test",
				"description": "description recipe",
				"recipe": {
					"deployOptions": {
						"image": {
							"prefix": "soajsorg",
							"name": "image",
							"tag": "latest",
							"pullPolicy": "Always",
							"repositoryType": "public",
							"override": false,
							"shell": "/bin/bash",
							"binary": false
						},
						"sourceCode": {
							"configuration": {
								"label": "repo",
								"catalog": "",
								"version": "",
								"branch": "",
								"required": false
							}
						},
						"readinessProbe": {
							"httpGet": {
								"path": "/heartbeat",
								"port": "maintenance"
							},
							"initialDelaySeconds": 1,
							"timeoutSeconds": 2,
							"periodSeconds": 2,
							"successThreshold": 3,
							"failureThreshold": 0
						},
						"livenessProbe": {
						
						},
						"ports": [{
							"name": "http",
							"target": 80,
							"isPublished": true,
							"published": 2342,
							"preserveClientIP": true
						}],
						"voluming": [{
							"docker": {},
							"kubernetes": {
								"volume": {"name": "soajsprofile", "secret": {"secretName": "soajsprofile"}},
								"volumeMount": {"mountPath": "/opt/soajs/profile/", "name": "soajsprofile"}
							}
						}],
						"restartPolicy": {"condition": "", "maxAttempts": 5},
						"container": {"network": "", "workingDir": ""},
						"labels": {"test": "label"},
						"execCommands": {"list": "ls -la"}
					},
					"buildOptions": {
						"env": {
							"secret_key": {
								"type": "secret",
								"secret": "secret",
								"key": "key"
							},
							"user_input": {
								"type": "userInput",
								"label": "label",
								"default": "value",
								"fieldMsg": "message"
							},
							"SOAJS_ENV": {
								"type": "computed",
								"value": "$SOAJS_ENV"
							},
							"test_env": {
								"type": "static",
								"value": "test_value"
							}
						},
						"cmd":
							{
								"deploy":
									{
										"command": ["bash"],
										"args": ["-c", "node ."]
									}
							}
					}
				}
			}
		};
		BL.add(soajs, inputmaskData, {}, (error) => {
			assert.ok(error);
			assert.deepStrictEqual(error.code, 431);
			done();
		});
	});
	it("add - error invalid ports", function (done) {
		BL.modelObj = {
			addItem: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			}
		};
		let inputmaskData = {
			"catalog": {
				"name": "test recipe",
				"locked": true,
				"type": "api",
				"subtype": "test",
				"description": "description recipe",
				"recipe": {
					"deployOptions": {
						"image": {
							"prefix": "soajsorg",
							"name": "image",
							"tag": "latest",
							"pullPolicy": "Always",
							"repositoryType": "public",
							"override": false,
							"shell": "/bin/bash",
							"binary": false
						},
						"sourceCode": {
							"configuration": {
								"label": "repo",
								"catalog": "",
								"version": "",
								"branch": "",
								"required": false
							}
						},
						"readinessProbe": {
							"httpGet": {
								"path": "/heartbeat",
								"port": "maintenance"
							},
							"initialDelaySeconds": 1,
							"timeoutSeconds": 2,
							"periodSeconds": 2,
							"successThreshold": 3,
							"failureThreshold": 0
						},
						"livenessProbe": {
						
						},
						"ports": [{
							"name": "http",
							"target": 80,
							"isPublished": true,
							"published": 31342,
							"preserveClientIP": true
						},
							{
								"name": "http",
								"target": 80,
								"isPublished": true,
								"preserveClientIP": true
							}],
						"voluming": [{
							"docker": {},
							"kubernetes": {
								"volume": {"name": "soajsprofile", "secret": {"secretName": "soajsprofile"}},
								"volumeMount": {"mountPath": "/opt/soajs/profile/", "name": "soajsprofile"}
							}
						}],
						"restartPolicy": {"condition": "", "maxAttempts": 5},
						"container": {"network": "", "workingDir": ""},
						"labels": {"test": "label"},
						"execCommands": {"list": "ls -la"}
					},
					"buildOptions": {
						"env": {
							"secret_key": {
								"type": "secret",
								"secret": "secret",
								"key": "key"
							},
							"user_input": {
								"type": "userInput",
								"label": "label",
								"default": "value",
								"fieldMsg": "message"
							},
							"SOAJS_ENV": {
								"type": "computed",
								"value": "$SOAJS_ENV"
							},
							"test_env": {
								"type": "static",
								"value": "test_value"
							}
						},
						"cmd":
							{
								"deploy":
									{
										"command": ["bash"],
										"args": ["-c", "node ."]
									}
							}
					}
				}
			}
		};
		BL.add(soajs, inputmaskData, {}, (error) => {
			assert.ok(error);
			assert.deepStrictEqual(error.code, 432);
			done();
		});
	});
	
	it("edit - no inputmaskData", function (done) {
		BL.modelObj = {
			editItem: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			}
		};
		BL.edit(soajs, null, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 400);
			done();
		});
	});
	it("edit - success", function (done) {
		BL.modelObj = {
			editItem: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			},
			getItem_by_id: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			}
		};
		let inputmaskData = {
			"catalog": {
				"name": "test recipe",
				"locked": true,
				"type": "api",
				"subtype": "test",
				"description": "description recipe",
				"recipe": {
					"deployOptions": {
						"image": {
							"prefix": "soajsorg",
							"name": "image",
							"tag": "latest",
							"pullPolicy": "Always",
							"repositoryType": "public",
							"override": false,
							"shell": "/bin/bash",
							"binary": false
						},
						"sourceCode": {
							"configuration": {
								"label": "repo",
								"catalog": "",
								"version": "",
								"branch": "",
								"required": false
							}
						},
						"readinessProbe": {
							"httpGet": {
								"path": "/heartbeat",
								"port": "maintenance"
							},
							"initialDelaySeconds": 1,
							"timeoutSeconds": 2,
							"periodSeconds": 2,
							"successThreshold": 3,
							"failureThreshold": 0
						},
						"livenessProbe": {
							"httpGet": {"path": "", "port": ""},
							"initialDelaySeconds": 0,
							"timeoutSeconds": 0,
							"periodSeconds": 0,
							"successThreshold": 0,
							"failureThreshold": 0
						},
						"ports": [{
							"name": "http",
							"target": 80,
							"isPublished": true,
							"published": 31001,
							"preserveClientIP": true
						}],
						"voluming": [{
							"docker": {},
							"kubernetes": {
								"volume": {"name": "soajsprofile", "secret": {"secretName": "soajsprofile"}},
								"volumeMount": {"mountPath": "/opt/soajs/profile/", "name": "soajsprofile"}
							}
						}],
						"restartPolicy": {"condition": "", "maxAttempts": 5},
						"container": {"network": "", "workingDir": ""},
						"labels": {"test": "label"},
						"execCommands": {"list": "ls -la"}
					},
					"buildOptions": {
						"env": {
							"secret_key": {
								"type": "secret",
								"secret": "secret",
								"key": "key"
							},
							"user_input": {
								"type": "userInput",
								"label": "label",
								"default": "value",
								"fieldMsg": "message"
							},
							"SOAJS_ENV": {
								"type": "computed",
								"value": "$SOAJS_ENV"
							},
							"test_env": {
								"type": "static",
								"value": "test_value"
							}
						},
						"cmd":
							{
								"deploy":
									{
										"command": ["bash"],
										"args": ["-c", "node ."]
									}
							}
					}
				}
			},
			"id": "132"
		};
		BL.edit(soajs, inputmaskData, {}, (error, response) => {
			assert.ifError(error);
			assert.deepStrictEqual(response, "Catalog Recipe Successfully updated!");
			done();
		});
	});
	it("edit - error sourceCode", function (done) {
		BL.modelObj = {
			editItem: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			},
			getItem_by_id: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			}
		};
		let inputmaskData = {
			"catalog": {
				"name": "test recipe",
				"locked": true,
				"type": "api",
				"subtype": "test",
				"description": "description recipe",
				"recipe": {
					"deployOptions": {
						"image": {
							"prefix": "soajsorg",
							"name": "image",
							"tag": "latest",
							"pullPolicy": "Always",
							"repositoryType": "public",
							"override": false,
							"shell": "/bin/bash",
							"binary": false
						},
						"sourceCode": {
							"configuration": {
								"label": "repo",
								"catalog": "repo",
								"required": false
							}
						},
						"readinessProbe": {
							"httpGet": {
								"path": "/heartbeat",
								"port": "maintenance"
							},
							"initialDelaySeconds": 1,
							"timeoutSeconds": 2,
							"periodSeconds": 2,
							"successThreshold": 3,
							"failureThreshold": 0
						},
						"livenessProbe": {
							"httpGet": {"path": "", "port": ""},
							"initialDelaySeconds": 0,
							"timeoutSeconds": 0,
							"periodSeconds": 0,
							"successThreshold": 0,
							"failureThreshold": 0
						},
						"ports": [{
							"name": "http",
							"target": 80,
							"isPublished": true,
							"published": 31001,
							"preserveClientIP": true
						}],
						"voluming": [{
							"docker": {},
							"kubernetes": {
								"volume": {"name": "soajsprofile", "secret": {"secretName": "soajsprofile"}},
								"volumeMount": {"mountPath": "/opt/soajs/profile/", "name": "soajsprofile"}
							}
						}],
						"restartPolicy": {"condition": "", "maxAttempts": 5},
						"container": {"network": "", "workingDir": ""},
						"labels": {"test": "label"},
						"execCommands": {"list": "ls -la"}
					},
					"buildOptions": {
						"env": {
							"secret_key": {
								"type": "secret",
								"secret": "secret",
								"key": "key"
							},
							"user_input": {
								"type": "userInput",
								"label": "label",
								"default": "value",
								"fieldMsg": "message"
							},
							"SOAJS_ENV": {
								"type": "computed",
								"value": "$SOAJS_ENV"
							},
							"test_env": {
								"type": "static",
								"value": "test_value"
							}
						},
						"cmd":
							{
								"deploy":
									{
										"command": ["bash"],
										"args": ["-c", "node ."]
									}
							}
					}
				}
			},
			"id": "132"
		};
		BL.edit(soajs, inputmaskData, {}, (error) => {
			assert.ok(error);
			assert.deepStrictEqual(error.code, 430);
			done();
		});
	});
	it("edit - error locked", function (done) {
		BL.modelObj = {
			editItem: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			},
			getItem_by_id: (data, cb) => {
				return cb(null, {
					_id: "123",
					"locked": true,
				});
			}
		};
		let inputmaskData = {
			"catalog": {
				"name": "test recipe",
				"locked": true,
				"type": "api",
				"subtype": "test",
				"description": "description recipe",
				"recipe": {
					"deployOptions": {
						"image": {
							"prefix": "soajsorg",
							"name": "image",
							"tag": "latest",
							"pullPolicy": "Always",
							"repositoryType": "public",
							"override": false,
							"shell": "/bin/bash",
							"binary": false
						},
						"readinessProbe": {
							"httpGet": {
								"path": "/heartbeat",
								"port": "maintenance"
							},
							"initialDelaySeconds": 1,
							"timeoutSeconds": 2,
							"periodSeconds": 2,
							"successThreshold": 3,
							"failureThreshold": 0
						},
						"livenessProbe": {
							"httpGet": {"path": "", "port": ""},
							"initialDelaySeconds": 0,
							"timeoutSeconds": 0,
							"periodSeconds": 0,
							"successThreshold": 0,
							"failureThreshold": 0
						},
						"ports": [{
							"name": "http",
							"target": 80,
							"isPublished": true,
							"published": 31001,
							"preserveClientIP": true
						}],
						"voluming": [{
							"docker": {},
							"kubernetes": {
								"volume": {"name": "soajsprofile", "secret": {"secretName": "soajsprofile"}},
								"volumeMount": {"mountPath": "/opt/soajs/profile/", "name": "soajsprofile"}
							}
						}],
						"restartPolicy": {"condition": "", "maxAttempts": 5},
						"container": {"network": "", "workingDir": ""},
						"labels": {"test": "label"},
						"execCommands": {"list": "ls -la"}
					},
					"buildOptions": {
						"env": {
							"secret_key": {
								"type": "secret",
								"secret": "secret",
								"key": "key"
							},
							"user_input": {
								"type": "userInput",
								"label": "label",
								"default": "value",
								"fieldMsg": "message"
							},
							"SOAJS_ENV": {
								"type": "computed",
								"value": "$SOAJS_ENV"
							},
							"test_env": {
								"type": "static",
								"value": "test_value"
							}
						},
						"cmd":
							{
								"deploy":
									{
										"command": ["bash"],
										"args": ["-c", "node ."]
									}
							}
					}
				}
			},
			"id": "132"
		};
		BL.edit(soajs, inputmaskData, {}, (error) => {
			assert.ok(error);
			assert.deepStrictEqual(error.code, 434);
			done();
		});
	});
	it("edit - error model getItem_by_id", function (done) {
		BL.modelObj = {
			editItem: (data, cb) => {
				return cb(new Error("dummy"));
			},
			getItem_by_id: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			}
		};
		let inputmaskData = {
			"catalog": {
				"name": "test recipe",
				"locked": true,
				"type": "api",
				"subtype": "test",
				"description": "description recipe",
				"recipe": {
					"deployOptions": {
						"image": {
							"prefix": "soajsorg",
							"name": "image",
							"tag": "latest",
							"pullPolicy": "Always",
							"repositoryType": "public",
							"override": false,
							"shell": "/bin/bash",
							"binary": false
						},
						"readinessProbe": {
							"httpGet": {
								"path": "/heartbeat",
								"port": "maintenance"
							},
							"initialDelaySeconds": 1,
							"timeoutSeconds": 2,
							"periodSeconds": 2,
							"successThreshold": 3,
							"failureThreshold": 0
						},
						"livenessProbe": {
							"httpGet": {"path": "", "port": ""},
							"initialDelaySeconds": 0,
							"timeoutSeconds": 0,
							"periodSeconds": 0,
							"successThreshold": 0,
							"failureThreshold": 0
						},
						"ports": [{
							"name": "http",
							"target": 80,
							"isPublished": true,
							"published": 31001,
							"preserveClientIP": true
						}],
						"voluming": [{
							"docker": {},
							"kubernetes": {
								"volume": {"name": "soajsprofile", "secret": {"secretName": "soajsprofile"}},
								"volumeMount": {"mountPath": "/opt/soajs/profile/", "name": "soajsprofile"}
							}
						}],
						"restartPolicy": {"condition": "", "maxAttempts": 5},
						"container": {"network": "", "workingDir": ""},
						"execCommands": {"list": "ls -la"}
					},
					"buildOptions": {
						"env": {
							"secret_key": {
								"type": "secret",
								"secret": "secret",
								"key": "key"
							},
							"user_input": {
								"type": "userInput",
								"label": "label",
								"default": "value",
								"fieldMsg": "message"
							},
							"SOAJS_ENV": {
								"type": "computed",
								"value": "$SOAJS_ENV"
							},
							"test_env": {
								"type": "static",
								"value": "test_value"
							}
						},
						"cmd":
							{
								"deploy":
									{
										"command": ["bash"],
										"args": ["-c", "node ."]
									}
							}
					}
				}
			},
			"id": "132"
		};
		BL.edit(soajs, inputmaskData, {}, (error) => {
			assert.ok(error);
			assert.deepStrictEqual(error.code, 602);
			done();
		});
	});
	it("edit - error model editItem", function (done) {
		BL.modelObj = {
			editItem: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			},
			getItem_by_id: (data, cb) => {
				return cb(new Error("dummy"));
			}
		};
		let inputmaskData = {
			"catalog": {
				"name": "test recipe",
				"locked": true,
				"type": "api",
				"subtype": "test",
				"description": "description recipe",
				"recipe": {
					"deployOptions": {
						"image": {
							"prefix": "soajsorg",
							"name": "image",
							"tag": "latest",
							"pullPolicy": "Always",
							"repositoryType": "public",
							"override": false,
							"shell": "/bin/bash",
							"binary": false
						},
						"readinessProbe": {
							"httpGet": {
								"path": "/heartbeat",
								"port": "maintenance"
							},
							"initialDelaySeconds": 1,
							"timeoutSeconds": 2,
							"periodSeconds": 2,
							"successThreshold": 3,
							"failureThreshold": 0
						},
						"livenessProbe": {
							"httpGet": {"path": "", "port": ""},
							"initialDelaySeconds": 0,
							"timeoutSeconds": 0,
							"periodSeconds": 0,
							"successThreshold": 0,
							"failureThreshold": 0
						},
						"ports": [{
							"name": "http",
							"target": 80,
							"isPublished": true,
							"published": 31001,
							"preserveClientIP": true
						}],
						"voluming": [{
							"docker": {},
							"kubernetes": {
								"volume": {"name": "soajsprofile", "secret": {"secretName": "soajsprofile"}},
								"volumeMount": {"mountPath": "/opt/soajs/profile/", "name": "soajsprofile"}
							}
						}],
						"restartPolicy": {"condition": "", "maxAttempts": 5},
						"container": {"network": "", "workingDir": ""},
						"execCommands": {"list": "ls -la"}
					},
					"buildOptions": {
						"env": {
							"secret_key": {
								"type": "secret",
								"secret": "secret",
								"key": "key"
							},
							"user_input": {
								"type": "userInput",
								"label": "label",
								"default": "value",
								"fieldMsg": "message"
							},
							"SOAJS_ENV": {
								"type": "computed",
								"value": "$SOAJS_ENV"
							},
							"test_env": {
								"type": "static",
								"value": "test_value"
							}
						},
						"cmd":
							{
								"deploy":
									{
										"command": ["bash"],
										"args": ["-c", "node ."]
									}
							}
					}
				}
			},
			"id": "132"
		};
		BL.edit(soajs, inputmaskData, {}, (error) => {
			assert.ok(error);
			assert.deepStrictEqual(error.code, 602);
			done();
		});
	});
	it("edit - error no item", function (done) {
		BL.modelObj = {
			editItem: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			},
			getItem_by_id: (data, cb) => {
				return cb(null, null);
			}
		};
		let inputmaskData = {
			"catalog": {
				"name": "test recipe",
				"locked": true,
				"type": "api",
				"subtype": "test",
				"description": "description recipe",
				"recipe": {
					"deployOptions": {
						"image": {
							"prefix": "soajsorg",
							"name": "image",
							"tag": "latest",
							"pullPolicy": "Always",
							"repositoryType": "public",
							"override": false,
							"shell": "/bin/bash",
							"binary": false
						},
						"readinessProbe": {
							"httpGet": {
								"path": "/heartbeat",
								"port": "maintenance"
							},
							"initialDelaySeconds": 1,
							"timeoutSeconds": 2,
							"periodSeconds": 2,
							"successThreshold": 3,
							"failureThreshold": 0
						},
						"livenessProbe": {
							"httpGet": {"path": "", "port": ""},
							"initialDelaySeconds": 0,
							"timeoutSeconds": 0,
							"periodSeconds": 0,
							"successThreshold": 0,
							"failureThreshold": 0
						},
						"ports": [{
							"name": "http",
							"target": 80,
							"isPublished": true,
							"published": 31001,
							"preserveClientIP": true
						}],
						"voluming": [{
							"docker": {},
							"kubernetes": {
								"volume": {"name": "soajsprofile", "secret": {"secretName": "soajsprofile"}},
								"volumeMount": {"mountPath": "/opt/soajs/profile/", "name": "soajsprofile"}
							}
						}],
						"restartPolicy": {"condition": "", "maxAttempts": 5},
						"container": {"network": "", "workingDir": ""},
						"labels": {"test": "label"},
						"execCommands": {"list": "ls -la"}
					},
					"buildOptions": {
						"env": {
							"secret_key": {
								"type": "secret",
								"secret": "secret",
								"key": "key"
							},
							"user_input": {
								"type": "userInput",
								"label": "label",
								"default": "value",
								"fieldMsg": "message"
							},
							"SOAJS_ENV": {
								"type": "computed",
								"value": "$SOAJS_ENV"
							},
							"test_env": {
								"type": "static",
								"value": "test_value"
							}
						},
						"cmd":
							{
								"deploy":
									{
										"command": ["bash"],
										"args": ["-c", "node ."]
									}
							}
					}
				}
			},
			"id": "132"
		};
		BL.edit(soajs, inputmaskData, {}, (error) => {
			assert.ok(error);
			assert.deepStrictEqual(error.code, 433);
			done();
		});
	});
	
});
