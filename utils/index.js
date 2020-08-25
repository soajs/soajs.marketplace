/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

'use strict';

let utils = require("./helper.js");
const async = require("async");

let lib = {
	"generateSchemas": (data, cb) => {
		let swaggerJSON = data.swagger;
		if (!swaggerJSON){
			return cb(null);
		}
		utils.validateJSON(swaggerJSON);
		utils.mapAPis(swaggerJSON, (schema) => {
			let files = {
				data: schema,
				tokens: {
					dirname: "__dirname"
				}
			};
			utils.generateFiles(files, (err, finalSchema) => {
				data.schema = finalSchema.schema;
				data.schema = utils.extractAPIsList(finalSchema.schema);
				return cb(err);
			});
		});
	},
	"normalizeKeyValues": function (record, regex, replacementString, cb) {
		let updatedRecord = {};
		let replacementRegex = new RegExp(regex, 'g');
		async.eachOf(record, function (oneRecordEntry, key, callback) {
			if (key.match(replacementRegex)) {
				updatedRecord[key.replace(replacementRegex, replacementString)] = oneRecordEntry;
			}
			else {
				updatedRecord[key] = oneRecordEntry;
			}
			
			return callback();
		}, function () {
			return cb(null, updatedRecord);
		});
	},
};

module.exports = lib;