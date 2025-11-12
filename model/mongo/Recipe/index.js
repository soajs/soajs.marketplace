/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";
const colName = "catalogs";
const core = require("soajs");
const Mongo = core.mongo;

let indexing = {};

function Recipe(service, options, mongoCore) {
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
		service.log.debug("Recipe: Indexes for " + index + " Updated!");
	}
}

// Export collection name for use in operations
Recipe.colName = colName;

// Load all operation methods
require('./validateId.js')(Recipe);
require('./getItem_by_id.js')(Recipe);
require('./getItems.js')(Recipe);
require('./getItems_by_ids.js')(Recipe);
require('./addItem.js')(Recipe);
require('./editItem.js')(Recipe);
require('./deleteItem.js')(Recipe);
require('./closeConnection.js')(Recipe);

module.exports = Recipe;
