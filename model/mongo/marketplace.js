
/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";
//const colName = "marketplace";
const core = require("soajs");
//const async = require("async");
const Mongo = core.mongo;

let indexing = {};

function Marketplace(service, options, mongoCore) {
    let __self = this;

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


        service.log.debug("Marketplace: Indexes for " + index + " Updated!");
    }
}



Marketplace.prototype.closeConnection = function () {
    let __self = this;
    __self.mongoCore.closeDb();
};

module.exports = Marketplace;