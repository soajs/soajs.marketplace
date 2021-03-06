"use strict";

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const helper = require("../../helper.js");
const sdk = helper.requireModule('./lib/sdk.js');
const assert = require('assert');
const nock = require("nock");

describe("Unit test for: lib/sdk.js - marketplace", function () {
	afterEach((done) => {
		nock.cleanAll();
		done();
	});
	
	it("call ledger- empty doc", function (done) {
		let soajs = {
			awareness: {
				connect: (service, version, cb) => {
					return cb({
						headers: {},
						host: "127.0.0.1:4008"
					});
				}
			},
			log: {
				error: (error) => {
					console.log(error);
				}
			}
		};
		let doc = null;
		let response = null;
		sdk.ledger(soajs, doc, response, (error) => {
			assert.ifError(error);
			done();
		});
	});
	it("call ledger- empty object doc", function (done) {
		let soajs = {
			awareness: {
				connect: (service, version, cb) => {
					return cb({
						headers: {},
						host: "127.0.0.1:4008"
					});
				}
			},
			log: {
				error: (error) => {
					console.log(error);
				}
			}
		};
		let doc = {};
		let response = null;
		sdk.ledger(soajs, doc, response, (error) => {
			assert.ifError(error);
			done();
		});
	});
	it("call ledger,  response fail object ", function (done) {
		let soajs = {
			awareness: {
				connect: (service, version, cb) => {
					return cb({
						headers: {},
						host: "www.example.com"
					});
				}
			},
			log: {
				error: (error) => {
					console.log(error);
				}
			},
			inputmaskData: {
				"token": 123,
				"repo_token": 123
			}
		};
		let doc = {};
		let response = {
			"result": false
		};
		let nockResponse = doc;
		if (response) {
			let status;
			if (response.result) {
				status = "succeeded";
			} else {
				status = "failed";
			}
			nockResponse.status = status;
			nockResponse.input = soajs.inputmaskData;
			if (nockResponse.input) {
				delete nockResponse.input.token;
				delete nockResponse.input.repo_token;
			}
			nockResponse.output = response;
		}
		nock('http://www.example.com')
			.post('/ledger',
				{
					doc: doc
				})
			.reply(200, {
				"result": false,
				"errors": [{
					"code": 1
				}]
			});
		sdk.ledger(soajs, doc, response, (error) => {
			setTimeout(function () {
				assert.ifError(error);
				done();
			}, 300);
		});
	});
	it("call ledger, succeeded response", function (done) {
		let soajs = {
			awareness: {
				connect: (service, version, cb) => {
					return cb({
						headers: {},
						host: "www.example.com"
					});
				}
			},
			log: {
				error: (error) => {
					console.log(error);
				}
			},
			inputmaskData: {
				"token": 123,
				"repo_token": 123
			}
		};
		let doc = {
			"env": "new",
			"type": "Deployment",
			"section": "Catalog",
			"locator": [
				"configure",
				"controller"
			],
			"action": "updated"
		};
		let response = {
			"result": true,
			"data": "Catalog Item Configuration Successfully updated!"
		};
		let nockResponse = doc;
		if (response) {
			let status;
			if (response.result) {
				status = "succeeded";
			} else {
				status = "failed";
			}
			nockResponse.status = status;
			nockResponse.input = soajs.inputmaskData;
			if (nockResponse.input) {
				delete nockResponse.input.token;
				delete nockResponse.input.repo_token;
			}
			nockResponse.output = response;
		}
		nock('http://www.example.com')
			.post('/ledger',
				{
					doc: doc
				})
			.reply(200, {
				"result": true,
			});
		sdk.ledger(soajs, doc, response, (error) => {
			setTimeout(function () {
				assert.ifError(error);
				done();
			}, 300);
		});
	});
	
	it("call get_env_registry, succeeded response", function (done) {
		let soajs = {
			awareness: {
				connect: (service, version, cb) => {
					return cb({
						headers: {},
						host: "www.example.com"
					});
				}
			},
			log: {
				error: (error) => {
					console.log(error);
				}
			}
		};
		let data = {
			"env": "new",
		};
		nock('http://www.example.com')
			.get('/registry?env=new')
			.reply(200, {
				"result": true,
				"data": {
					"code": "DEV"
				}
			});
		sdk.get_env_registry(soajs, data, (error) => {
			assert.ifError(error);
			done();
		});
	});
	
	it("call get_env_registry, fail no env", function (done) {
		let soajs = {
			awareness: {
				connect: (service, version, cb) => {
					return cb({
						headers: {},
						host: "www.example.com"
					});
				}
			},
			log: {
				error: (error) => {
					console.log(error);
				}
			}
		};
		let data = {
		};
		nock('http://www.example.com')
			.get('/registry')
			.reply(200, {
				"result": true,
			});
		sdk.get_env_registry(soajs, data, (error) => {
			assert.ifError(error);
			done();
		});
	});
	
	it("call get_env_registry, fail error in response", function (done) {
		let soajs = {
			awareness: {
				connect: (service, version, cb) => {
					return cb({
						headers: {},
						host: "www.example.com"
					});
				}
			},
			log: {
				error: (error) => {
					console.log(error);
				}
			}
		};
		let data = {
			"env": "new",
		};
		nock('http://www.example.com')
			.get('/registry?env=new')
			.reply(200, {
				"result": false,
			});
		sdk.get_env_registry(soajs, data, (error) => {
			assert.ifError(error);
			done();
		});
	});
	
	it("call get_env_registry, fail error in request", function (done) {
		let soajs = {
			awareness: {
				connect: (service, version, cb) => {
					return cb({
						headers: {},
						host: "www.example.com"
					});
				}
			},
			log: {
				error: (error) => {
					console.log(error);
				}
			}
		};
		let data = {
			"env": "new",
		};
		nock('http://www.example.com')
			.get('/registry')
			.reply(200, {
				"result": false,
			});
		sdk.get_env_registry(soajs, data, (error) => {
			assert.ifError(error);
			done();
		});
	});
	
	it("call get_env_registry, fail no connect to infra", function (done) {
		let soajs = {
			awareness: {
				connect: (service, version, cb) => {
					return cb(null);
				}
			},
			log: {
				error: (error) => {
					console.log(error);
				}
			}
		};
		let data = {
			"env": "new",
		};
		nock('http://www.example.com')
			.get('/registry')
			.reply(200, {
				"result": true,
			});
		sdk.get_env_registry(soajs, data, (error) => {
			assert.ifError(error);
			done();
		});
	});
});