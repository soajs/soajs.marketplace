/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";
const async = require('async');

let lib = {
	"assignVersionConf" : (opts, assignee) =>{
		assignee.soa = opts.version.soa;
		assignee.apis = opts.version.schema;
		assignee.extKeyRequired = opts.version.extKeyRequired;
		assignee.oauth =  opts.version.oauth;
		assignee.provision_ACL = opts.version.provision_ACL;
		assignee.tenant_Profile = opts.version.tenant_Profile;
		assignee.urac = opts.version.urac;
		assignee.urac_ACL = opts.version.urac_ACL;
		assignee.urac_Config = opts.version.urac_Config;
		assignee.urac_GroupConfig = opts.version.urac_GroupConfig;
		assignee.urac_Profile = opts.version.urac_Profile;
		if (opts.version.documentation) {
			assignee.documentation = opts.version.documentation;
		}
		return null;
	},
	"createCatalog": (data, cb) => {
		let catalog = {};
		if (data.oldCatalog) {
			catalog = JSON.parse(JSON.stringify(data.oldCatalog));
		}
		let ts = new Date().getTime();
		catalog.name = data.name;
		catalog.type = data.type;
		catalog.description = soa.description;
		catalog.configuration = data.configuration;
		if (data.metadata) {
			catalog.metadata = data.metadata;
		}
		catalog.src = data.src;
		catalog.ui = data.tab;
		
		//version
		let newVersions = [];
		let v = data.version.version ? data.version.version : "1";
		if (!catalog.versions) {
			catalog.versions = [];
			let temp = {
				"version": v,
				"lastSync": {
					"ts": ts
				}
			};
			lib.assignVersionConf(data, temp);
			if (data.version.branch) {
				temp.lastSync.branch = data.branch;
				temp.branches = [data.branch];
			} else if (data.version.tag) {
				temp.lastSync.tag = data.tag;
				temp.tags = [data.tag];
			} else {
				return cb(true);
			}
			if (data.version.swagger) {
				catalog.configuration.swagger = true;
			}
			catalog.versions.push(temp);
			return cb(null, catalog);
		}
		let found = false;
		async.each(catalog.versions, function (oneVersion, callback) {
			if (oneVersion.version === v) {
				found = true;
				oneVersion.lastSync = {
					"ts": data.ts
				};
				if (data.branch) {
					oneVersion.lastSync.branch = data.branch;
					if (!oneVersion.branches) {
						oneVersion.branches = [];
					}
					let index = oneVersion.branches.indexOf(data.branch);
					if (index === -1) {
						oneVersion.branches.push(data.branch);
					}
				} else if (data.tag) {
					oneVersion.lastSync.tag = data.tag;
					if (!oneVersion.tags) {
						oneVersion.tags = [];
					}
					let index = oneVersion.tags.indexOf(data.tag);
					if (index === -1) {
						oneVersion.tags.push(data.tag);
					}
				} else {
					return callback(true);
				}
				lib.assignVersionConf(data, oneVersion);
				if (data.version.swagger) {
					catalog.configuration.swagger = true;
				}
				
				newVersions.push(oneVersion);
			} else {
				if (data.branch) {
					if (oneVersion.branches) {
						let index = oneVersion.branches.indexOf(v);
						if (index > -1) {
							oneVersion.branches = oneVersion.branches.splice(index, 1);
						}
						if (oneVersion.branches.length > 0) {
							newVersions.push(oneVersion);
						}
					}
				} else if (data.tag) {
					if (oneVersion.tags) {
						let index = oneVersion.tags.indexOf(v);
						if (index > -1) {
							oneVersion.tags = oneVersion.tags.splice(index, 1);
						}
						if (oneVersion.tags.length > 0) {
							newVersions.push(oneVersion);
						}
					}
				}
				else {
					return callback(true);
				}
			}
			return callback();
		}, function (err) {
			if (err) {
				return cb(true);
			}
			if (!found) {
				let temp = {
					"version": v,
					"lastSync": {
						"ts": data.ts
					}
				};
				if (data.branch) {
					temp.lastSync.branch = data.branch;
					temp.branches = [data.branch];
				} else if (data.tag) {
					temp.lastSync.tag = data.tag;
					temp.tags = [data.tag];
				}
				else {
					return cb(true);
				}
				lib.assignVersionConf(data, temp);
				if (data.version.swagger) {
					catalog.configuration.swagger = true;
				}
				newVersions.push(temp);
			}
			catalog.versions = newVersions;
			return cb(null, catalog);
		});
	},
	"checkCanUpdate": (catalog, inputmaskData, cb) => {
		if (catalog && catalog.src) {
			inputmaskData.oldCatalog = response;
			if (catalog.src) {
				if (catalog.src.provider === inputmaskData.src.provider) {
					if (catalog.src.provider !== "manual") {
						if (catalog.src.owner !== inputmaskData.src.owner || catalog.src.repo !== inputmaskData.src.repo) {
							return cb(true);
						}
					}
				} else {
					return cb(true);
				}
			}
		}
	},
};

module.exports = lib;

