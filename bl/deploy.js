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
			1- get item saved deploy configuration
			2- set git info (branch & commit, or tag)
			3- set image info (tag)
			4- save item configuration
		
			5- inspect item deployment from infra ms
			
			6- redeploy, this should call infra ms
			 */
			return cb(null, true);
		});
	},
	"cd": (soajs, inputmaskData, options, cb) => {
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
			1- validate cd token
			2- if not valid return error
			3- if valid continue
			
			4- get item saved deploy configuration
			5- for all deployed env check if deployed from this branch
			6- if not do nothing
			7- if yes continue
			8- call deploy
			*/
			return cb(null, true);
		});
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
			1- check if u can deploy in this env
			2- if not return an error
			3- if yes continue
			4- get item saved deploy configuration
			5- inspect item deployment from infra ms
			
			6- check if API_REGISTRY is needed to inspect gateway from infra ms
			7- get the computed env variables
			8- resolve computed variables
			
			9- create recipe
			10- deploy, this should call infra ms
			 */
			return cb(null, true);
		});
	},
	"saveConfigurationAndDeploy": (soajs, inputmaskData, options, cb) => {
		local.saveConfiguration(soajs, inputmaskData, options, (error, result)=>{
			if (error){
				//
			}
			local.deploy(soajs, inputmaskData, options, ()=>{
				if (error){
					//
				}
				//move on
				return cb(null, true);
			});
		});
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
				3.1 - validate if the used computed are supported
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
