'use strict';

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

module.exports = {
	"redeploy": require('./redeploy.js'),
	"cd": require('./cd.js'),
	"deploy": require('./deploy.js'),
	"saveConfigurationAndDeploy": require('./saveConfigurationAndDeploy.js'),
	"saveConfiguration": require('./saveConfiguration.js'),
	"inspect": require('./inspect.js')
};
