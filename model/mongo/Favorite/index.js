/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";
const colName = "favorite";
const core = require("soajs");
const Mongo = core.mongo;

let indexing = {};

function Favorite(service, options, mongoCore) {
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

		let index = "default";
		if (options && options.index) {
			index = options.index;
		}
		if (indexing && !indexing[index]) {
			indexing[index] = true;

			__self.mongoCore.createIndex(colName, {'type': 1, 'userid': 1}, {}, (err, index) => {
				service.log.debug("Index: " + index + " created with error: " + err);
			});

			service.log.debug("favorite: Indexes for " + index + " Updated!");
		}
	}
}

// Export collection name for use in operations
Favorite.colName = colName;

// Load all operation methods
require('./add.js')(Favorite);
require('./get.js')(Favorite);
require('./delete.js')(Favorite);
require('./closeConnection.js')(Favorite);

module.exports = Favorite;
