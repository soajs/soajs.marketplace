/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

'use strict';

let utils = require("./helper.js");

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
};

module.exports = lib;