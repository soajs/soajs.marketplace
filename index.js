'use strict';

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const soajs = require('soajs');

let config = require('./config.js');
config.packagejson = require("./package.json");

const bl = require("./bl/index.js");

const service = new soajs.server.service(config);

service.init(() => {
	bl.init(service, config, (error) => {
		if (error) {
			throw new Error('Failed starting service');
		}
		
		//GET methods
		
		//DELETE methods
		
		
		//PUT methods
		
		//POST methods
		
		service.start();
	});
});