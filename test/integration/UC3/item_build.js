"use strict";

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const assert = require('assert');
const requester = require('../requester');

let consoleserver = require('./console-service-mock.js');
let infraserver = require('./infra-service-mock.js');
let multiserver = require('./multi-service-mock.js');
let reposerver = require('./repositroies-service-mock.js');

let recipe = require('../post/data/recipe');


describe("Testing API: PUT /item/deploy/build", () => {
	
	before(function (done) {
		consoleserver.runService(() => {
			console.log("Starting console ...");
			infraserver.runService(() => {
				console.log("Starting infra ...");
				multiserver.runService(() => {
					console.log("Starting multitenant ...");
					reposerver.runService(() => {
						console.log("Starting repositories ...");
						setTimeout(function () {
							done();
						}, 5000);
					});
				});
			});
		});
	});
	
	afterEach((done) => {
		console.log("=======================================");
		done();
	});
	
	after((done) => {
		consoleserver.stopService(() => {
			infraserver.stopService(() => {
				multiserver.stopService(() => {
					reposerver.stopService(() => {
						done();
					});
				});
			});
		});
	});
	let recipe_id;
	it("Success - will add a service", (done) => {
		let data = {
			"body": {
				"item": {
					"src": {
						"provider": "github",
						"owner": "ragheb",
						"repo": "soajs.deploy",
						"branch": "master"
					},
					"soa": {
						"name": "deploy",
						"group": "deployItemsExample",
						"port": 6981,
						"version": "1",
						"description": "description is description",
						"extKeyRequired": true,
						"oauth": false,
						"urac": true,
						"urac_Profile": false,
						"requestTimeout": 30,
						"requestTimeoutRenewal": 5,
						"urac_ACL": false,
						"provision_ACL": false,
						"type": "service",
						"prerequisites": {
							"cpu": " ",
							"memory": " "
						},
						"documentation": {
							"readme": "README.md",
							"release": "RELEASE.md"
						},
						"swaggerFilename": "swagger.json",
						"maintenance": {
							"port": {
								"type": "inherit"
							},
							"readiness": "/heartbeat"
						}
					},
					"apiList": {
						"type": "swagger",
						"schema": {
							"swagger": "2.0",
							"info": {
								"version": "1123",
								"title": "deploy"
							},
							"host": "",
							"basePath": "/deploy",
							"tags": [
								{
									"name": "deploy"
								}
							],
							"paths": {
								"/v1/domain": {
									"post": {
										"tags": [
											"calendar"
										],
										"summary": "",
										"description": "Creates a domain",
										"operationId": "createDomain",
										"produces": [
											"application/json"
										],
										"parameters": [
											{
												"in": "body",
												"name": "body",
												"description": "Domain to be added",
												"required": false,
												"schema": {
													"$ref": "#/definitions/Create Domain Message"
												}
											}
										],
										"responses": {
											"200": {
												"description": "OK"
											}
										}
									}
								},
							},
							"definitions": {
								"Create Domain Message": {
									"type": "object",
									"required": [
										"domain"
									],
									"properties": {
										"domain": {
											"type": "string",
											"description": "Domain name"
										}
									},
									"description": "Event definition for schedule creation"
								},
							}
						},
					},
					"documentation": {
						"release": "Release: V1",
						"readme": "# soajs.test Test Express Service for Patch, Head, and others"
					}
				}
			}
		};
		requester('/item/service', 'put', data, (error, body) => {
			assert.ok(body);
			assert.ok(body.result);
			done();
		});
	});
	
	it("Success - will verify service", (done) => {
		let data = {
			"qs": {
				"name": "deploy",
				"type": "service"
			}
		};
		requester('/item/type', 'get', data, (error, body) => {
			assert.ok(body);
			assert.ok(body.result);
			delete body.data._id;
			delete body.data.versions[0].lastSync.ts;
			assert.deepEqual(body.data, {
				"name": "deploy",
				"type": "service",
				"configuration": {
					"port": 6981,
					"group": "deployItemsExample",
					"requestTimeout": 30,
					"requestTimeoutRenewal": 5,
					"swagger": true
				},
				"description": "description is description",
				"metadata": {},
				"src": {
					"provider": "github",
					"owner": "ragheb",
					"repo": "soajs.deploy"
				},
				"versions": [
					{
						"version": "1",
						"lastSync": {
							"branch": "master"
						},
						"soa": "{\"name\":\"deploy\",\"group\":\"deployItemsExample\",\"port\":6981,\"version\":\"1\",\"description\":\"description is description\",\"extKeyRequired\":true,\"oauth\":false,\"urac\":true,\"urac_Profile\":false,\"requestTimeout\":30,\"requestTimeoutRenewal\":5,\"urac_ACL\":false,\"provision_ACL\":false,\"type\":\"service\",\"prerequisites\":{\"cpu\":\" \",\"memory\":\" \"},\"documentation\":{\"readme\":\"README.md\",\"release\":\"RELEASE.md\"},\"swaggerFilename\":\"swagger.json\",\"maintenance\":{\"port\":{\"type\":\"inherit\"},\"readiness\":\"/heartbeat\"}}",
						"apis": [
							{
								"l": "Creates a domain",
								"v": "/v1/domain",
								"m": "post",
								"group": "calendar"
							}
						],
						"extKeyRequired": true,
						"oauth": false,
						"provision_ACL": false,
						"tenant_Profile": false,
						"urac": true,
						"urac_ACL": false,
						"urac_Config": false,
						"urac_GroupConfig": false,
						"urac_Profile": false,
						"branches": [
							"master"
						],
						"documentation": {
							"readme": "# soajs.test Test Express Service for Patch, Head, and others",
							"release": "Release: V1"
						},
						"maintenance": {
							"port": {
								"type": "inherit"
							},
							"readiness": "/heartbeat"
						},
						"swagger": "{\"swagger\":\"2.0\",\"info\":{\"version\":\"1123\",\"title\":\"deploy\"},\"host\":\"\",\"basePath\":\"/deploy\",\"tags\":[{\"name\":\"deploy\"}],\"paths\":{\"/v1/domain\":{\"post\":{\"tags\":[\"calendar\"],\"summary\":\"Creates a domain\",\"description\":\"Creates a domain\",\"operationId\":\"createDomain\",\"produces\":[\"application/json\"],\"parameters\":[{\"in\":\"body\",\"name\":\"body\",\"description\":\"Domain to be added\",\"required\":false,\"schema\":{\"$ref\":\"#/definitions/Create Domain Message\"}}],\"responses\":{\"200\":{\"description\":\"OK\"}}}}},\"definitions\":{\"Create Domain Message\":{\"type\":\"object\",\"required\":[\"domain\"],\"properties\":{\"domain\":{\"type\":\"string\",\"description\":\"Domain name\"}},\"description\":\"Event definition for schedule creation\"}}}"
					}
				]
			});
			done();
		});
	});
	
	it("Success - will add a config", (done) => {
		let data = {
			"body": {
				"item": {
					"src": {
						"provider": "github",
						"owner": "ragheb",
						"repo": "soajs.configuration",
						"branch": "master"
					},
					"soa": {
						"name": "config-deploy",
						"group": "deployItemsExample",
						"version": "1",
						"description": "description is description",
						"type": "config",
					}
				}
			}
		};
		requester('/item/config', 'put', data, (error, body) => {
			assert.ok(body);
			assert.ok(body.result);
			done();
		});
	});
	
	it("Success - will add a recipe", (done) => {
		let data = {
			"body": recipe[0]
		};
		requester('/recipe', 'post', data, (error, body) => {
			assert.ok(body);
			assert.ok(body.result);
			recipe_id = body.data.id;
			done();
		});
	});
	
	it("Success - will build a service", (done) => {
		let data = {
			"qs": {
				"name": "deploy",
				"type": "service",
			},
			"body": {
				"config": {
					"env": "new",
					"version": "1",
					"cd": {
						"strategy": "notify"
					},
					"settings": {
						"memory": "10Mi",
						"mode": "Deployment",
						"replicas": 1
					},
					"src": {
						"from": {
							"branch": "master",
							"commit": "123"
						},
						"id": "12"
					},
					"recipe": {
						"id": recipe_id,
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
						"image": {
							"prefix": "soajsorg",
							"name": "image",
							"tag": "latest",
						},
						"livenessProbe": {
							"httpGet": {"path": "", "port": ""},
							"initialDelaySeconds": 0,
							"timeoutSeconds": 0,
							"periodSeconds": 0,
							"successThreshold": 0,
							"failureThreshold": 0
						},
						"sourceCode": {
							"label": "test",
							"catalog": "config-deploy",
							"id": "98023",
							"version": "1",
							"branch": "master",
							"commit": "12345",
						},
						"env": {
							"secret_key": {
								"name": "secret name",
								"key": "secret name"
							},
							"user_input": "test data"
						},
					}
				}
			}
		};
		requester('/item/deploy/build', 'put', data, (error, body) => {
			console.log(body.errors)
			assert.ok(body);
			assert.ok(body.result);
			done();
		});
	});
	
	it("Success - will redeploy a service", (done) => {
		let data = {
			"qs": {
				"name": "deploy",
				"type": "service",
				"env": "new",
				"version": "1"
			},
			"body": {
				"src": {
					"from": {
						"branch": "master",
						"commit": "newcommit"
					}
				}
			}
		};
		requester('/item/deploy/redeploy', 'put', data, (error, body) => {
			assert.ok(body);
			assert.ok(body.result);
			done();
		});
	});
	
	it("Success - will redeploy a service", (done) => {
		let data = {
			"qs": {
				"name": "deploy",
				"type": "service",
				"env": "new",
				"version": "1"
			},
			"body": {
				"src": {
					"from": {
						"branch": "master",
						"commit": "newcommit"
					}
				}
			}
		};
		requester('/item/deploy/redeploy', 'put', data, (error, body) => {
			assert.ok(body);
			assert.ok(body.result);
			done();
		});
	});
	
	it("Success -initiate CD on a service", (done) => {
		let data = {
			"qs": {
				"name": "deploy",
				"type": "service",
				"version": "1",
				"token": "12312312"
			},
			"body": {
				"config": {
					"from": {
						"branch": "master",
						"commit": "newcommit"
					}
				}
			}
		};
		requester('/item/deploy/cd', 'put', data, (error, body) => {
			assert.ok(body);
			assert.ok(body.result);
			done();
		});
	});
	
});