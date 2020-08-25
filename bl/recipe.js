/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

'use strict';

const utils = require("../utils/index.js");
const async = require('async');

let bl = {
	"modelObj": null,
	"model": null,
	"soajs_service": null,
	"localConfig": null,
	
	"handleError": (soajs, errCode, err) => {
		if (err) {
			soajs.log.error(err.message);
		}
		return ({
			"code": errCode,
			"msg": bl.localConfig.errors[errCode] + ((err && (errCode === 602 || errCode === 503 || errCode === 422)) ? err.message : "")
		});
	},
	
	"mp": {
		"getModel": (soajs) => {
			let modelObj = bl.modelObj;
			if (soajs && soajs.tenant && soajs.tenant.type === "client" && soajs.tenant.dbConfig) {
				let options = {
					"dbConfig": soajs.tenant.dbConfig,
					"index": soajs.tenant.id
				};
				modelObj = new bl.model(bl.soajs_service, options, null);
			}
			return modelObj;
		},
		"closeModel": (soajs, modelObj) => {
			if (soajs && soajs.tenant && soajs.tenant.type === "client" && soajs.tenant.dbConfig) {
				modelObj.closeConnection();
			}
		}
	},
	
	"get": (soajs, inputmaskData, options, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		inputmaskData._groups = getGroups(soajs);
		let modelObj = bl.mp.getModel(soajs, options);
		modelObj.getItem_by_id(inputmaskData, (err, response) => {
			bl.mp.closeModel(modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			if (response.recipe.deployOptions && response.recipe.deployOptions.labels) {
				utils.normalizeKeyValues(response.recipe.deployOptions.labels, bl.localConfig.tokens.dotToken, bl.localConfig.tokens.dotValue, function (error, updatedRecord) {
					response.recipe.deployOptions.labels = updatedRecord;
					return cb(null, response);
				});
			} else {
				return cb(null, response);
			}
		});
	},
	
	"list": (soajs, inputmaskData, options, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		inputmaskData._groups = getGroups(soajs);
		let modelObj = bl.mp.getModel(soajs, options);
		modelObj.getItems(inputmaskData, (err, records) => {
			bl.mp.closeModel(modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			async.map(records, function (oneRecord, callback) {
				if (oneRecord.recipe.deployOptions && oneRecord.recipe.deployOptions.labels) {
					utils.normalizeKeyValues(oneRecord.recipe.deployOptions.labels, bl.localConfig.tokens.dotToken, bl.localConfig.tokens.dotValue, function (error, updatedRecord) {
						oneRecord.recipe.deployOptions.labels = updatedRecord;
						return callback(null, oneRecord);
					});
				} else {
					return callback(null, oneRecord);
				}
			}, cb);
		});
	},
	
	"list_by_ids": (soajs, inputmaskData, options, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		inputmaskData._groups = getGroups(soajs);
		let modelObj = bl.mp.getModel(soajs, options);
		modelObj.getItems_by_ids(inputmaskData, (err, records) => {
			bl.mp.closeModel(modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			async.map(records, function (oneRecord, callback) {
				if (oneRecord.recipe.deployOptions && oneRecord.recipe.deployOptions.labels) {
					utils.normalizeKeyValues(oneRecord.recipe.deployOptions.labels, bl.localConfig.tokens.dotToken, bl.localConfig.tokens.dotValue, function (error, updatedRecord) {
						oneRecord.recipe.deployOptions.labels = updatedRecord;
						return callback(null, oneRecord);
					});
				} else {
					return callback(null, oneRecord);
				}
			}, cb);
		});
	},
	
	"add": (soajs, inputmaskData, options, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		inputmaskData._groups = getGroups(soajs);
		let modelObj = bl.mp.getModel(soajs, options);
		
		if (inputmaskData.catalog.locked) {
			// do not allow user to lock a record
			delete inputmaskData.catalog.locked;
		}
		async.series({
			"checkSourCode": function (mCb) {
				validateSourceCodeAttachment(soajs, inputmaskData.catalog, mCb);
			},
			"checkPorts": function (mCb) {
				checkPorts(soajs, inputmaskData.catalog, mCb);
			}
		}, (error) => {
			if (error) {
				bl.mp.closeModel(modelObj);
				return cb(error);
			}
			if (inputmaskData.catalog.recipe && inputmaskData.catalog.recipe.deployOptions && inputmaskData.catalog.recipe.deployOptions.labels) {
				let recipeLabels = inputmaskData.catalog.recipe.deployOptions.labels;
				utils.normalizeKeyValues(recipeLabels, bl.localConfig.tokens.dotRegexString, bl.localConfig.tokens.dotToken, function (error, updatedRecord) {
					inputmaskData.catalog.recipe.deployOptions.labels = updatedRecord;
					return save();
				});
			} else {
				return save();
			}
		});
		
		function save() {
			if (inputmaskData.catalog &&
				inputmaskData.catalog.recipe &&
				inputmaskData.catalog.recipe.deployOptions) {
				if (inputmaskData.catalog.recipe.deployOptions.livenessProbe &&
					typeof (inputmaskData.catalog.recipe.deployOptions.livenessProbe) === 'object' &&
					Object.keys(inputmaskData.catalog.recipe.deployOptions.livenessProbe).length === 0) {
					inputmaskData.catalog.recipe.deployOptions.livenessProbe = null;
				}
			}
			modelObj.addItem(inputmaskData, (err, record) => {
				bl.mp.closeModel(modelObj);
				if (err) {
					return cb(bl.handleError(soajs, 602, err));
				}
				return cb(null, {
					id: record[0]._id
				});
			});
		}
	},
	
	"edit": (soajs, inputmaskData, options, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		if (inputmaskData.catalog.locked) {
			delete inputmaskData.catalog.locked;
		}
		inputmaskData._groups = getGroups(soajs);
		let modelObj = bl.mp.getModel(soajs, options);
		async.series({
			"checkSourCode": function (mCb) {
				validateSourceCodeAttachment(soajs, inputmaskData.catalog, mCb);
			},
			"checkPorts": function (mCb) {
				checkPorts(soajs, inputmaskData.catalog, mCb);
			}
		}, (error) => {
			if (error) {
				return cb(error);
			}
			modelObj.getItem_by_id(inputmaskData, (err, record) => {
				if (err) {
					bl.mp.closeModel(modelObj);
					return cb(bl.handleError(soajs, 602, err));
				}
				if (!record){
					bl.mp.closeModel(modelObj);
					return cb(bl.handleError(soajs, 433, err));
				}
				if (record.locked){
					bl.mp.closeModel(modelObj);
					return cb(bl.handleError(soajs, 434, err));
				}
				if (inputmaskData.catalog.recipe &&
					inputmaskData.catalog.recipe.deployOptions &&
					inputmaskData.catalog.recipe.deployOptions.labels) {
					
					let recipeLabels = inputmaskData.catalog.recipe.deployOptions.labels;
					utils.normalizeKeyValues(recipeLabels, bl.localConfig.tokens.dotRegexString, bl.localConfig.tokens.dotToken, function (error, updatedRecord) {
						inputmaskData.catalog.recipe.deployOptions.labels = updatedRecord;
						return save();
					});
				} else {
					return save();
				}
			});
		});
		
		function save() {
			modelObj.editItem(inputmaskData, (err) => {
				bl.mp.closeModel(modelObj);
				if (err) {
					return cb(bl.handleError(soajs, 602, err));
				}
				return cb(null, "Catalog Recipe Successfully updated!");
			});
		}
	},
	
	"delete": (soajs, inputmaskData, options, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		inputmaskData._groups = getGroups(soajs);
		let modelObj = bl.mp.getModel(soajs, options);
		modelObj.deleteItem(inputmaskData, (err) => {
			bl.mp.closeModel(modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			return cb(null, "Catalog Recipe Successfully deleted!");
		});
	},
};

function getGroups(soajs) {
	let _groups = null;
	if (soajs && soajs.urac && soajs.urac.groups) {
		if (Array.isArray(soajs.urac.groups) && soajs.urac.groups.length > 0) {
			_groups = soajs.urac.groups;
		}
	}
	return _groups;
}

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

module.exports = bl;