/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

const helper = require("../../helper.js");
const BL = helper.requireModule('bl/marketplace.js');
const sdk = helper.requireModule('lib/sdk.js');
const sinon = require('sinon');
const nock = require("nock");
const assert = require('assert');

describe("Unit test for: BL - marketplace", () => {
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
	
	//getItems_by_type_subtype
	it("getItems_by_type_subtype - no inputmaskData", function (done) {
		BL.modelObj = {
			getItems_by_type_subtype: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			}
		};
		BL.getItems_by_type_subtype(soajs, null, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 400);
			done();
		});
	});
	
	it("getItems_by_type_subtype - fail mongo", function (done) {
		BL.modelObj = {
			getItems_by_type_subtype: (data, cb) => {
				return cb(true);
			}
		};
		BL.getItems_by_type_subtype(soajs, {}, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 602);
			done();
		});
	});
	
	it("getItems_by_type_subtype - success", function (done) {
		BL.modelObj = {
			getItems_by_type_subtype: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			}
		};
		BL.getItems_by_type_subtype(soajs, {}, {}, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response._id, "123");
			done();
		});
	});
	
	//getItems_by_keywords
	it("getItems_by_keywords - no inputmaskData", function (done) {
		BL.modelObj = {
			getItems_by_keywords: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			}
		};
		BL.getItems_by_keywords(soajs, null, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 400);
			done();
		});
	});
	
	it("getItems_by_keywords - fail mongo", function (done) {
		BL.modelObj = {
			getItems_by_keywords: (data, cb) => {
				return cb(true);
			}
		};
		BL.getItems_by_keywords(soajs, {}, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 602);
			done();
		});
	});
	
	it("getItems_by_keywords - success", function (done) {
		BL.modelObj = {
			getItems_by_keywords: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			}
		};
		BL.getItems_by_keywords(soajs, {}, {}, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response._id, "123");
			done();
		});
	});
	
	//getItem_by_source
	it("getItem_by_source - no inputmaskData", function (done) {
		BL.modelObj = {
			getItem_by_source: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			}
		};
		BL.getItem_by_source(soajs, null, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 400);
			done();
		});
	});
	
	it("getItem_by_source - fail mongo", function (done) {
		BL.modelObj = {
			getItem_by_source: (data, cb) => {
				return cb(true);
			}
		};
		BL.getItem_by_source(soajs, {}, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 602);
			done();
		});
	});
	
	it("getItem_by_source - success", function (done) {
		BL.modelObj = {
			getItem_by_source: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			}
		};
		BL.getItem_by_source(soajs, {}, {}, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response._id, "123");
			done();
		});
	});
	
	//getItem_by_type
	it("getItem_by_type - no inputmaskData", function (done) {
		BL.modelObj = {
			getItem_by_type: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			}
		};
		BL.getItem_by_type(soajs, null, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 400);
			done();
		});
	});
	
	it("getItem_by_type - fail mongo", function (done) {
		BL.modelObj = {
			getItem_by_type: (data, cb) => {
				return cb(true);
			}
		};
		BL.getItem_by_type(soajs, {}, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 602);
			done();
		});
	});
	
	it("getItem_by_type - success", function (done) {
		BL.modelObj = {
			getItem_by_type: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			}
		};
		BL.getItem_by_type(soajs, {}, {}, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response._id, "123");
			done();
		});
	});
	
	//updateItem_environments
	it("updateItem_environments - no inputmaskData", function (done) {
		BL.modelObj = {
			updateItem_environments: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			}
		};
		BL.updateItem_environments(soajs, null, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 400);
			done();
		});
	});
	
	it("updateItem_environments - fail mongo", function (done) {
		BL.modelObj = {
			updateItem_environments: (data, cb) => {
				return cb(true);
			}
		};
		BL.updateItem_environments(soajs, {}, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 602);
			done();
		});
	});
	
	it("updateItem_environments - success", function (done) {
		BL.modelObj = {
			updateItem_environments: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			}
		};
		BL.updateItem_environments(soajs, {}, {}, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response._id, "123");
			done();
		});
	});
	
	//updateItem_recipes
	it("updateItem_recipes - no inputmaskData", function (done) {
		BL.modelObj = {
			updateItem_recipes: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			}
		};
		BL.updateItem_recipes(soajs, null, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 400);
			done();
		});
	});
	
	it("updateItem_recipes - fail mongo", function (done) {
		BL.modelObj = {
			updateItem_recipes: (data, cb) => {
				return cb(true);
			}
		};
		BL.updateItem_recipes(soajs, {}, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 602);
			done();
		});
	});
	
	it("updateItem_recipes - success", function (done) {
		BL.modelObj = {
			updateItem_recipes: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			}
		};
		BL.updateItem_recipes(soajs, {}, {}, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response._id, "123");
			done();
		});
	});
	
	//updateItem_acl
	it("updateItem_acl - no inputmaskData", function (done) {
		BL.modelObj = {
			updateItem_acl: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			}
		};
		BL.updateItem_acl(soajs, null, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 400);
			done();
		});
	});
	
	it("updateItem_acl - fail mongo", function (done) {
		BL.modelObj = {
			updateItem_acl: (data, cb) => {
				return cb(true);
			}
		};
		BL.updateItem_acl(soajs, {}, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 602);
			done();
		});
	});
	
	it("updateItem_acl - success", function (done) {
		BL.modelObj = {
			updateItem_acl: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			}
		};
		BL.updateItem_acl(soajs, {}, {}, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response._id, "123");
			done();
		});
	});
	
	//deleteItem
	it("deleteItem - no inputmaskData", function (done) {
		BL.modelObj = {
			deleteItem: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			}
		};
		BL.deleteItem(soajs, null, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 400);
			done();
		});
	});
	
	it("deleteItem - fail mongo", function (done) {
		BL.modelObj = {
			getItem: (data, cb) => {
				return cb(true);
			}
		};
		BL.deleteItem(soajs, {}, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 602);
			done();
		});
	});
	
	it("deleteItem - success", function (done) {
		BL.modelObj = {
			getItem: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			},
			deleteItem: (data, cb) => {
				return cb(null, true);
			}
		};
		BL.deleteItem(soajs, {}, {}, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response, true);
			done();
		});
	});
	
	it("deleteItem - fail no item found", function (done) {
		BL.modelObj = {
			getItem: (data, cb) => {
				return cb(null);
			},
			deleteItem: (data, cb) => {
				return cb(null, true);
			}
		};
		BL.deleteItem(soajs, {}, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 501);
			done();
		});
	});
	
	it("deleteItem - fail item locked", function (done) {
		BL.modelObj = {
			getItem: (data, cb) => {
				return cb(null, {
						_id: "123",
						locked: true
					}
				);
			},
			deleteItem: (data, cb) => {
				return cb(null, true);
			}
		};
		BL.deleteItem(soajs, {}, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 502);
			done();
		});
	});
	
	it("deleteItem - failed to delete", function (done) {
		BL.modelObj = {
			getItem: (data, cb) => {
				return cb(null, {
						_id: "123"
					}
				);
			},
			deleteItem: (data, cb) => {
				return cb(true);
			}
		};
		BL.deleteItem(soajs, {}, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 602);
			done();
		});
	});
	
	//deleteItem_source
	it("deleteItem_source - no inputmaskData", function (done) {
		BL.modelObj = {
			deleteItem_source: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			}
		};
		BL.deleteItem_source(soajs, null, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 400);
			done();
		});
	});
	
	it("deleteItem_source - fail mongo", function (done) {
		BL.modelObj = {
			deleteItem_source: (data, cb) => {
				return cb(true);
			}
		};
		BL.deleteItem_source(soajs, {}, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 602);
			done();
		});
	});
	
	it("deleteItem_source - success", function (done) {
		BL.modelObj = {
			deleteItem_source: (data, cb) => {
				return cb(null, {
					_id: "123"
				});
			}
		};
		BL.deleteItem_source(soajs, {}, {}, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response, true);
			done();
		});
	});
	
	//update_item_version_config
	it("update_item_version_config - no inputmaskData", function (done) {
		BL.modelObj = {
			update_item_version_config: (data, cb) => {
				return cb(null, {
					n: 1
				});
			}
		};
		BL.update_item_version_config(soajs, null, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 400);
			done();
		});
	});
	
	it("update_item_version_config - fail mongo", function (done) {
		BL.modelObj = {
			update_item_version_config: (data, cb) => {
				return cb(true);
			}
		};
		BL.update_item_version_config(soajs, {}, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 602);
			done();
		});
	});
	
	it("update_item_version_config - success", function (done) {
		BL.modelObj = {
			update_item_version_config: (data, cb) => {
				return cb(null, {
					n: 1
				});
			}
		};
		BL.update_item_version_config(soajs, {}, {}, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response.n, 1);
			done();
		});
	});
	
	//deleteItem_branch
	it("deleteItem_branch - no inputmaskData", function (done) {
		BL.modelObj = {
			deleteItem_branch: (data, cb) => {
				return cb(null, {
					n: 1
				});
			}
		};
		BL.deleteItem_branch(soajs, null, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 400);
			done();
		});
	});
	
	it("deleteItem_branch - getItem mongo fail", function (done) {
		BL.modelObj = {
			getItem: (data, cb) => {
				return cb(true);
			}
		};
		BL.deleteItem_branch(soajs, {}, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 602);
			done();
		});
	});
	
	it("deleteItem_branch - no item", function (done) {
		BL.modelObj = {
			getItem: (data, cb) => {
				return cb(null);
			}
		};
		BL.deleteItem_branch(soajs, {}, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 501);
			done();
		});
	});
	
	it("deleteItem_branch - item locked", function (done) {
		BL.modelObj = {
			getItem: (data, cb) => {
				return cb(null, {
					_id: "123",
					locked: true
				});
			}
		};
		BL.deleteItem_branch(soajs, {}, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 502);
			done();
		});
	});
	
	it("deleteItem_branch - success and remove version", function (done) {
		BL.modelObj = {
			getItem: (data, cb) => {
				return cb(null, {
					_id: "123",
					versions: [{
						version: 1,
						branches: ["new"]
					}]
				});
			},
			deleteItem_version: (data, cb) => {
				return cb(null, {
					_id: "123",
					versions: [{
						branches: ["new"]
					}]
				});
			}
		};
		let inputmaskData = {
			branch: "new",
			name: "name",
			type: "type",
		};
		BL.deleteItem_branch(soajs, inputmaskData, {}, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response, true);
			done();
		});
	});
	
	it("deleteItem_branch - success and do not remove version", function (done) {
		BL.modelObj = {
			getItem: (data, cb) => {
				return cb(null, {
					_id: "123",
					versions: [{
						version: 1,
						branches: ["new", "test"]
					}]
				});
			},
			deleteItem_version: (data, cb) => {
				return cb(null, true);
			}
		};
		let inputmaskData = {
			branch: "new",
			name: "name",
			type: "type",
		};
		BL.deleteItem_branch(soajs, inputmaskData, {}, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response, true);
			done();
		});
	});
	
	it("deleteItem_branch - version not found", function (done) {
		BL.modelObj = {
			getItem: (data, cb) => {
				return cb(null, {
					_id: "123",
					versions: [{
						branches: ["new"]
					}]
				});
			},
			deleteItem_version: (data, cb) => {
				return cb(null, {
					_id: "123",
					versions: [{
						version: 1,
						branches: ["new"]
					}]
				});
			}
		};
		let inputmaskData = {
			branch: "branch",
			name: "name",
			type: "type",
		};
		BL.deleteItem_branch(soajs, inputmaskData, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 403);
			done();
		});
	});
	
	it("deleteItem_branch - empty branches", function (done) {
		BL.modelObj = {
			getItem: (data, cb) => {
				return cb(null, {
					_id: "123",
					versions: [{
						version: 1
					}]
				});
			},
			deleteItem_version: (data, cb) => {
				return cb(null);
			}
		};
		let inputmaskData = {
			branch: "branch",
			name: "name",
			type: "type",
		};
		BL.deleteItem_branch(soajs, inputmaskData, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 403);
			done();
		});
	});
	
	it("deleteItem_branch - mongo error in delete item", function (done) {
		BL.modelObj = {
			getItem: (data, cb) => {
				return cb(null, {
					_id: "123",
					versions: [{
						version: 1,
						branches: ["new"]
					}]
				});
			},
			deleteItem_version: (data, cb) => {
				return cb(true);
			}
		};
		let inputmaskData = {
			branch: "new",
			name: "name",
			type: "type",
		};
		BL.deleteItem_branch(soajs, inputmaskData, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 602);
			done();
		});
	});
	
	//deleteItem_tag
	it("deleteItem_tag - no inputmaskData", function (done) {
		BL.modelObj = {
			deleteItem_tag: (data, cb) => {
				return cb(null, {
					n: 1
				});
			}
		};
		BL.deleteItem_tag(soajs, null, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 400);
			done();
		});
	});
	
	it("deleteItem_tag - getItem mongo fail", function (done) {
		BL.modelObj = {
			getItem: (data, cb) => {
				return cb(true);
			}
		};
		BL.deleteItem_tag(soajs, {}, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 602);
			done();
		});
	});
	
	it("deleteItem_tag - no item", function (done) {
		BL.modelObj = {
			getItem: (data, cb) => {
				return cb(null);
			}
		};
		BL.deleteItem_tag(soajs, {}, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 501);
			done();
		});
	});
	
	it("deleteItem_tag - item locked", function (done) {
		BL.modelObj = {
			getItem: (data, cb) => {
				return cb(null, {
					_id: "123",
					locked: true
				});
			}
		};
		BL.deleteItem_tag(soajs, {}, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 502);
			done();
		});
	});
	
	it("deleteItem_tag - success and remove version", function (done) {
		BL.modelObj = {
			getItem: (data, cb) => {
				return cb(null, {
					_id: "123",
					versions: [{
						version: 1,
						tags: ["1"]
					}]
				});
			},
			deleteItem_version: (data, cb) => {
				return cb(null, true);
			}
		};
		let inputmaskData = {
			tag: "1",
			name: "name",
			type: "type",
		};
		BL.deleteItem_tag(soajs, inputmaskData, {}, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response, true);
			done();
		});
	});
	
	it("deleteItem_tag - success and do not remove version", function (done) {
		BL.modelObj = {
			getItem: (data, cb) => {
				return cb(null, {
					_id: "123",
					versions: [{
						version: 1,
						tags: ["1", "2"]
					}]
				});
			},
			deleteItem_version: (data, cb) => {
				return cb(null, true);
			}
		};
		let inputmaskData = {
			tag: "1",
			name: "name",
			type: "type",
		};
		BL.deleteItem_tag(soajs, inputmaskData, {}, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response, true);
			done();
		});
	});
	
	it("deleteItem_tag - version not found", function (done) {
		BL.modelObj = {
			getItem: (data, cb) => {
				return cb(null, {
					_id: "123",
					versions: [{
						tags: ["1"]
					}]
				});
			},
			deleteItem_version: (data, cb) => {
				return cb(null, true);
			}
		};
		let inputmaskData = {
			tag: "2",
			name: "name",
			type: "type",
		};
		BL.deleteItem_tag(soajs, inputmaskData, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 404);
			done();
		});
	});
	
	it("deleteItem_tag - empty branches", function (done) {
		BL.modelObj = {
			getItem: (data, cb) => {
				return cb(null, {
					_id: "123",
					versions: [{
						version: 1
					}]
				});
			},
			deleteItem_version: (data, cb) => {
				return cb(null);
			}
		};
		let inputmaskData = {
			tag: "1",
			name: "name",
			type: "type",
		};
		BL.deleteItem_tag(soajs, inputmaskData, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 404);
			done();
		});
	});
	
	it("deleteItem_tag - mongo error in delete item", function (done) {
		BL.modelObj = {
			getItem: (data, cb) => {
				return cb(null, {
					_id: "123",
					versions: [{
						version: 1,
						tags: ["1"]
					}]
				});
			},
			deleteItem_version: (data, cb) => {
				return cb(true);
			}
		};
		let inputmaskData = {
			tag: "1",
			name: "name",
			type: "type",
		};
		BL.deleteItem_tag(soajs, inputmaskData, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 602);
			done();
		});
	});
	
	//maintenance
	it("maintenance - fail no inputmaskData", function (done) {
		BL.modelObj = {
			getItem: (data, cb) => {
				return cb(null, {
					_id: "123",
					versions: [{
						version: 1
					}]
				});
			}
		};
		let inputmaskData = null;
		BL.maintenance(soajs, inputmaskData, null, null, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 400);
			done();
		});
	});
	
	it("maintenance - fail mongo error getItem", function (done) {
		BL.modelObj = {
			getItem_by_type: (data, cb) => {
				return cb(true);
			}
		};
		let inputmaskData = {};
		BL.maintenance(soajs, inputmaskData, null, null, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 602);
			done();
		});
	});
	
	it("maintenance - fail mongo not Item", function (done) {
		BL.modelObj = {
			getItem_by_type: (data, cb) => {
				return cb(null, null);
			}
		};
		let inputmaskData = {};
		BL.maintenance(soajs, inputmaskData, null, null, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 418);
			done();
		});
	});
	
	it("maintenance - fail version not found", function (done) {
		BL.modelObj = {
			getItem_by_type: (data, cb) => {
				return cb(null, {
					_id: "123",
					versions: [{
						version: 1
					}]
				});
			}
		};
		let inputmaskData = {
			version: 2
		};
		BL.maintenance(soajs, inputmaskData, null, null, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 418);
			done();
		});
	});
	
	it("maintenance - fail no command object found", function (done) {
		BL.modelObj = {
			getItem_by_type: (data, cb) => {
				return cb(null, {
					_id: "123",
					versions: [{
						version: 1
					}]
				});
			}
		};
		let inputmaskData = {
			name: "test",
			env: "new",
			type: "service",
			port: {
				portType: "inherit"
			},
			version: 1,
			operation: "/command"
		};
		BL.maintenance(soajs, inputmaskData, null, null, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 419);
			done();
		});
	});
	
	it("maintenance - fail command not found", function (done) {
		BL.modelObj = {
			getItem_by_type: (data, cb) => {
				return cb(null, {
					_id: "123",
					versions: [{
						version: 1,
						maintenance: {
							commands: ["/command"]
						}
					}]
				});
			}
		};
		let inputmaskData = {
			name: "test",
			env: "new",
			type: "service",
			port: {
				portType: "inherit"
			},
			version: 1,
			operation: "/notFound"
		};
		BL.maintenance(soajs, inputmaskData, null, null, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 420);
			done();
		});
	});
	
	it("maintenance - fail to get env", function (done) {
		sinon.stub(sdk, 'get_env_registry').callsFake(function fakeFn(soajs, data, cb) {
			return cb(new Error("error"));
		});
		BL.modelObj = {
			getItem_by_type: (data, cb) => {
				return cb(null, {
					_id: "123",
					versions: [{
						version: 1,
						maintenance: {
							commands: [{
								path: "/command"
							}]
						}
					}]
				});
			}
		};
		let inputmaskData = {
			name: "test",
			env: "new",
			type: "service",
			port: {
				portType: "inherit"
			},
			version: 1,
			operation: "/command"
		};
		BL.maintenance(soajs, inputmaskData, null, null, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 400);
			done();
		});
	});
	
	it("maintenance - fail to get env", function (done) {
		sinon.stub(sdk, 'get_env_registry').callsFake(function fakeFn(soajs, data, cb) {
			return cb(null);
		});
		BL.modelObj = {
			getItem_by_type: (data, cb) => {
				return cb(null, {
					_id: "123",
					versions: [{
						version: 1,
						maintenance: {
							commands: [{
								path: "/command"
							}]
						}
					}]
				});
			}
		};
		let inputmaskData = {
			name: "test",
			env: "new",
			type: "service",
			port: {
				portType: "inherit"
			},
			version: 1,
			operation: "/command"
		};
		BL.maintenance(soajs, inputmaskData, null, null, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 550);
			done();
		});
	});
	
	it("maintenance - success manual", function (done) {
		sinon.stub(sdk, 'get_env_registry').callsFake(function fakeFn(soajs, data, cb) {
			return cb(null, {
				code: "DEV",
				deployer: {
					type: "manual",
					selected: "manual",
					manual: {
						nodes: "127.0.0.1"
					}
				},
				services: {
					config: {
						ports: {
							controller: 10000,
							maintenanceInc: 1000,
							randomInc: 100
						}
					}
				}
			});
		});
		let core = {
			core: {
				registry: {
					loadByEnv: (env, cb) => {
						return cb(null, {
							code: "DEV",
							description: "new",
							deployer: {
								type: "manual",
							},
							services: {
								marketplace: {
									port: 4007
								}
							},
							awareness: {
								host: '192.168.5.5'
							},
							serviceConfig: {
								ports: {
									controller: 4000,
									maintenanceInc: 1000
								}
							}
						});
					}
				}
			},
		};
		let inputmaskData = {
			name: "marketplace",
			env: "DEV",
			type: "service",
			port: {
				portType: "inherit"
			},
			version: "1",
			operation: "/heartbeat"
		};
		
		nock('http://192.168.5.5:5000')
			.get('/awarenessStat')
			.reply(200, {
				"result": true,
				"data": {
					services: {
						marketplace: {
							hosts: {
								"1": ["192.168.5.6"]
							}
						}
					}
				}
			});
		
		nock('http://192.168.5.6:4007')
			.get('/heartbeat')
			.reply(200, {
				"result": true,
				"data": [{
					"id": "127.0.0.1",
					"response": {
						"result": true,
						"ts": 1596744199055,
						"service": {"service": "MARKETPLACE", "type": "rest", "route": "/heartbeat"},
						"versions": {
							"core": "4.0.14",
							"service": "1.0.15",
							"dependencies": {"async": "3.2.0", "soajs": "4.0.14"}
						}
					}
				}]
			});
		BL.modelObj = {
			getItem_by_type: (data, cb) => {
				return cb(null, {
					_id: "123",
					name: "marketplace",
					configuration: {
						subType: "soajs",
						group: "Console",
						port: 4007
					},
					versions: [{
						version: "1",
						name: "marketplace",
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
						}
					}]
				});
			}
		};
		
		BL.maintenance(soajs, inputmaskData, null, core, (error, response) => {
			assert.ifError(error);
			assert.ok(response);
			assert.deepEqual(response, [{
				id: "192.168.5.6",
				response: [{
					"id": "127.0.0.1",
					"response": {
						"result": true,
						"ts": 1596744199055,
						"service": {"service": "MARKETPLACE", "type": "rest", "route": "/heartbeat"},
						"versions": {
							"core": "4.0.14",
							"service": "1.0.15",
							"dependencies": {"async": "3.2.0", "soajs": "4.0.14"}
						}
					}
				}]
			}]);
			done();
		});
	});
	
	it("maintenance - success manual maintenance port", function (done) {
		sinon.stub(sdk, 'get_env_registry').callsFake(function fakeFn(soajs, data, cb) {
			return cb(null, {
				code: "DEV",
				deployer: {
					type: "manual",
					selected: "manual",
					manual: {
						nodes: "127.0.0.1"
					}
				},
				services: {
					config: {
						ports: {
							controller: 10000,
							maintenanceInc: 1000,
							randomInc: 100
						}
					}
				}
			});
		});
		let core = {
			core: {
				registry: {
					loadByEnv: (env, cb) => {
						return cb(null, {
							code: "DEV",
							description: "new",
							deployer: {
								type: "manual",
							},
							services: {
								marketplace: {
									port: 4007
								}
							},
							awareness: {
								host: '192.168.5.5'
							},
							serviceConfig: {
								ports: {
									controller: 4000,
									maintenanceInc: 1000
								}
							}
						});
					}
				}
			},
		};
		let inputmaskData = {
			name: "marketplace",
			env: "DEV",
			type: "service",
			port: {
				portType: "maintenance"
			},
			version: "1",
			operation: "/heartbeat"
		};
		
		nock('http://192.168.5.5:5000')
			.get('/awarenessStat')
			.reply(200, {
				"result": true,
				"data": {
					services: {
						marketplace: {
							hosts: {
								"1": ["192.168.5.6"]
							}
						}
					}
				}
			});
		
		nock('http://192.168.5.6:5007')
			.get('/heartbeat')
			.reply(200, {
				"result": true,
				"data": [{
					"id": "127.0.0.1",
					"response": {
						"result": true,
						"ts": 1596744199055,
						"service": {"service": "MARKETPLACE", "type": "rest", "route": "/heartbeat"},
						"versions": {
							"core": "4.0.14",
							"service": "1.0.15",
							"dependencies": {"async": "3.2.0", "soajs": "4.0.14"}
						}
					}
				}]
			});
		BL.modelObj = {
			getItem_by_type: (data, cb) => {
				return cb(null, {
					_id: "123",
					name: "marketplace",
					configuration: {
						subType: "soajs",
						group: "Console",
						port: 4007
					},
					versions: [{
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
						}
					}]
				});
			}
		};
		
		BL.maintenance(soajs, inputmaskData, null, core, (error, response) => {
			assert.ifError(error);
			assert.ok(response);
			assert.deepEqual(response, [{
				id: "192.168.5.6",
				response: [{
					"id": "127.0.0.1",
					"response": {
						"result": true,
						"ts": 1596744199055,
						"service": {"service": "MARKETPLACE", "type": "rest", "route": "/heartbeat"},
						"versions": {
							"core": "4.0.14",
							"service": "1.0.15",
							"dependencies": {"async": "3.2.0", "soajs": "4.0.14"}
						}
					}
				}]
			}]);
			done();
		});
	});
	
	it("maintenance - success manual custom port", function (done) {
		sinon.stub(sdk, 'get_env_registry').callsFake(function fakeFn(soajs, data, cb) {
			return cb(null, {
				code: "DEV",
				deployer: {
					type: "manual",
					selected: "manual",
					manual: {
						nodes: "127.0.0.1"
					}
				},
				services: {
					config: {
						ports: {
							controller: 10000,
							maintenanceInc: 1000,
							randomInc: 100
						}
					}
				}
			});
		});
		let core = {
			core: {
				registry: {
					loadByEnv: (env, cb) => {
						return cb(null, {
							code: "DEV",
							description: "new",
							deployer: {
								type: "manual",
							},
							services: {
								marketplace: {
									port: 4007
								}
							},
							awareness: {
								host: '192.168.5.5'
							},
							serviceConfig: {
								ports: {
									controller: 4000,
									maintenanceInc: 1000
								}
							}
						});
					}
				}
			},
		};
		let inputmaskData = {
			name: "marketplace",
			env: "DEV",
			type: "service",
			port: {
				portType: "custom",
				portValue: "4090",
			},
			version: "1",
			operation: "/heartbeat"
		};
		
		nock('http://192.168.5.5:5000')
			.get('/awarenessStat')
			.reply(200, {
				"result": true,
				"data": {
					services: {
						marketplace: {
							hosts: {
								"1": ["192.168.5.6"]
							}
						}
					}
				}
			});
		
		nock('http://192.168.5.6:4090')
			.get('/heartbeat')
			.reply(200, {
				"result": true,
				"data": [{
					"id": "127.0.0.1",
					"response": {
						"result": true,
						"ts": 1596744199055,
						"service": {"service": "MARKETPLACE", "type": "rest", "route": "/heartbeat"},
						"versions": {
							"core": "4.0.14",
							"service": "1.0.15",
							"dependencies": {"async": "3.2.0", "soajs": "4.0.14"}
						}
					}
				}]
			});
		BL.modelObj = {
			getItem_by_type: (data, cb) => {
				return cb(null, {
					_id: "123",
					name: "marketplace",
					configuration: {
						subType: "soajs",
						group: "Console",
						port: 4007
					},
					versions: [{
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
						}
					}]
				});
			}
		};
		
		BL.maintenance(soajs, inputmaskData, null, core, (error, response) => {
			assert.ifError(error);
			assert.ok(response);
			assert.deepEqual(response, [{
				id: "192.168.5.6",
				response: [{
					"id": "127.0.0.1",
					"response": {
						"result": true,
						"ts": 1596744199055,
						"service": {"service": "MARKETPLACE", "type": "rest", "route": "/heartbeat"},
						"versions": {
							"core": "4.0.14",
							"service": "1.0.15",
							"dependencies": {"async": "3.2.0", "soajs": "4.0.14"}
						}
					}
				}]
			}]);
			done();
		});
	});
	
	it("maintenance - fail to computePort - error in registry", function (done) {
		sinon.stub(sdk, 'get_env_registry').callsFake(function fakeFn(soajs, data, cb) {
			return cb(null, {
				code: "DEV",
				deployer: {
					type: "manual",
					selected: "manual",
					manual: {
						nodes: "127.0.0.1"
					}
				},
				services: {
					config: {
						ports: {
							controller: 10000,
							maintenanceInc: 1000,
							randomInc: 100
						}
					}
				}
			});
		});
		let core = {
			core: {
				registry: {
					loadByEnv: (env, cb) => {
						return cb(new Error("err"));
					}
				}
			},
		};
		let inputmaskData = {
			name: "marketplace",
			env: "DEV",
			type: "service",
			port: {
				portType: "maintenance"
			},
			version: "1",
			operation: "/heartbeat"
		};
		
		nock('http://192.168.5.5:5000')
			.get('/awarenessStat')
			.reply(200, {
				"result": true,
				"data": {
					services: {
						marketplace: {
							hosts: {
								"1": ["192.168.5.6"]
							}
						}
					}
				}
			});
		
		nock('http://192.168.5.6:5007')
			.get('/heartbeat')
			.reply(200, {
				"result": true,
				"data": [{
					"id": "127.0.0.1",
					"response": {
						"result": true,
						"ts": 1596744199055,
						"service": {"service": "MARKETPLACE", "type": "rest", "route": "/heartbeat"},
						"versions": {
							"core": "4.0.14",
							"service": "1.0.15",
							"dependencies": {"async": "3.2.0", "soajs": "4.0.14"}
						}
					}
				}]
			});
		BL.modelObj = {
			getItem_by_type: (data, cb) => {
				return cb(null, {
					_id: "123",
					configuration: {
						subType: "soajs",
						group: "Console",
						port: 4007
					},
					versions: [{
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
						}
					}]
				});
			}
		};
		
		BL.maintenance(soajs, inputmaskData, null, core, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 400);
			done();
		});
	});
	
	it("maintenance - fail to computePort - empty registry", function (done) {
		sinon.stub(sdk, 'get_env_registry').callsFake(function fakeFn(soajs, data, cb) {
			return cb(null, {
				code: "DEV",
				deployer: {
					type: "manual",
					selected: "manual",
					manual: {
						nodes: "127.0.0.1"
					}
				},
				services: {
					config: {
						ports: {
							controller: 10000,
							maintenanceInc: 1000,
							randomInc: 100
						}
					}
				}
			});
		});
		let core = {
			core: {
				registry: {
					loadByEnv: (env, cb) => {
						return cb(null, null);
					}
				}
			},
		};
		let inputmaskData = {
			name: "marketplace",
			env: "DEV",
			type: "service",
			port: {
				portType: "maintenance"
			},
			version: "1",
			operation: "/heartbeat"
		};
		
		nock('http://192.168.5.5:5000')
			.get('/awarenessStat')
			.reply(200, {
				"result": true,
				"data": {
					services: {
						marketplace: {
							hosts: {
								"1": ["192.168.5.6"]
							}
						}
					}
				}
			});
		
		nock('http://192.168.5.6:5007')
			.get('/heartbeat')
			.reply(200, {
				"result": true,
				"data": [{
					"id": "127.0.0.1",
					"response": {
						"result": true,
						"ts": 1596744199055,
						"service": {"service": "MARKETPLACE", "type": "rest", "route": "/heartbeat"},
						"versions": {
							"core": "4.0.14",
							"service": "1.0.15",
							"dependencies": {"async": "3.2.0", "soajs": "4.0.14"}
						}
					}
				}]
			});
		BL.modelObj = {
			getItem_by_type: (data, cb) => {
				return cb(null, {
					_id: "123",
					configuration: {
						subType: "soajs",
						group: "Console",
						port: 4007
					},
					versions: [{
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
						}
					}]
				});
			}
		};
		
		BL.maintenance(soajs, inputmaskData, null, core, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 550);
			done();
		});
	});
	
	it("maintenance - manualOperation - awarenessStat failed", function (done) {
		sinon.stub(sdk, 'get_env_registry').callsFake(function fakeFn(soajs, data, cb) {
			return cb(null, {
				code: "DEV",
				deployer: {
					type: "manual",
					selected: "manual",
					manual: {
						nodes: "127.0.0.1"
					}
				},
				services: {
					config: {
						ports: {
							controller: 10000,
							maintenanceInc: 1000,
							randomInc: 100
						}
					}
				}
			});
		});
		let core = {
			core: {
				registry: {
					loadByEnv: (env, cb) => {
						return cb(null, {
							code: "DEV",
							description: "new",
							deployer: {
								type: "manual",
							},
							services: {
								marketplace: {
									port: 4007
								}
							},
							awareness: {
								host: '192.168.5.5'
							},
							serviceConfig: {
								ports: {
									controller: 4000,
									maintenanceInc: 1000
								}
							}
						});
					}
				}
			},
		};
		let inputmaskData = {
			name: "marketplace",
			env: "DEV",
			type: "service",
			port: {
				portType: "maintenance"
			},
			version: "1",
			operation: "/heartbeat"
		};
		
		nock('http://192.168.5.5:5000')
			.get('/awarenessStat')
			.reply(200, {
				"result": false
			});
		
		nock('http://192.168.5.6:5007')
			.get('/heartbeat')
			.reply(200, {
				"result": true,
				"data": [{
					"id": "127.0.0.1",
					"response": {
						"result": true,
						"ts": 1596744199055,
						"service": {"service": "MARKETPLACE", "type": "rest", "route": "/heartbeat"},
						"versions": {
							"core": "4.0.14",
							"service": "1.0.15",
							"dependencies": {"async": "3.2.0", "soajs": "4.0.14"}
						}
					}
				}]
			});
		BL.modelObj = {
			getItem_by_type: (data, cb) => {
				return cb(null, {
					_id: "123",
					configuration: {
						subType: "soajs",
						group: "Console",
						port: 4007
					},
					versions: [{
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
						}
					}]
				});
			}
		};
		
		BL.maintenance(soajs, inputmaskData, null, core, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 421);
			done();
		});
	});
	
	it("maintenance - fail manualOperation service not started", function (done) {
		sinon.stub(sdk, 'get_env_registry').callsFake(function fakeFn(soajs, data, cb) {
			return cb(null, {
				code: "DEV",
				deployer: {
					type: "manual",
					selected: "manual",
					manual: {
						nodes: "127.0.0.1"
					}
				},
				services: {
					config: {
						ports: {
							controller: 10000,
							maintenanceInc: 1000,
							randomInc: 100
						}
					}
				}
			});
		});
		let core = {
			core: {
				registry: {
					loadByEnv: (env, cb) => {
						return cb(null, {
							code: "DEV",
							description: "new",
							deployer: {
								type: "manual",
							},
							services: {
								marketplace: {
									port: 4007
								}
							},
							awareness: {
								host: '192.168.5.5'
							},
							serviceConfig: {
								ports: {
									controller: 4000,
									maintenanceInc: 1000
								}
							}
						});
					}
				}
			},
		};
		let inputmaskData = {
			name: "marketplace",
			env: "DEV",
			type: "service",
			port: {
				portType: "maintenance"
			},
			version: "1",
			operation: "/heartbeat"
		};
		
		nock('http://192.168.5.5:5000')
			.get('/awarenessStat')
			.reply(200, {
				"result": true,
				"data": {
					services: {
						console: {
							hosts: {
								"1": ["192.168.5.6"]
							}
						}
					}
				}
			});
		
		nock('http://192.168.5.6:5007')
			.get('/heartbeat')
			.reply(200, {
				"result": true,
				"data": [{
					"id": "127.0.0.1",
					"response": {
						"result": true,
						"ts": 1596744199055,
						"service": {"service": "MARKETPLACE", "type": "rest", "route": "/heartbeat"},
						"versions": {
							"core": "4.0.14",
							"service": "1.0.15",
							"dependencies": {"async": "3.2.0", "soajs": "4.0.14"}
						}
					}
				}]
			});
		BL.modelObj = {
			getItem_by_type: (data, cb) => {
				return cb(null, {
					_id: "123",
					configuration: {
						subType: "soajs",
						group: "Console",
						port: 4007
					},
					versions: [{
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
						}
					}]
				});
			}
		};
		
		BL.maintenance(soajs, inputmaskData, null, core, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 421);
			done();
		});
	});
	
	it("maintenance - fail manualOperation error executing operation", function (done) {
		sinon.stub(sdk, 'get_env_registry').callsFake(function fakeFn(soajs, data, cb) {
			return cb(null, {
				code: "DEV",
				deployer: {
					type: "manual",
					selected: "manual",
					manual: {
						nodes: "127.0.0.1"
					}
				},
				services: {
					config: {
						ports: {
							controller: 10000,
							maintenanceInc: 1000,
							randomInc: 100
						}
					}
				}
			});
		});
		let core = {
			core: {
				registry: {
					loadByEnv: (env, cb) => {
						return cb(null, {
							code: "DEV",
							description: "new",
							deployer: {
								type: "manual",
							},
							services: {
								marketplace: {
									port: 4007
								}
							},
							awareness: {
								host: '192.168.5.5'
							},
							serviceConfig: {
								ports: {
									controller: 4000,
									maintenanceInc: 1000
								}
							}
						});
					}
				}
			},
		};
		let inputmaskData = {
			name: "marketplace",
			env: "DEV",
			type: "service",
			port: {
				portType: "maintenance"
			},
			version: "1",
			operation: "/heartbeat"
		};
		
		nock('http://192.168.5.5:5000')
			.get('/awarenessStat')
			.reply(200, {
				"result": true,
				"data": {
					services: {
						marketplace: {
							hosts: {
								"1": ["192.168.5.6"]
							}
						}
					}
				}
			});
		
		nock('http://192.168.5.6:5007')
			.get('/heartbeat')
			.reply(200, {
				"result": false
			});
		BL.modelObj = {
			getItem_by_type: (data, cb) => {
				return cb(null, {
					_id: "123",
					configuration: {
						subType: "soajs",
						group: "Console",
						port: 4007
					},
					versions: [{
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
						}
					}]
				});
			}
		};
		
		BL.maintenance(soajs, inputmaskData, null, core, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 421);
			done();
		});
	});
	
	it("maintenance - success container", function (done) {
		sinon.stub(sdk, 'get_env_registry').callsFake(function fakeFn(soajs, data, cb) {
			return cb(null, {
				code: "NEW",
				description: "new",
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
				services: {
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
		let inputmaskData = {
			name: "test",
			env: "NEW",
			type: "service",
			port: {
				portType: "inherit"
			},
			version: 1,
			operation: "/heartbeat"
		};
		
		nock('http://www.example.com')
			.put('/kubernetes/item/maintenance')
			.reply(200, {
				"result": true,
				"data": [{
					"id": "127.0.0.1",
					"response": {
						"result": true,
						"ts": 1596744199055,
						"service": {"service": "MARKETPLACE", "type": "rest", "route": "/heartbeat"},
						"versions": {
							"core": "4.0.14",
							"service": "1.0.15",
							"dependencies": {"async": "3.2.0", "soajs": "4.0.14"}
						}
					}
				}]
			});
		BL.modelObj = {
			getItem_by_type: (data, cb) => {
				return cb(null, {
					_id: "123",
					configuration: {
						subType: "soajs",
						group: "Console",
						port: 4007
					},
					versions: [{
						version: 1,
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
						}
					}]
				});
			}
		};
		
		BL.maintenance(soajs, inputmaskData, null, null, (error, response) => {
			assert.ifError(error);
			assert.ok(response);
			assert.deepEqual(response, [
				{
					"id": "127.0.0.1",
					"response": {
						"result": true,
						"ts": 1596744199055,
						"service": {
							"service": "MARKETPLACE",
							"type": "rest",
							"route": "/heartbeat"
						},
						"versions": {
							"core": "4.0.14",
							"service": "1.0.15",
							"dependencies": {
								"async": "3.2.0",
								"soajs": "4.0.14"
							}
						}
					}
				}
			]);
			done();
		});
	});
	
	it("maintenance - success container maintenance port", function (done) {
		sinon.stub(sdk, 'get_env_registry').callsFake(function fakeFn(soajs, data, cb) {
			return cb(null, {
				code: "NEW",
				description: "new",
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
				services: {
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
		let inputmaskData = {
			name: "test",
			env: "NEW",
			type: "service",
			port: {
				portType: "maintenance",
			},
			version: 1,
			operation: "/heartbeat"
		};
		
		nock('http://www.example.com')
			.put('/kubernetes/item/maintenance')
			.reply(200, {
				"result": true,
				"data": [{
					"id": "127.0.0.1",
					"response": {
						"result": true,
						"ts": 1596744199055,
						"service": {"service": "MARKETPLACE", "type": "rest", "route": "/heartbeat"},
						"versions": {
							"core": "4.0.14",
							"service": "1.0.15",
							"dependencies": {"async": "3.2.0", "soajs": "4.0.14"}
						}
					}
				}]
			});
		BL.modelObj = {
			getItem_by_type: (data, cb) => {
				return cb(null, {
					_id: "123",
					configuration: {
						subType: "soajs",
						group: "Console",
						port: 4007
					},
					versions: [{
						version: 1,
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
						}
					}]
				});
			}
		};
		
		BL.maintenance(soajs, inputmaskData, null, null, (error, response) => {
			assert.ifError(error);
			assert.ok(response);
			assert.deepEqual(response, [
				{
					"id": "127.0.0.1",
					"response": {
						"result": true,
						"ts": 1596744199055,
						"service": {
							"service": "MARKETPLACE",
							"type": "rest",
							"route": "/heartbeat"
						},
						"versions": {
							"core": "4.0.14",
							"service": "1.0.15",
							"dependencies": {
								"async": "3.2.0",
								"soajs": "4.0.14"
							}
						}
					}
				}
			]);
			done();
		});
	});
	
	it("maintenance - success container custom port", function (done) {
		sinon.stub(sdk, 'get_env_registry').callsFake(function fakeFn(soajs, data, cb) {
			return cb(null, {
				code: "NEW",
				description: "new",
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
				services: {
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
		let inputmaskData = {
			name: "test",
			env: "NEW",
			type: "service",
			port: {
				portType: "custom",
				portValue: "4032",
			},
			version: 1,
			operation: "/heartbeat"
		};
		
		nock('http://www.example.com')
			.put('/kubernetes/item/maintenance')
			.reply(200, {
				"result": true,
				"data": [{
					"id": "127.0.0.1",
					"response": {
						"result": true,
						"ts": 1596744199055,
						"service": {"service": "MARKETPLACE", "type": "rest", "route": "/heartbeat"},
						"versions": {
							"core": "4.0.14",
							"service": "1.0.15",
							"dependencies": {"async": "3.2.0", "soajs": "4.0.14"}
						}
					}
				}]
			});
		BL.modelObj = {
			getItem_by_type: (data, cb) => {
				return cb(null, {
					_id: "123",
					configuration: {
						subType: "soajs",
						group: "Console",
						port: 4007
					},
					versions: [{
						version: 1,
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
						}
					}]
				});
			}
		};
		
		BL.maintenance(soajs, inputmaskData, null, null, (error, response) => {
			assert.ifError(error);
			assert.ok(response);
			assert.deepEqual(response, [
				{
					"id": "127.0.0.1",
					"response": {
						"result": true,
						"ts": 1596744199055,
						"service": {
							"service": "MARKETPLACE",
							"type": "rest",
							"route": "/heartbeat"
						},
						"versions": {
							"core": "4.0.14",
							"service": "1.0.15",
							"dependencies": {
								"async": "3.2.0",
								"soajs": "4.0.14"
							}
						}
					}
				}
			]);
			done();
		});
	});
	
	it("maintenance - fail containerOperation in operation", function (done) {
		sinon.stub(sdk, 'get_env_registry').callsFake(function fakeFn(soajs, data, cb) {
			return cb(null, {
				code: "NEW",
				description: "new",
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
				services: {
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
		let inputmaskData = {
			name: "test",
			env: "NEW",
			type: "service",
			port: {
				portType: "inherit"
			},
			version: 1,
			operation: "/heartbeat"
		};
		
		nock('http://www.example.com')
			.put('/kubernetes/item/maintenance')
			.reply(200, {
				"result": false
			});
		BL.modelObj = {
			getItem_by_type: (data, cb) => {
				return cb(null, {
					_id: "123",
					configuration: {
						subType: "soajs",
						group: "Console",
						port: 4007
					},
					versions: [{
						version: 1,
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
						}
					}]
				});
			}
		};
		
		BL.maintenance(soajs, inputmaskData, null, null, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 421);
			done();
		});
	});
	
	it("maintenance - fail containerOperation in awareness", function (done) {
		sinon.stub(sdk, 'get_env_registry').callsFake(function fakeFn(soajs, data, cb) {
			return cb(null, {
				code: "NEW",
				description: "new",
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
				services: {
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
		let inputmaskData = {
			name: "test",
			env: "NEW",
			type: "service",
			port: {
				portType: "inherit"
			},
			version: "666",
			operation: "/heartbeat"
		};
		
		nock('http://www.example.com')
			.put('/kubernetes/item/maintenance')
			.reply(200, {
				"result": true,
				"data": [{
					"id": "127.0.0.1",
					"response": {
						"result": true,
						"ts": 1596744199055,
						"service": {"service": "MARKETPLACE", "type": "rest", "route": "/heartbeat"},
						"versions": {
							"core": "4.0.14",
							"service": "1.0.15",
							"dependencies": {"async": "3.2.0", "soajs": "4.0.14"}
						}
					}
				}]
			});
		BL.modelObj = {
			getItem_by_type: (data, cb) => {
				return cb(null, {
					_id: "123",
					configuration: {
						subType: "soajs",
						group: "Console",
						port: 4007
					},
					versions: [{
						version: "666",
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
						}
					}]
				});
			}
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
		
		BL.maintenance(soajs, inputmaskData, null, null, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 421);
			done();
		});
	});
	
	//addItem
	it("addItem - fail no inputmaskData", function (done) {
		const service = helper.requireModule('driver/service/index.js');
		sinon.stub(service, 'checkCanUpdate').callsFake(function fakeFn(data, cb) {
			return cb(null);
		});
		sinon.stub(service, 'createCatalog').callsFake(function fakeFn(data, cb) {
			return cb({"name": "test"});
		});
		
		BL.modelObj = {
			getItem: (data, cb) => {
				return cb(null, null);
			},
			addItem: (data, cb) => {
				return cb(null, {n: 1});
			}
		};
		BL.addItem(soajs, null, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 400);
			done();
		});
	});
	
	it("addItem - item not found success", function (done) {
		const service = helper.requireModule('driver/service/index.js');
		sinon.stub(service, 'checkCanUpdate').callsFake(function fakeFn(data, cb) {
			return cb(null);
		});
		sinon.stub(service, 'createCatalog').callsFake(function fakeFn(data, cb) {
			return cb({"name": "test"});
		});
		
		BL.modelObj = {
			getItem: (data, cb) => {
				return cb(null, null);
			},
			addItem: (data, cb) => {
				return cb(null, {n: 1});
			}
		};
		let inputmaskData = {
			"item": {
				"src": {
					"provider": "github",
					"owner": "test",
					"repo": "soajs.test",
					"branch": "master"
				},
				"soa" :{
					"name": "test",
					"type": "service"
				}
			}
		};
		BL.addItem(soajs, inputmaskData, {}, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response, "Catalog Entry Successfully Added!");
			done();
		});
	});
	
	it("addItem - item found success", function (done) {
		const service = helper.requireModule('driver/service/index.js');
		sinon.stub(service, 'checkCanUpdate').callsFake(function fakeFn(data, cb) {
			return cb(null);
		});
		sinon.stub(service, 'createCatalog').callsFake(function fakeFn(data, cb) {
			return cb({"name": "test"});
		});
		
		BL.modelObj = {
			getItem: (data, cb) => {
				return cb(null, {"_id": 1});
			},
			addItem: (data, cb) => {
				return cb(null, {n: 1});
			}
		};
		let inputmaskData = {
			"item": {
				"src": {
					"provider": "github",
					"owner": "test",
					"repo": "soajs.test",
					"branch": "master"
				},
				"soa" :{
					"name": "test",
					"type": "service"
				}
			}
		};
		BL.addItem(soajs, inputmaskData, {}, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response, "Catalog Entry Successfully updated!");
			done();
		});
	});
	
	it("addItem - subtype soajs success", function (done) {
		const service = helper.requireModule('driver/soajs/index.js');
		sinon.stub(service, 'checkCanUpdate').callsFake(function fakeFn(data, cb) {
			return cb(null);
		});
		sinon.stub(service, 'createCatalog').callsFake(function fakeFn(data, cb) {
			return cb({"name": "test"});
		});
		
		BL.modelObj = {
			getItem: (data, cb) => {
				return cb(null, null);
			},
			addItem: (data, cb) => {
				return cb(null, {n: 1});
			}
		};
		let inputmaskData = {
			"item": {
				"src": {
					"provider": "github",
					"owner": "test",
					"repo": "soajs.test",
					"branch": "master"
				},
				"soa" :{
					"name": "test",
					"type": "service",
					"subType": "soajs"
				}
			}
		};
		BL.addItem(soajs, inputmaskData, {}, (error, response) => {
			assert.ifError(error);
			assert.deepEqual(response, "Catalog Entry Successfully Added!");
			done();
		});
	});
	
	it("addItem - fail missing tag or branch", function (done) {
		const service = helper.requireModule('driver/soajs/index.js');
		sinon.stub(service, 'checkCanUpdate').callsFake(function fakeFn(data, cb) {
			return cb(null);
		});
		sinon.stub(service, 'createCatalog').callsFake(function fakeFn(data, cb) {
			return cb({"name": "test"});
		});
		
		BL.modelObj = {
			getItem: (data, cb) => {
				return cb(null, null);
			},
			addItem: (data, cb) => {
				return cb(null, {n: 1});
			}
		};
		let inputmaskData = {
			"item": {
				"src": {
					"provider": "github",
					"owner": "test",
					"repo": "soajs.test"
				},
				"soa" :{
					"name": "test",
					"type": "service",
					"subType": "soajs"
				}
			}
		};
		BL.addItem(soajs, inputmaskData, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 402);
			done();
		});
	});
	
	it("addItem - fail mongo error getItem", function (done) {
		const service = helper.requireModule('driver/soajs/index.js');
		sinon.stub(service, 'checkCanUpdate').callsFake(function fakeFn(data, cb) {
			return cb(null);
		});
		sinon.stub(service, 'createCatalog').callsFake(function fakeFn(data, cb) {
			return cb({"name": "test"});
		});
		
		BL.modelObj = {
			getItem: (data, cb) => {
				return cb(new Error("mongo error"), null);
			},
			addItem: (data, cb) => {
				return cb(null, {n: 1});
			}
		};
		let inputmaskData = {
			"item": {
				"src": {
					"provider": "github",
					"owner": "test",
					"repo": "soajs.test",
					"branch": "master"
				},
				"soa" :{
					"name": "test",
					"type": "service",
					"subType": "soajs"
				}
			}
		};
		BL.addItem(soajs, inputmaskData, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 602);
			done();
		});
	});
	
	it("addItem - fail mongo error addItem", function (done) {
		const service = helper.requireModule('driver/soajs/index.js');
		sinon.stub(service, 'checkCanUpdate').callsFake(function fakeFn(data, cb) {
			return cb(null);
		});
		sinon.stub(service, 'createCatalog').callsFake(function fakeFn(data, cb) {
			return cb({"name": "test"});
		});
		
		BL.modelObj = {
			getItem: (data, cb) => {
				return cb(null, null);
			},
			addItem: (data, cb) => {
				return cb(new Error("mongo error"), {n: 1});
			}
		};
		let inputmaskData = {
			"item": {
				"src": {
					"provider": "github",
					"owner": "test",
					"repo": "soajs.test",
					"branch": "master"
				},
				"soa" :{
					"name": "test",
					"type": "service",
					"subType": "soajs"
				}
			}
		};
		BL.addItem(soajs, inputmaskData, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 602);
			done();
		});
	});
	
	it("addItem - fail no change addItem", function (done) {
		const service = helper.requireModule('driver/soajs/index.js');
		sinon.stub(service, 'checkCanUpdate').callsFake(function fakeFn(data, cb) {
			return cb(null);
		});
		sinon.stub(service, 'createCatalog').callsFake(function fakeFn(data, cb) {
			return cb({"name": "test"});
		});
		
		BL.modelObj = {
			getItem: (data, cb) => {
				return cb(null, null);
			},
			addItem: (data, cb) => {
				return cb(null, {n: 0});
			}
		};
		let inputmaskData = {
			"item": {
				"src": {
					"provider": "github",
					"owner": "test",
					"repo": "soajs.test",
					"branch": "master"
				},
				"soa" :{
					"name": "test",
					"type": "service",
					"subType": "soajs"
				}
			}
		};
		BL.addItem(soajs, inputmaskData, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 500);
			done();
		});
	});
	
	it("addItem - checkCanUpdate fail", function (done) {
		const service = helper.requireModule('driver/soajs/index.js');
		sinon.stub(service, 'checkCanUpdate').callsFake(function fakeFn(data, cb) {
			return cb(new Error("can not be updated!"));
		});
		sinon.stub(service, 'createCatalog').callsFake(function fakeFn(data, cb) {
			return cb({"name": "test"});
		});
		
		BL.modelObj = {
			getItem: (data, cb) => {
				return cb(null, null);
			},
			addItem: (data, cb) => {
				return cb(null, {n: 0});
			}
		};
		let inputmaskData = {
			"item": {
				"src": {
					"provider": "github",
					"owner": "test",
					"repo": "soajs.test",
					"branch": "master"
				},
				"soa" :{
					"name": "test",
					"type": "service",
					"subType": "soajs"
				}
			}
		};
		BL.addItem(soajs, inputmaskData, {}, (error) => {
			assert.ok(error);
			assert.deepEqual(error.code, 401);
			done();
		});
	});
});