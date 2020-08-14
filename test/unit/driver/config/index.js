"use strict";

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const helper = require("../../../helper.js");
const service = helper.requireModule('./driver/config/index.js');
const utils = helper.requireModule('./utils/index.js');
const assert = require('assert');
const sinon = require("sinon");

describe("Unit test for: driver/config/index.js - createCatalog", function () {
	afterEach((done) => {
		sinon.restore();
		done();
	});
	
	it("call createCatalog - success branch", function (done) {
		sinon.stub(utils, 'generateSchemas').callsFake(function fakeFn(data, cb) {
			return cb();
		});
		let data = {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.test",
				"branch": "dev"
			},
			"soa": {
				"name": "micro1",
				"group": "Example",
				"subType": "lion",
				"port": 4991,
				"version": "2",
				"description": "description is description",
				"tab": {
					"main": "main",
					"sub" : "sub"
				},
				"tags": ["tag1"],
				"program": ["program1"],
				"attributes": {
					"attrib": "1"
				},
				"documentation": {
					"readme": "README.md",
					"release": "RELEASE.md"
				},
				"maintenance": {
					"port": {
						"type": "inherit"
					},
					"readiness": "/heartbeat"
				},
				"profile": {"info": "stuff"}
			},
			"documentation": {
				"release": "Release: V1",
				"readme": "# soajs.test Test Express Service for Patch, Head, and others"
			}
		};
		service.createCatalog(data, (response) => {
			assert.ok(response);
			done();
		});
	});
	
	it("call createCatalog - success old catalog different version branch", function (done) {
		sinon.stub(utils, 'generateSchemas').callsFake(function fakeFn(data, cb) {
			return cb();
		});
		let data = {
			"oldCatalog": {
				type: "micro1",
				name: "marketplace",
				configuration: {
					subType: "lion",
					group: "Example",
					port:4991,
					requestTimeout:30,
					requestTimeoutRenewal: 5
				},
				versions: [
					{
						version: "1",
						"branches": ["dev", "master"],
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
					}
				],
				description: "loliod",
			},
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.test",
				"branch": "dev"
			},
			"soa": {
				"name": "micro1",
				"group": "Example",
				"subType": "lion",
				"port": 4991,
				"version": "2",
				"description": "description is description",
				"tab": {
					"main": "main",
					"sub" : "sub"
				},
				"tags": ["tag1"],
				"program": ["program1"],
				"attributes": {
					"attrib": "1"
				},
				"documentation": {
					"readme": "README.md",
					"release": "RELEASE.md"
				},
				"maintenance": {
					"port": {
						"type": "inherit"
					},
					"readiness": "/heartbeat"
				},
				"profile": {"info": "stuff"}
			},
			"documentation": {
				"release": "Release: V1",
				"readme": "# soajs.test Test Express Service for Patch, Head, and others"
			}
		};
		service.createCatalog(data, (response) => {
			assert.ok(response);
			done();
		});
	});
	
	it("call createCatalog - success update catalog version branch", function (done) {
		sinon.stub(utils, 'generateSchemas').callsFake(function fakeFn(data, cb) {
			return cb();
		});
		let data = {
			"oldCatalog": {
				type: "micro1",
				name: "marketplace",
				configuration: {
					subType: "lion",
					group: "Example",
					port:4991,
					requestTimeout:30,
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
					}
				],
				description: "loliod",
			},
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.test",
				"branch": "dev"
			},
			"soa": {
				"name": "micro1",
				"group": "Example",
				"subType": "lion",
				"port": 4991,
				"version": "1",
				"description": "description is description",
				"tab": {
					"main": "main",
					"sub" : "sub"
				},
				"tags": ["tag1"],
				"program": ["program1"],
				"attributes": {
					"attrib": "1"
				},
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
				},
				"profile": {"info": "stuff"}
			},
			"documentation": {
				"release": "Release: V1",
				"readme": "# soajs.test Test Express Service for Patch, Head, and others"
			}
		};
		service.createCatalog(data, (response) => {
			assert.ok(response);
			done();
		});
	});
	
	it("call createCatalog - success tag", function (done) {
		sinon.stub(utils, 'generateSchemas').callsFake(function fakeFn(data, cb) {
			return cb();
		});
		let data = {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.test",
				"tag": "1"
			},
			"soa": {
				"name": "micro1",
				"group": "Example",
				"subType": "lion",
				"port": 4991,
				"version": "2",
				"description": "description is description",
				"tab": {
					"main": "main",
					"sub" : "sub"
				},
				"tags": ["tag1"],
				"program": ["program1"],
				"attributes": {
					"attrib": "1"
				},
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
				},
				"profile": {"info": "stuff"}
			},
			"documentation": {
				"release": "Release: V1",
				"readme": "# soajs.test Test Express Service for Patch, Head, and others"
			}
		};
		service.createCatalog(data, (response) => {
			assert.ok(response);
			done();
		});
	});
	
	it("call createCatalog - success update catalog version tag", function (done) {
		sinon.stub(utils, 'generateSchemas').callsFake(function fakeFn(data, cb) {
			return cb();
		});
		let data = {
			"oldCatalog": {
				type: "micro1",
				name: "marketplace",
				configuration: {
					subType: "lion",
					group: "Example",
					port:4991,
					requestTimeout:30,
					requestTimeoutRenewal: 5
				},
				versions: [
					{
						version: "1",
						extKeyRequired: true,
						
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
						apis: [
							{
								l: "This API lists the items matching certain keywords from soajs catalog only.",
								v: "/soajs/items",
								m: "get",
								group: "SOAJS"
							}
						]
					}
				],
				description: "loliod",
			},
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.test",
				"tag": "1"
			},
			"soa": {
				"name": "micro1",
				"group": "Example",
				"subType": "lion",
				"port": 4991,
				"version": "1",
				"description": "description is description",
				
				
				"tab": {
					"main": "main",
					"sub" : "sub"
				},
				"tags": ["tag1"],
				"program": ["program1"],
				"attributes": {
					"attrib": "1"
				},
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
				},
				"profile": {"info": "stuff"}
			},
			"documentation": {
				"release": "Release: V1",
				"readme": "# soajs.test Test Express Service for Patch, Head, and others"
			}
		};
		service.createCatalog(data, (response) => {
			assert.ok(response);
			done();
		});
	});
	
	it("call createCatalog - success old catalog different version tag", function (done) {
		sinon.stub(utils, 'generateSchemas').callsFake(function fakeFn(data, cb) {
			return cb();
		});
		let data = {
			"oldCatalog": {
				type: "micro1",
				name: "marketplace",
				configuration: {
					subType: "lion",
					group: "Example",
					port:4991,
					requestTimeout:30,
					requestTimeoutRenewal: 5
				},
				versions: [
					{
						version: "1",
						extKeyRequired: true,
						
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
						"tags": ["1", "1.5"],
						apis: [
							{
								l: "This API lists the items matching certain keywords from soajs catalog only.",
								v: "/soajs/items",
								m: "get",
								group: "SOAJS"
							}
						]
					}
				],
				description: "loliod",
			},
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.test",
				"tag": "1"
			},
			"soa": {
				"name": "micro1",
				"group": "Example",
				"subType": "lion",
				"port": 4991,
				"version": "2",
				"description": "description is description",
				
				
				"tab": {
					"main": "main",
					"sub" : "sub"
				},
				"tags": ["tag1"],
				"program": ["program1"],
				"attributes": {
					"attrib": "1"
				},
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
				},
				"profile": {"info": "stuff"}
			},
			"documentation": {
				"release": "Release: V1",
				"readme": "# soajs.test Test Express Service for Patch, Head, and others"
			}
		};
		service.createCatalog(data, (response) => {
			assert.ok(response);
			done();
		});
	});
	
	it("call checkCanUpdate - success false", function (done) {
		let data = {
			"oldCatalog": {
				"src": {
					"provider": "github",
					"owner": "test",
					"repo": "soajs.test",
					"tag": "1"
				},
			},
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.test",
				"tag": "1"
			}
		};
		service.checkCanUpdate(data, (res) => {
			assert.ok(!res);
			done();
		});
	});
	
	it("call checkCanUpdate - success true", function (done) {
		let data = {
			"oldCatalog": {
				"src": {
					"provider": "github",
					"owner": "test",
					"repo": "soajs.test",
					"tag": "1"
				},
			},
			"src": {
				"provider": "github",
				"owner": "notfound",
				"repo": "soajs.test",
				"tag": "1"
			}
		};
		service.checkCanUpdate(data, (res) => {
			assert.ok(res);
			done();
		});
	});
	
	it("call checkCanUpdate - success true", function (done) {
		let data = {
			"oldCatalog": {
				"src": {
					"provider": "github",
					"owner": "test",
					"repo": "soajs.test",
					"tag": "1"
				},
			},
			"src": {
				"provider": "bitbucket",
				"owner": "notfound",
				"repo": "soajs.test",
				"tag": "1"
			}
		};
		service.checkCanUpdate(data, (res) => {
			assert.ok(res);
			done();
		});
	});
});