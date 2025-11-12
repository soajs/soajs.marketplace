/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";
const colName = "marketplace";
const core = require("soajs");
const Mongo = core.mongo;

let indexing = {};

function Marketplace(service, options, mongoCore) {
	let __self = this;
	if (__self.log) {
		__self.log = service.log;
	} else {
		__self.log = (log) => {
			console.log(log);
		};
	}

	if (mongoCore) {
		__self.mongoCore = mongoCore;
	}
	if (!__self.mongoCore) {
		if (options && options.dbConfig) {
			__self.mongoCore = new Mongo(options.dbConfig);
		} else {
			let registry = service.registry.get();
			__self.mongoCore = new Mongo(registry.coreDB.provision);
		}
	}
	let index = "default";
	if (options && options.index) {
		index = options.index;
	}
	if (indexing && !indexing[index]) {
		indexing[index] = true;

		__self.mongoCore.createIndex(colName, {
			"name": "text",
			"description": "text",
			"configuration.subType": 1,
			"type": 1,
			"settings.acl.groups.type": 1
		}, {"name": "name_description_subType_type"}, (err, index) => {
			service.log.debug("Index: " + index + " created with error: " + err);
		});

		__self.mongoCore.createIndex(colName, {
			"type": 1,
			"configuration.subType": 1,
			"settings.acl.groups.type": 1
		}, {"name": "type_subType"}, (err, index) => {
			service.log.debug("Index: " + index + " created with error: " + err);
		});

		__self.mongoCore.createIndex(colName, {
			"configuration.subType": 1,
			"settings.acl.groups.type": 1
		}, {"name": "subType"}, (err, index) => {
			service.log.debug("Index: " + index + " created with error: " + err);
		});

		__self.mongoCore.createIndex(colName, {
			"_id": 1,
			"configuration.subType": 1
		}, {}, (err, index) => {
			service.log.debug("Index: " + index + " created with error: " + err);
		});

		__self.mongoCore.createIndex(colName, {
			"name": 1,
			"type": 1
		}, {unique: true}, (err, index) => {
			service.log.debug("Index: " + index + " created with error: " + err);
		});

		__self.mongoCore.createIndex(colName,
			{'source.provider': 1, "source.name": 1, "source.owner": 1},
			{
				unique: true,
				partialFilterExpression: {
					"source.owner": {
						"$exists": true
					},
					"source.provider": {
						"$exists": true
					},
					"source.name": {
						"$exists": true
					}
				}
			}, (err, index) => {
				service.log.debug("Index: " + index + " created with error: " + err);
			});
	}
}

// Export collection name for use in operations
Marketplace.colName = colName;

// Load all operation methods
require('./getItems_by_keywords.js')(Marketplace);
require('./getItems_by_type_subtype.js')(Marketplace);
require('./getItem_by_source.js')(Marketplace);
require('./getItem_by_type.js')(Marketplace);
require('./getItem_by_names.js')(Marketplace);
require('./updateItem_recipes.js')(Marketplace);
require('./updateItem_environments.js')(Marketplace);
require('./updateItem_acl.js')(Marketplace);
require('./addItem.js')(Marketplace);
require('./check_if_can_access.js')(Marketplace);
require('./check_can_access.js')(Marketplace);
require('./add_acl_2_condition.js')(Marketplace);
require('./getItem.js')(Marketplace);
require('./deleteItem.js')(Marketplace);
require('./deleteItem_source.js')(Marketplace);
require('./update_items_branches.js')(Marketplace);
require('./deleteItem_version.js')(Marketplace);
require('./update_item_version_config.js')(Marketplace);
require('./update_item_configuration.js')(Marketplace);
require('./validateId.js')(Marketplace);
require('./closeConnection.js')(Marketplace);

module.exports = Marketplace;
