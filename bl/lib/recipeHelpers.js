'use strict';

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const async = require('async');

let bl;

function validateSourceCodeAttachment(soajs, catalog, cb) {
	if (catalog.recipe.deployOptions.sourceCode) {
		if (catalog.recipe.deployOptions.sourceCode.configuration) {

			if (!catalog.recipe.deployOptions.sourceCode.configuration.label) {
				return cb(bl.handleError(soajs, 430, null));
			}

			if (catalog.recipe.deployOptions.sourceCode.configuration.catalog && (!catalog.recipe.deployOptions.sourceCode.configuration.branch || !catalog.recipe.deployOptions.sourceCode.configuration.version)) {
				return cb(bl.handleError(soajs, 430, null));
			}
		}
	}
	return cb();
}

function checkPorts(soajs, catalog, cb) {
	if (!catalog.recipe.deployOptions || !catalog.recipe.deployOptions.ports || catalog.recipe.deployOptions.ports.length === 0) {
		return cb();
	}

	let type;
	let ports = catalog.recipe.deployOptions.ports;
	async.each(ports, function (onePort, callback) {
		/**
		 validate port schema
		 isPublished value should be provided
		 multiple port object schema is invalid
		 isPublished false ==> no published ports
		 isPublished true && published ==> nodeport
		 isPublished false && published ==> loadbalancer
		 */
		let temp;
		if (onePort.isPublished || onePort.published) {
			temp = onePort.published ? "nodeport" : "loadbalancer";
			if (!type) {
				type = temp;
			} else if (type !== temp) {
				return callback({invalidPorts: true});
			}
		}

		//if isPublished is set to false and published port is set delete published port
		if (!onePort.isPublished && onePort.published) {
			delete onePort.published;
		}

		if (!onePort.published) {
			return callback();
		}

		if (onePort.published && onePort.published < bl.localConfig.kubePorts.minPort || onePort.published > bl.localConfig.kubePorts.maxPort) {
			return callback({wrongPort: onePort});
		}
		return callback();
	}, function (error) {
		if (error) {
			if (error.wrongPort) {
				return cb(bl.handleError(soajs, 431, null));
			}
			if (error.invalidPorts) {
				return cb(bl.handleError(soajs, 432, null));
			}
		} else {
			return cb();
		}
	});
}

module.exports = function(_bl) {
	bl = _bl;
	return {
		validateSourceCodeAttachment,
		checkPorts
	};
};
