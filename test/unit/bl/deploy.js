"use strict";

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const helper = require("../../helper.js");
const assert = require('assert');
const nock = require("nock");
const sinon = require('sinon');
const lib_deploy = helper.requireModule('./bl/lib/deploy.js');
const lib_redeploy = helper.requireModule('./bl/lib/redeploy.js');
const lib_cd = helper.requireModule('./bl/lib/cd.js');

describe("Unit test for: bl/deploy.js - marketplace", function () {
	let soajs = {
		awareness: {
			connect: (service, version, cb) => {
				return cb({
					headers: {},
					host: "192.168.5.200"
				});
			}
		},
		log: {
			error: (error) => {
				console.log(error);
			}
		},
		"urac": {
			"groups": ["owner"]
		}
	};
	before((done) => {
		done();
	});
	
	afterEach((done) => {
		sinon.restore();
		done();
	});
	
	it("call redeploy", function (done) {
		sinon.stub(lib_redeploy, 'redeploy').callsFake(function fakeFn(soajs, inputmaskData, options, bl, cb) {
			return cb(null);
		});
		let BL = {};
		let bl = helper.requireModule('bl/deploy.js')(BL);
		let options = {};
		
		bl.redeploy(soajs, null, options, () => {
			done();
		});
	});
	
	it("call cd", function (done) {
		sinon.stub(lib_cd, 'cd').callsFake(function fakeFn(soajs, inputmaskData, options, bl, local, cb) {
			return cb(null);
		});
		let BL = {};
		let bl = helper.requireModule('bl/deploy.js')(BL);
		BL.localConfig = helper.requireModule("config.js");
		let options = {};
		bl.cd(soajs, null, options, () => {
			done();
		});
	});
	
	it("call deploy", function (done) {
		sinon.stub(lib_deploy, 'deploy').callsFake(function fakeFn(soajs, inputmaskData, options, bl, cb) {
			return cb(null);
		});
		let BL = {};
		let bl = helper.requireModule('bl/deploy.js')(BL);
		BL.localConfig = helper.requireModule("config.js");
		let options = {};
		bl.deploy(soajs, null, options, () => {
			done();
		});
	});
	
	it("call saveConfigurationAndDeploy - fail", function (done) {
		let BL = {
			"marketplace": {
				"handleError": (soajs, error) => {
					return new Error(error);
				}
			}
		};
		let bl = helper.requireModule('bl/deploy.js')(BL);
		BL.localConfig = helper.requireModule("config.js");
		let options = {};
		bl.saveConfigurationAndDeploy(soajs, null, options, (err) => {
			assert.ok(err);
			assert.deepEqual(err.message, "400");
			done();
		});
	});
	
	it("call saveConfigurationAndDeploy - fail no item", function (done) {
		let BL = {
			"marketplace": {
				"handleError": (soajs, error) => {
					return new Error(error);
				},
				"mp": {
					"getModel": () => {
						return {
							getItem: (inputmaskData, cb) => {
								return cb(null);
							}
						};
					}
				}
			}
		};
		let bl = helper.requireModule('bl/deploy.js')(BL);
		BL.localConfig = helper.requireModule("config.js");
		let options = {};
		bl.saveConfigurationAndDeploy(soajs, {}, options, (err) => {
			assert.ok(err);
			assert.deepEqual(err.message, "501");
			done();
		});
	});
	
	it("call saveConfiguration - fail", function (done) {
		let BL = {
			"marketplace": {
				"handleError": (soajs, error) => {
					return new Error(error);
				}
			}
		};
		let bl = helper.requireModule('bl/deploy.js')(BL);
		BL.localConfig = helper.requireModule("config.js");
		let options = {};
		bl.saveConfiguration(soajs, null, options, (err) => {
			assert.ok(err);
			assert.deepEqual(err.message, "400");
			done();
		});
	});
	
	it("call saveConfiguration - fail mongo", function (done) {
		let BL = {
			"marketplace": {
				"handleError": (soajs, error) => {
					return new Error(error);
				},
				"mp": {
					"getModel": () => {
						return {
							getItem: (inputmaskData, cb) => {
								return cb(new Error("mongo error"));
							}
						};
					}
				}
			}
		};
		let bl = helper.requireModule('bl/deploy.js')(BL);
		BL.localConfig = helper.requireModule("config.js");
		let options = {};
		bl.saveConfiguration(soajs, {}, options, (err) => {
			assert.ok(err);
			assert.deepEqual(err.message, "602");
			done();
		});
	});
	
	it("call saveConfigurationAndDeploy - success", function (done) {
		sinon.stub(lib_deploy, 'deploy').callsFake(function fakeFn(soajs, inputmaskData, options, bl, cb) {
			return cb(null, "true");
		});
		let BL = {
			"marketplace": {
				"handleError": () => {
					return null;
				},
				"mp": {
					"getModel": () => {
						return {
							getItem: (inputmaskData, cb) => {
								return cb(null, {
									"_id": "123"
								});
							},
							update_item_configuration: (opts, cb) => {
								return cb(null);
							}
						};
					}
				}
			}
		};
		nock('http://192.168.5.200')
			.get('/catalog/recipes/get')
			.query({
				id: "1234567890"
			})
			.reply(200, {
				"result": true,
				"data": {
					"recipe": {
						"buildOptions": {
							"env": {
								"SECRET_ENV": {
									"type": "secret"
								},
								"USER_ENV": {
									"type": "userInput"
								}
							}
						}
					}
				}
			});
		let bl = helper.requireModule('bl/deploy.js')(BL);
		BL.localConfig = helper.requireModule("config.js");
		let options = {};
		let inputmaskData = {
			"_id": "123",
			"name": "marketplace",
			"type": "service",
			"config": {
				"env": "new",
				"version": "1",
				"cd": {
					"strategy": "notify"
				},
				"settings": {
					"memory": "10Mi",
					"mode": "deployment",
					"replicas": 1
				},
				"src": {
					"from": {
						"branch": "master",
						"commit": "!@3"
					},
					"id": "12"
				},
				"recipe": {
					"id": "1234567890",
					"image": {
						"name": "test",
						"prefix": "soajs",
						"tag": "1.1"
					},
					"readinessProbe": {},
					"ports": {
						"type": "test",
						"portType": "Internal",
						"values": [{
							"name": "http",
							"target": 80
						}]
					},
					"env": {
						"SECRET_ENV": {
							"name": "secret name",
							"key": "secret name"
						},
						"USER_ENV": "test data"
					},
					"sourceCode": {
						"label": "test",
						"catalog": "test",
						"id": "test",
						"version": "test",
						"tag": "test",
					}
				}
			}
		};
		bl.saveConfigurationAndDeploy(soajs, inputmaskData, options, (err, response) => {
			assert.ifError(err);
			assert.deepEqual(response, "true");
			done();
		});
	});
	
	it("call saveConfiguration - success", function (done) {
		let BL = {
			"marketplace": {
				"handleError": () => {
					return null;
				},
				"mp": {
					"getModel": () => {
						return {
							getItem: (inputmaskData, cb) => {
								return cb(null, {
									"_id": "123"
								});
							},
							update_item_configuration: (opts, cb) => {
								return cb(null);
							}
						};
					}
				}
			}
		};
		nock('http://192.168.5.200')
			.get('/catalog/recipes/get')
			.query({
				id: "1234567890"
			})
			.reply(200, {
				"result": true,
				"data": {
					"recipe": {
						"buildOptions": {
							"env": {
								"SECRET_ENV": {
									"type": "secret"
								},
								"USER_ENV": {
									"type": "userInput"
								}
							}
						}
					}
				}
			});
		let bl = helper.requireModule('bl/deploy.js')(BL);
		BL.localConfig = helper.requireModule("config.js");
		let options = {};
		let inputmaskData = {
			"_id": "123",
			"name": "marketplace",
			"type": "service",
			"config": {
				"env": "new",
				"version": "1",
				"cd": {
					"strategy": "notify"
				},
				"settings": {
					"memory": "10Mi",
					"mode": "deployment",
					"replicas": 1
				},
				"src": {
					"from": {
						"branch": "master",
						"commit": "!@3"
					},
					"id": "12"
				},
				"recipe": {
					"id": "1234567890",
					"image": {
						"name": "test",
						"prefix": "soajs",
						"tag": "1.1"
					},
					"readinessProbe": {},
					"ports": {
						"type": "test",
						"portType": "Internal",
						"values": [{
							"name": "http",
							"target": 80
						}]
					},
					"env": {
						"SECRET_ENV": {
							"name": "secret name",
							"key": "secret name"
						},
						"USER_ENV": "test data"
					},
					"sourceCode": {
						"label": "test",
						"catalog": "test",
						"id": "test",
						"version": "test",
						"tag": "test",
					}
				}
			}
		};
		bl.saveConfiguration(soajs, inputmaskData, options, (err, response) => {
			assert.ifError(err);
			assert.deepEqual(response, "Catalog Item Configuration Successfully updated!");
			done();
		});
	});
	
	it("call saveConfiguration - fail error request", function (done) {
		let BL = {
			"marketplace": {
				"handleError": (soajs, errCode) => {
					return new Error(errCode);
				},
				"mp": {
					"getModel": () => {
						return {
							getItem: (inputmaskData, cb) => {
								return cb(null, {
									"_id": "123"
								});
							},
							update_item_configuration: (opts, cb) => {
								return cb(null);
							}
						};
					}
				}
			}
		};
		nock('http://192.168.5.200')
			.get('/catalog/recipes/get')
			.query({
				id: "1234567890"
			})
			.reply(200, {
				"result": false,
				"errors": "request error"
			});
		let bl = helper.requireModule('bl/deploy.js')(BL);
		BL.localConfig = helper.requireModule("config.js");
		let options = {};
		let inputmaskData = {
			"_id": "123",
			"name": "marketplace",
			"type": "service",
			"config": {
				"env": "new",
				"version": "1",
				"cd": {
					"strategy": "notify"
				},
				"settings": {
					"memory": "10Mi",
					"mode": "deployment",
					"replicas": 1
				},
				"src": {
					"from": {
						"branch": "master",
						"commit": "!@3"
					},
					"id": "12"
				},
				"recipe": {
					"id": "1234567890",
					"image": {
						"name": "test",
						"prefix": "soajs",
						"tag": "1.1"
					},
					"readinessProbe": {},
					"ports": {
						"type": "test",
						"portType": "Internal",
						"values": [{
							"name": "http",
							"target": 80
						}]
					},
					"env": {
						"SECRET_ENV": {
							"name": "secret name",
							"key": "secret name"
						},
						"USER_ENV": "test data"
					},
					"sourceCode": {
						"label": "test",
						"catalog": "test",
						"id": "test",
						"version": "test",
						"tag": "test",
					}
				}
			}
		};
		bl.saveConfiguration(soajs, inputmaskData, options, (err) => {
			assert.ok(err);
			assert.deepEqual(err.message, "request error");
			done();
		});
	});
	
	it("call saveConfiguration - success add image from recipe", function (done) {
		let BL = {
			"marketplace": {
				"handleError": () => {
					return null;
				},
				"mp": {
					"getModel": () => {
						return {
							getItem: (inputmaskData, cb) => {
								return cb(null, {
									"_id": "123",
									"environments": {
										"value": [],
										"type": "blacklist"
									}
								});
							},
							update_item_configuration: (opts, cb) => {
								return cb(null);
							}
						};
					}
				}
			}
		};
		nock('http://192.168.5.200')
			.get('/catalog/recipes/get')
			.query({
				id: "1234567890"
			})
			.reply(200, {
				"result": true,
				"data": {
					"recipe": {
						"buildOptions": {
							"env": {
								"SECRET_ENV": {
									"type": "secret"
								},
								"USER_ENV": {
									"type": "userInput"
								}
							}
						},
						"deployOptions": {
							"image": {
								"name": "test",
								"prefix": "soajs",
								"tag": "1.1"
							},
						}
					}
				}
			});
		let bl = helper.requireModule('bl/deploy.js')(BL);
		BL.localConfig = helper.requireModule("config.js");
		let options = {};
		let inputmaskData = {
			"_id": "123",
			"name": "marketplace",
			"type": "service",
			"config": {
				"env": "new",
				"version": "1",
				"cd": {
					"strategy": "notify"
				},
				"settings": {
					"memory": "10Mi",
					"mode": "deployment",
					"replicas": 1
				},
				"src": {
					"from": {
						"branch": "master",
						"commit": "!@3"
					},
					"id": "12"
				},
				"recipe": {
					"id": "1234567890",
					"readinessProbe": {},
					"ports": {
						"type": "test",
						"portType": "Internal",
						"values": [{
							"name": "http",
							"target": 80
						}]
					},
					"env": {
						"SECRET_ENV": {
							"name": "secret name",
							"key": "secret name"
						},
						"USER_ENV": "test data"
					},
					"sourceCode": {
						"label": "test",
						"catalog": "test",
						"id": "test",
						"version": "test",
						"tag": "test",
					}
				}
			}
		};
		bl.saveConfiguration(soajs, inputmaskData, options, (err, response) => {
			assert.ifError(err);
			assert.deepEqual(response, "Catalog Item Configuration Successfully updated!");
			done();
		});
	});
	
	it("call saveConfiguration - fail user input env not found", function (done) {
		let BL = {
			"marketplace": {
				"handleError": (soajs, errCode) => {
					return new Error(errCode);
				},
				"mp": {
					"getModel": () => {
						return {
							getItem: (inputmaskData, cb) => {
								return cb(null, {
									"_id": "123",
									"environments": {
										"value": [],
										"type": "blacklist"
									}
								});
							},
							update_item_configuration: (opts, cb) => {
								return cb(null);
							}
						};
					}
				}
			}
		};
		nock('http://192.168.5.200')
			.get('/catalog/recipes/get')
			.query({
				id: "1234567890"
			})
			.reply(200, {
				"result": true,
				"data": {
					"recipe": {
						"buildOptions": {
							"env": {
								"SECRET_ENV": {
									"type": "secret"
								},
								"USER_ENV": {
									"type": "userInput"
								}
							}
						},
						"deployOptions": {
							"image": {
								"name": "test",
								"prefix": "soajs",
								"tag": "1.1"
							},
						}
					}
				}
			});
		let bl = helper.requireModule('bl/deploy.js')(BL);
		BL.localConfig = helper.requireModule("config.js");
		let options = {};
		let inputmaskData = {
			"_id": "123",
			"name": "marketplace",
			"type": "service",
			"config": {
				"env": "new",
				"version": "1",
				"cd": {
					"strategy": "notify"
				},
				"settings": {
					"memory": "10Mi",
					"mode": "deployment",
					"replicas": 1
				},
				"src": {
					"from": {
						"branch": "master",
						"commit": "!@3"
					},
					"id": "12"
				},
				"recipe": {
					"id": "1234567890",
					"readinessProbe": {},
					"ports": {
						"type": "test",
						"portType": "Internal",
						"values": [{
							"name": "http",
							"target": 80
						}]
					},
					"env": {
						"SECRET_ENV": {
							"name": "secret name",
							"key": "secret name"
						}
					},
					"sourceCode": {
						"label": "test",
						"catalog": "test",
						"id": "test",
						"version": "test",
						"tag": "test",
					}
				}
			}
		};
		bl.saveConfiguration(soajs, inputmaskData, options, (err) => {
			assert.ok(err);
			assert.deepEqual(err.message, "408");
			done();
		});
	});
	
	it("call saveConfiguration - fail secret env not found", function (done) {
		let BL = {
			"marketplace": {
				"handleError": (soajs, errCode) => {
					return new Error(errCode);
				},
				"mp": {
					"getModel": () => {
						return {
							getItem: (inputmaskData, cb) => {
								return cb(null, {
									"_id": "123",
									"environments": {
										"value": [],
										"type": "blacklist"
									}
								});
							},
							update_item_configuration: (opts, cb) => {
								return cb(null);
							}
						};
					}
				}
			}
		};
		nock('http://192.168.5.200')
			.get('/catalog/recipes/get')
			.query({
				id: "1234567890"
			})
			.reply(200, {
				"result": true,
				"data": {
					"recipe": {
						"buildOptions": {
							"env": {
								"SECRET_ENV": {
									"type": "secret"
								},
								"USER_ENV": {
									"type": "userInput"
								}
							}
						},
						"deployOptions": {
							"image": {
								"name": "test",
								"prefix": "soajs",
								"tag": "1.1"
							},
						}
					}
				}
			});
		let bl = helper.requireModule('bl/deploy.js')(BL);
		BL.localConfig = helper.requireModule("config.js");
		let options = {};
		let inputmaskData = {
			"_id": "123",
			"name": "marketplace",
			"type": "service",
			"config": {
				"env": "new",
				"version": "1",
				"cd": {
					"strategy": "notify"
				},
				"settings": {
					"memory": "10Mi",
					"mode": "deployment",
					"replicas": 1
				},
				"src": {
					"from": {
						"branch": "master",
						"commit": "!@3"
					},
					"id": "12"
				},
				"recipe": {
					"id": "1234567890",
					"readinessProbe": {},
					"ports": {
						"type": "test",
						"portType": "Internal",
						"values": [{
							"name": "http",
							"target": 80
						}]
					},
					"env": {
						"USER_ENV": "test data"
					},
					"sourceCode": {
						"label": "test",
						"catalog": "test",
						"id": "test",
						"version": "test",
						"tag": "test",
					}
				}
			}
		};
		bl.saveConfiguration(soajs, inputmaskData, options, (err) => {
			assert.ok(err);
			assert.deepEqual(err.message, "409");
			done();
		});
	});
	
	it("call saveConfiguration - fail settings recipes", function (done) {
		let BL = {
			"marketplace": {
				"handleError": (soajs, error) => {
					return new Error(error);
				},
				"mp": {
					"getModel": () => {
						return {
							getItem: (inputmaskData, cb) => {
								return cb(null, {
									"_id": "123",
									"settings": {
										"recipes": ["00000"]
									}
								});
							},
							update_item_configuration: (opts, cb) => {
								return cb(null);
							}
						};
					}
				}
			},
		};
		nock('http://192.168.5.200')
			.get('/catalog/recipes/get')
			.query({
				id: "1234567890"
			})
			.reply(200, {
				"result": true,
				"data": {
					"recipe": {
						"buildOptions": {
							"env": {
								"SECRET_ENV": {
									"type": "secret"
								},
								"USER_ENV": {
									"type": "userInput"
								}
							}
						}
					}
				}
			});
		let bl = helper.requireModule('bl/deploy.js')(BL);
		BL.localConfig = helper.requireModule("config.js");
		let options = {};
		let inputmaskData = {
			"_id": "123",
			"name": "marketplace",
			"type": "service",
			"config": {
				"env": "new",
				"version": "1",
				"cd": {
					"strategy": "notify"
				},
				"settings": {
					"memory": "10Mi",
					"mode": "deployment",
					"replicas": 1
				},
				"src": {
					"from": {
						"branch": "master",
						"commit": "!@3"
					},
					"id": "12"
				},
				"recipe": {
					"id": "1234567890",
					"image": {
						"name": "test",
						"prefix": "soajs",
						"tag": "1.1"
					},
					"readinessProbe": {},
					"ports": {
						"type": "test",
						"portType": "Internal",
						"values": [{
							"name": "http",
							"target": 80
						}]
					},
					"env": {
						"SECRET_ENV": {
							"name": "secret name",
							"key": "secret name"
						},
						"USER_ENV": "test data"
					},
					"sourceCode": {
						"label": "test",
						"catalog": "test",
						"id": "test",
						"version": "test",
						"tag": "test",
					}
				}
			}
		};
		bl.saveConfiguration(soajs, inputmaskData, options, (err) => {
			assert.ok(err);
			assert.deepEqual(err.message, "405");
			done();
		});
	});
	
	it("call saveConfiguration - fail settings environments whitelist", function (done) {
		let BL = {
			"marketplace": {
				"handleError": (soajs, error) => {
					return new Error(error);
				},
				"mp": {
					"getModel": () => {
						return {
							getItem: (inputmaskData, cb) => {
								return cb(null, {
									"_id": "123",
									"settings": {
										"environments": {
											"value": ["test"],
											"type": "whitelist"
										}
									}
								});
							},
							update_item_configuration: (opts, cb) => {
								return cb(null);
							}
						};
					}
				}
			}
		};
		nock('http://192.168.5.200')
			.get('/catalog/recipes/get')
			.query({
				id: "1234567890"
			})
			.reply(200, {
				"result": true,
				"data": {
					"recipe": {
						"buildOptions": {
							"env": {
								"SECRET_ENV": {
									"type": "secret"
								},
								"USER_ENV": {
									"type": "userInput"
								}
							}
						}
					}
				}
			});
		let bl = helper.requireModule('bl/deploy.js')(BL);
		BL.localConfig = helper.requireModule("config.js");
		let options = {};
		let inputmaskData = {
			"_id": "123",
			"name": "marketplace",
			"type": "service",
			"config": {
				"env": "new",
				"version": "1",
				"cd": {
					"strategy": "notify"
				},
				"settings": {
					"memory": "10Mi",
					"mode": "deployment",
					"replicas": 1
				},
				"src": {
					"from": {
						"branch": "master",
						"commit": "!@3"
					},
					"id": "12"
				},
				"recipe": {
					"id": "1234567890",
					"image": {
						"name": "test",
						"prefix": "soajs",
						"tag": "1.1"
					},
					"readinessProbe": {},
					"ports": {
						"type": "test",
						"portType": "Internal",
						"values": [{
							"name": "http",
							"target": 80
						}]
					},
					"env": {
						"SECRET_ENV": {
							"name": "secret name",
							"key": "secret name"
						},
						"USER_ENV": "test data"
					},
					"sourceCode": {
						"label": "test",
						"catalog": "test",
						"id": "test",
						"version": "test",
						"tag": "test",
					}
				}
			}
		};
		bl.saveConfiguration(soajs, inputmaskData, options, (err) => {
			assert.ok(err);
			assert.deepEqual(err.message, "406");
			done();
		});
	});
	
	it("call saveConfiguration - fail settings environments blacklist", function (done) {
		let BL = {
			"marketplace": {
				"handleError": (soajs, error) => {
					return new Error(error);
				},
				"mp": {
					"getModel": () => {
						return {
							getItem: (inputmaskData, cb) => {
								return cb(null, {
									"_id": "123",
									"settings": {
										"environments": {
											"value": ["NEW"],
											"type": "blacklist"
										}
									}
								});
							},
							update_item_configuration: (opts, cb) => {
								return cb(null);
							}
						};
					}
				}
			}
		};
		nock('http://192.168.5.200')
			.get('/catalog/recipes/get')
			.query({
				id: "1234567890"
			})
			.reply(200, {
				"result": true,
				"data": {
					"recipe": {
						"buildOptions": {
							"env": {
								"SECRET_ENV": {
									"type": "secret"
								},
								"USER_ENV": {
									"type": "userInput"
								}
							}
						}
					}
				}
			});
		let bl = helper.requireModule('bl/deploy.js')(BL);
		BL.localConfig = helper.requireModule("config.js");
		let options = {};
		let inputmaskData = {
			"_id": "123",
			"name": "marketplace",
			"type": "service",
			"config": {
				"env": "new",
				"version": "1",
				"cd": {
					"strategy": "notify"
				},
				"settings": {
					"memory": "10Mi",
					"mode": "deployment",
					"replicas": 1
				},
				"src": {
					"from": {
						"branch": "master",
						"commit": "!@3"
					},
					"id": "12"
				},
				"recipe": {
					"id": "1234567890",
					"image": {
						"name": "test",
						"prefix": "soajs",
						"tag": "1.1"
					},
					"readinessProbe": {},
					"ports": {
						"type": "test",
						"portType": "Internal",
						"values": [{
							"name": "http",
							"target": 80
						}]
					},
					"env": {
						"SECRET_ENV": {
							"name": "secret name",
							"key": "secret name"
						},
						"USER_ENV": "test data"
					},
					"sourceCode": {
						"label": "test",
						"catalog": "test",
						"id": "test",
						"version": "test",
						"tag": "test",
					}
				}
			}
		};
		bl.saveConfiguration(soajs, inputmaskData, options, (err) => {
			assert.ok(err);
			assert.deepEqual(err.message, "406");
			done();
		});
	});
	
	it("call saveConfiguration - fail update_item_configuration", function (done) {
		soajs.urac.groups = [];
		let BL = {
			"marketplace": {
				"handleError": (soajs, error) => {
					return new Error(error);
				},
				"mp": {
					"getModel": () => {
						return {
							getItem: (inputmaskData, cb) => {
								return cb(null, {
									"_id": "123",
									"settings" : {
										"environments": {
											"value": [],
											"type": "whitelist"
										}
									}
								});
							},
							update_item_configuration: (opts, cb) => {
								return cb(new Error('Marketplace: item [marketplace] was not updated.'));
							}
						};
					}
				}
			}
		};
		nock('http://192.168.5.200')
			.get('/catalog/recipes/get')
			.query({
				id: "1234567890"
			})
			.reply(200, {
				"result": true,
				"data": {
					"recipe": {
						"buildOptions": {
							"env": {
								"SECRET_ENV": {
									"type": "secret"
								},
								"USER_ENV": {
									"type": "userInput"
								}
							}
						}
					}
				}
			});
		let bl = helper.requireModule('bl/deploy.js')(BL);
		BL.localConfig = helper.requireModule("config.js");
		let options = {};
		let inputmaskData = {
			"_id": "123",
			"name": "marketplace",
			"type": "service",
			"config": {
				"env": "new",
				"version": "1",
				"cd": {
					"strategy": "notify"
				},
				"settings": {
					"memory": "10Mi",
					"mode": "deployment",
					"replicas": 1
				},
				"src": {
					"from": {
						"branch": "master",
						"commit": "!@3"
					},
					"id": "12"
				},
				"recipe": {
					"id": "1234567890",
					"image": {
						"name": "test",
						"prefix": "soajs",
						"tag": "1.1"
					},
					"readinessProbe": {},
					"ports": {
						"type": "test",
						"portType": "Internal",
						"values": [{
							"name": "http",
							"target": 80
						}]
					},
					"env": {
						"SECRET_ENV": {
							"name": "secret name",
							"key": "secret name"
						},
						"USER_ENV": "test data"
					},
					"sourceCode": {
						"label": "test",
						"catalog": "test",
						"id": "test",
						"version": "test",
						"tag": "test",
					}
				}
			}
		};
		bl.saveConfiguration(soajs, inputmaskData, options, (err) => {
			assert.ok(err);
			assert.deepEqual(err.message, "603");
			done();
		});
	});
	
	it("call saveConfiguration - fail update_item_configuration mongo", function (done) {
		delete soajs.urac;
		let BL = {
			"marketplace": {
				"handleError": (soajs, error) => {
					return new Error(error);
				},
				"mp": {
					"getModel": () => {
						return {
							getItem: (inputmaskData, cb) => {
								return cb(null, {
									"_id": "123",
									"settings" : {}
								});
							},
							update_item_configuration: (opts, cb) => {
								return cb(new Error('mongo error'));
							}
						};
					}
				}
			}
		};
		nock('http://192.168.5.200')
			.get('/catalog/recipes/get')
			.query({
				id: "1234567890"
			})
			.reply(200, {
				"result": true,
				"data": {
					"recipe": {
						"buildOptions": {
							"env": {
								"SECRET_ENV": {
									"type": "secret"
								},
								"USER_ENV": {
									"type": "userInput"
								}
							}
						}
					}
				}
			});
		let bl = helper.requireModule('bl/deploy.js')(BL);
		BL.localConfig = helper.requireModule("config.js");
		let options = {};
		let inputmaskData = {
			"_id": "123",
			"name": "marketplace",
			"type": "service",
			"config": {
				"env": "new",
				"version": "1",
				"cd": {
					"strategy": "notify"
				},
				"settings": {
					"memory": "10Mi",
					"mode": "deployment",
					"replicas": 1
				},
				"src": {
					"from": {
						"branch": "master",
						"commit": "!@3"
					},
					"id": "12"
				},
				"recipe": {
					"id": "1234567890",
					"image": {
						"name": "test",
						"prefix": "soajs",
						"tag": "1.1"
					},
					"readinessProbe": {},
					"ports": {
						"type": "test",
						"portType": "Internal",
						"values": [{
							"name": "http",
							"target": 80
						}]
					},
					"env": {
						"SECRET_ENV": {
							"name": "secret name",
							"key": "secret name"
						},
						"USER_ENV": "test data"
					},
					"sourceCode": {
						"label": "test",
						"catalog": "test",
						"id": "test",
						"version": "test",
						"tag": "test",
					}
				}
			}
		};
		bl.saveConfiguration(soajs, inputmaskData, options, (err) => {
			assert.ok(err);
			assert.deepEqual(err.message, "602");
			done();
		});
	});
});