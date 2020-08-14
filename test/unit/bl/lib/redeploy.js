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
const lib_redeploy = helper.requireModule('./bl/lib/redeploy.js');

describe("Unit test for: BL - lib/redeploy", () => {
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
		lib_redeploy.localConfig = helper.requireModule("config.js");
		done();
	});
	
	afterEach((done) => {
		bl.marketplace.mp = null;
		nock.cleanAll();
		done();
	});
	
	it("redeploy - fail no inputmaskData", function (done) {
		lib_redeploy.redeploy(soajs, null, {}, bl, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 400);
			done();
		});
	});
	
	it("redeploy - fail get_item mongo error", function (done) {
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
		lib_redeploy.redeploy(soajs, inputmaskData, {}, bl, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 602);
			done();
		});
	});
	
	it("redeploy - fail item not found", function (done) {
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
		lib_redeploy.redeploy(soajs, inputmaskData, {}, bl, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 501);
			done();
		});
	});
	
	it("redeploy - fail item not in whitelist", function (done) {
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
			"env": "NEW",
			"image": {
				"tag": "test"
			},
			"src": {
				"from": {
					"branch": "master",
					"commit": "123"
				}
			},
		};
		lib_redeploy.redeploy(soajs, inputmaskData, {}, bl, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 406);
			done();
		});
	});
	
	it("redeploy - fail item in blacklist", function (done) {
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
			"env": "NEW",
			"image": {
				"tag": "test"
			},
			"src": {
				"from": {
					"branch": "master",
					"commit": "123"
				}
			},
		};
		lib_redeploy.redeploy(soajs, inputmaskData, {}, bl, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 406);
			done();
		});
	});
	
	it("redeploy - fail item in blacklist", function (done) {
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
			"env": "NEW",
			"image": {
				"tag": "test"
			},
			"src": {
				"from": {
					"branch": "master",
					"commit": "123"
				}
			},
		};
		lib_redeploy.redeploy(soajs, inputmaskData, {}, bl, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 406);
			done();
		});
	});
	
	it("redeploy - fail no deploy item", function (done) {
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
			"env": "NEW",
			"image": {
				"tag": "test"
			},
			"src": {
				"from": {
					"branch": "master",
					"commit": "123"
				}
			},
		};
		lib_redeploy.redeploy(soajs, inputmaskData, {}, bl, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 407);
			done();
		});
	});
	
	it("redeploy - fail no deploy item version", function (done) {
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
										version: "2"
									}
								]
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
			"env": "NEW",
			"image": {
				"tag": "test"
			},
			"src": {
				"from": {
					"branch": "master",
					"commit": "123"
				}
			},
		};
		lib_redeploy.redeploy(soajs, inputmaskData, {}, bl, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 410);
			done();
		});
	});
	
	it("redeploy - fail get_deploy connection", function (done) {
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
										version: "1"
									}
								]
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
			"env": "NEW",
			"image": {
				"tag": "test"
			},
			"src": {
				"from": {
					"branch": "master",
					"commit": "123"
				}
			},
		};
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
					return cb(null);
				}
			}
		};
		lib_redeploy.redeploy(soajs, inputmaskData, {}, bl, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 421);
			done();
		});
	});
	
	it("redeploy - fail get_deploy no item", function (done) {
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
										version: "1"
									}
								]
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
			"env": "NEW",
			"image": {
				"tag": "test"
			},
			"src": {
				"from": {
					"branch": "master",
					"commit": "123"
				}
			},
		};
		nock('http://www.example.com')
			.get('/kubernetes/item/inspect')
			.query({
				configuration: {
					env: inputmaskData.env
				},
				item: {
					name: inputmaskData.name,
					env: inputmaskData.env,
					version: inputmaskData.version,
				}
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
		lib_redeploy.redeploy(soajs, inputmaskData, {}, bl, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 503);
			done();
		});
	});
	
	it("redeploy - fail get_deploy item not found", function (done) {
		let item = {
			"_id": "123",
			"name": "marketplace",
			"settings": {
				"environments": {
					"value": ["NEW"],
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
		let inputmaskData = {
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"env": "NEW",
			"image": {
				"tag": "test"
			},
			"src": {
				"from": {
					"branch": "master",
					"commit": "123"
				}
			},
		};
		nock('http://www.example.com')
			.get('/kubernetes/item/inspect')
			.query({
				configuration: {
					env: inputmaskData.env
				},
				item: {
					name: inputmaskData.name,
					env: inputmaskData.env,
					version: inputmaskData.version,
				}
			})
			.reply(200, {
				"result": true,
				"data": {
					"deployments": {
						items: []
					}
				}
			});
		lib_redeploy.redeploy(soajs, inputmaskData, {}, bl, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 413);
			done();
		});
	});
	
	it("redeploy - fail get_deploy", function (done) {
		let item = {
			"_id": "123",
			"name": "marketplace",
			"settings": {
				"environments": {
					"value": ["NEW"],
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
						"src": {
							"branch": "master",
							"commit": "123"
						},
						settings: {
							memory: "0",
							mode: "Deployment"
						},
						cd: {
							strategy: "notify"
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
					},
					update_item_configuration: (data, cb) => {
						return cb(new Error("Error!"), true);
					}
				};
			}
		};
		let inputmaskData = {
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"env": "NEW",
			"image": {
				"tag": "test"
			},
			"src": {
				"from": {
					"branch": "master",
					"commit": "123"
				}
			},
		};
		nock('http://www.example.com')
			.get('/kubernetes/item/inspect')
			.query({
				configuration: {
					env: inputmaskData.env
				},
				item: {
					name: inputmaskData.name,
					env: inputmaskData.env,
					version: inputmaskData.version,
				}
			})
			.reply(200, {
				"result": true,
				"data": {
					"deployments": {
						items: [{
							"metadata": {}
						}]
					}
				}
			});
		lib_redeploy.redeploy(soajs, inputmaskData, {}, bl, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 602);
			done();
		});
	});
	
	it("redeploy - fail update_item_configuration", function (done) {
		let item = {
			"_id": "123",
			"name": "marketplace",
			"settings": {
				"environments": {
					"value": ["NEW"],
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
						"src": {
							"branch": "master",
							"commit": "123"
						},
						settings: {
							memory: "0",
							mode: "Deployment"
						},
						cd: {
							strategy: "notify"
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
					},
					update_item_configuration: (data, cb) => {
						return cb(new Error("Error!"), true);
					}
				};
			}
		};
		let inputmaskData = {
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"env": "NEW",
			"image": {
				"tag": "test"
			},
			"src": {
				"from": {
					"branch": "master",
					"commit": "123"
				}
			},
		};
		nock('http://www.example.com')
			.get('/kubernetes/item/inspect')
			.query({
				configuration: {
					env: inputmaskData.env
				},
				item: {
					name: inputmaskData.name,
					env: inputmaskData.env,
					version: inputmaskData.version,
				}
			})
			.reply(200, {
				"result": true,
				"data": {
					"deployments": {
						items: [{
							"metadata": {}
						}]
					}
				}
			});
		lib_redeploy.redeploy(soajs, inputmaskData, {}, bl, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 602);
			done();
		});
	});
	
	it("redeploy - fail item with src but binary deployment", function (done) {
		let item = {
			"_id": "123",
			"name": "marketplace",
			"settings": {
				"environments": {
					"value": ["NEW"],
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
					},
					update_item_configuration: (data, cb) => {
						return cb(null, true);
					}
				};
			}
		};
		let inputmaskData = {
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"env": "NEW",
			"image": {
				"tag": "test"
			},
			"src": {
				"from": {
					"branch": "master",
					"commit": "123"
				}
			},
		};
		nock('http://www.example.com')
			.get('/kubernetes/item/inspect')
			.query({
				configuration: {
					env: inputmaskData.env
				},
				item: {
					name: inputmaskData.name,
					env: inputmaskData.env,
					version: inputmaskData.version,
				}
			})
			.reply(200, {
				"result": true,
				"data": {
					"deployments": {
						items: [{
							"metadata": {}
						}]
					}
				}
			});
		lib_redeploy.redeploy(soajs, inputmaskData, {}, bl, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 423);
			done();
		});
	});
	
	it("redeploy - fail to deploy", function (done) {
		let item = {
			"_id": "123",
			"name": "marketplace",
			"settings": {
				"environments": {
					"value": ["NEW"],
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
					},
					update_item_configuration: (data, cb) => {
						return cb(null, true);
					}
				};
			}
		};
		let inputmaskData = {
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"env": "NEW",
			"image": {
				"tag": "test"
			},
			"src": {
				"from": {
					"tag": "1"
				}
			},
		};
		nock('http://www.example.com')
			.get('/kubernetes/item/inspect')
			.query({
				configuration: {
					env: inputmaskData.env
				},
				item: {
					name: inputmaskData.name,
					env: inputmaskData.env,
					version: inputmaskData.version,
				}
			})
			.reply(200, {
				"result": true,
				"data": {
					"deployments": {
						items: [{
							"metadata": {}
						}]
					}
				}
			});
		lib_redeploy.redeploy(soajs, inputmaskData, {}, bl, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 503);
			done();
		});
	});
	
	it("redeploy - deploy item", function (done) {
		let item = {
			"_id": "123",
			"name": "marketplace",
			"settings": {
				"environments": {
					"value": ["NEW"],
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
					},
					update_item_configuration: (data, cb) => {
						return cb(null, true);
					}
				};
			}
		};
		let inputmaskData = {
			"name": "marketplace",
			"type": "service",
			"version": "1",
			"env": "NEW",
			"image": {
				"tag": "test"
			},
			"src": {
				"from": {
					"tag": "1"
				}
			},
		};
		nock('http://www.example.com')
			.get('/kubernetes/item/inspect')
			.query({
				configuration: {
					env: inputmaskData.env
				},
				item: {
					name: inputmaskData.name,
					env: inputmaskData.env,
					version: inputmaskData.version,
				}
			})
			.reply(200, {
				"result": true,
				"data": {
					"deployments": {
						items: [{
							"metadata": {}
						}]
					}
				}
			});
		nock('http://www.example.com')
			.put('/kubernetes/item/redeploy')
			.query({
				configuration: {
					env: inputmaskData.env
				}
			})
			.reply(200, {
				"result": true,
				"data": true
			});
		lib_redeploy.redeploy(soajs, inputmaskData, {}, bl, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response, "Item Successfully Redeployed!");
			done();
		});
	});
});