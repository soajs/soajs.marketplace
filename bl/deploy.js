'use strict';

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */


let bl = null;
let local = {
	
	"redeploy": (soajs, inputmaskData, options, cb) => {
		
		return cb(null, true);
	},
	"cd": (soajs, inputmaskData, options, cb) => {
		
		return cb(null, true);
	},
	"deploy": (soajs, inputmaskData, options, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs, options);
		modelObj.getItem(inputmaskData, (err, response) => {
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!response) {
				return cb(bl.handleError(soajs, 501, null));
			}
			/*
			1- inspect item deployment from infra ms
			2- check if API_REGISTRY is needed to inspect gateway from infra ms
			3- get the computed env variables
			4- get item saved deploy configuration
			5- resolve computed variables
			6- deploy, this should call infra ms
			 */
			return cb(null, true);
		});
	},
	"saveConfigurationAndDeploy": (soajs, inputmaskData, options, cb) => {
		
		return cb(null, true);
	},
	"saveConfiguration": (soajs, inputmaskData, options, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs, options);
		modelObj.getItem(inputmaskData, (err, response) => {
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			if (!response) {
				return cb(bl.handleError(soajs, 501, null));
			}
			/*
			1- check if the recipe is allowed or no restriction
			2- if yes validate recipe and settings
			3- if valid save the deployment configuration
			4- if not valid return an error
		    */
			return cb(null, true);
		});
	}
	
};


module.exports = function (_bl) {
	bl = _bl;
	return local;
};
