/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

'use strict';

function getGroups(soajs) {
	let _groups = null;
	if (soajs && soajs.urac && soajs.urac.groups) {
		if (Array.isArray(soajs.urac.groups) && soajs.urac.groups.length > 0) {
			_groups = soajs.urac.groups;
		}
	}
	return _groups;
}

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
			"msg": bl.localConfig.errors[errCode] + ((err && errCode === 602) ? err.message : "")
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
	
	/**
	 * Marketplace
	 */
	"getItems_by_type_subtype": (soajs, inputmaskData, options, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		inputmaskData._groups = getGroups(soajs);
		let modelObj = bl.mp.getModel(soajs, options);
		modelObj.getItems_by_type_subtype(inputmaskData, (err, response) => {
			bl.mp.closeModel(modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			return cb(null, response);
		});
	},
	"getItems_by_keywords": (soajs, inputmaskData, options, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		inputmaskData._groups = getGroups(soajs);
		let modelObj = bl.mp.getModel(soajs, options);
		modelObj.getItems_by_keywords(inputmaskData, (err, response) => {
			bl.mp.closeModel(modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			return cb(null, response);
		});
	},
	"getItem_by_source": (soajs, inputmaskData, options, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		inputmaskData._groups = getGroups(soajs);
		let modelObj = bl.mp.getModel(soajs, options);
		modelObj.getItem_by_source(inputmaskData, (err, response) => {
			bl.mp.closeModel(modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			return cb(null, response);
		});
	},
	
	"getItem_by_type": (soajs, inputmaskData, options, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		inputmaskData._groups = getGroups(soajs);
		let modelObj = bl.mp.getModel(soajs, options);
		modelObj.getItem_by_type(inputmaskData, (err, response) => {
			bl.mp.closeModel(modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			return cb(null, response);
		});
	},
	
	"updateItem_environments": (soajs, inputmaskData, options, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		inputmaskData._groups = getGroups(soajs);
		let modelObj = bl.mp.getModel(soajs, options);
		modelObj.updateItem_environments(inputmaskData, (err, response) => {
			bl.mp.closeModel(modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			return cb(null, response);
		});
	},
	"updateItem_recipes": (soajs, inputmaskData, options, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		inputmaskData._groups = getGroups(soajs);
		let modelObj = bl.mp.getModel(soajs, options);
		modelObj.updateItem_recipes(inputmaskData, (err, response) => {
			bl.mp.closeModel(modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			return cb(null, response);
		});
	},
	"updateItem_acl": (soajs, inputmaskData, options, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		inputmaskData._groups = getGroups(soajs);
		let modelObj = bl.mp.getModel(soajs, options);
		
		//todo let owner be handled behind the scenes (in case of whitelist - black list)
		modelObj.updateItem_acl(inputmaskData, (err, response) => {
			bl.mp.closeModel(modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			return cb(null, response);
		});
	},
	"deleteItem": (soajs, inputmaskData, options, cb) => {
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
			if (response.locked) {
				return cb(bl.handleError(soajs, 502, null));
			}
			modelObj.deleteItem(inputmaskData, (err) => {
				bl.mp.closeModel(modelObj);
				if (err) {
					return cb(bl.handleError(soajs, 602, err));
				}
				return cb(null, true);
			});
		});
	},
	
	"deleteItem_source": (soajs, inputmaskData, options, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs, options);
		modelObj.deleteItem_source(inputmaskData, (err) => {
			bl.mp.closeModel(modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			return cb(null, true);
		});
	},
	
	"deleteItem_branch": (soajs, inputmaskData, options, cb) => {
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
			if (response.locked) {
				return cb(bl.handleError(soajs, 502, null));
			}
			let index;
			for (let i = 0; i < response.versions.length; i++) {
				if (response.versions[i].branches) {
					index = response.versions[i].branches.indexOf(inputmaskData.branch);
					if (index > -1) {
						response.versions[i].branches.splice(index, 1);
						if (response.versions[i].branches.length === 0 && (!response.versions[i].tags || response.versions[i].tags.length === 0)) {
							response.versions.splice(i, 1);
						}
						break;
					}
				} else {
					index = -1;
				}
			}
			if (index < 0) {
				return cb(bl.handleError(soajs, 403, null));
			}
			let opts = {
				versions: response.versions,
				name: response.name,
				type: response.type
			};
			modelObj.deleteItem_version(opts, (err) => {
				bl.mp.closeModel(modelObj);
				if (err) {
					return cb(bl.handleError(soajs, 602, err));
				}
				return cb(null, true);
			});
		});
	},
	
	"deleteItem_tag": (soajs, inputmaskData, options, cb) => {
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
			if (response.locked) {
				return cb(bl.handleError(soajs, 502, null));
			}
			let index;
			for (let i = 0; i < response.versions.length; i++) {
				if (response.versions[i].tags) {
					index = response.versions[i].tags.indexOf(inputmaskData.tag);
					if (index > -1) {
						response.versions[i].tags.splice(index, 1);
						if (response.versions[i].tags.length === 0 && (!response.versions[i].branches || response.versions[i].branches.length === 0)) {
							response.versions.splice(i, 1);
						}
						break;
					}
				} else {
					index = -1;
				}
			}
			if (index < 0) {
				return cb(bl.handleError(soajs, 404, null));
			}
			let opts = {
				versions: response.versions,
				name: response.name,
				type: response.type
			};
			modelObj.deleteItem_version(opts, (err) => {
				bl.mp.closeModel(modelObj);
				if (err) {
					return cb(bl.handleError(soajs, 602, err));
				}
				return cb(null, true);
			});
		});
	},
	
	"addItem": (soajs, inputmaskData, options, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs, options);
		let data = inputmaskData.item;
		let opts = {
			name: data.soa.name,
			type: data.soa.type
		};
		
		if (data.src.provider !== "manual" && !(data.src.tag || data.src.branch)) {
			bl.mp.closeModel(modelObj);
			return cb(bl.handleError(soajs, 402, null));
		}
		modelObj.getItem(opts, (err, response) => {
			if (err) {
				bl.mp.closeModel(modelObj);
				return cb(bl.handleError(soajs, 602, err));
			}
			if (response) {
				data.oldCatalog = response;
			}
			
			let catalogDriver;
			if (data.soa.type === "service" && data.soa.subType === "soajs") {
				catalogDriver = require(`../driver/${data.soa.subType}/index.js`);
			} else {
				catalogDriver = require(`../driver/${data.soa.type}/index.js`);
			}
			catalogDriver.checkCanUpdate(data, (err) => {
				if (err) {
					bl.mp.closeModel(modelObj);
					return cb(bl.handleError(soajs, 401, err));
				}
				catalogDriver.createCatalog(data, (catalog) => {
					opts = {
						item: catalog
					};
					modelObj.addItem(opts, (err, result) => {
						bl.mp.closeModel(modelObj);
						if (err) {
							return cb(bl.handleError(soajs, 602, err));
						}
						if (result.n === 0) {
							return cb(bl.handleError(soajs, 500, null));
						}
						return cb(null, response ? "Catalog Entry Successfully updated!" : "Catalog Entry Successfully Added!");
					});
				});
			});
		});
	},
	
	"update_item_version_config": (soajs, inputmaskData, options, cb) => {
		if (!inputmaskData) {
			return cb(bl.handleError(soajs, 400, null));
		}
		let modelObj = bl.mp.getModel(soajs, options);
		inputmaskData._groups = getGroups(soajs);
		
		modelObj.update_item_version_config(inputmaskData, (err, response)=>{
			bl.mp.closeModel(modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			return cb(null, response);
		});
	}
};

module.exports = bl;