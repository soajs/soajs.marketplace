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
	"assignVersionConf": (opts, assignee) => {
		if (opts.profile) {
			assignee.profile = opts.profile;
		}
		return null;
	},
	"createCatalog": (data, cb) => {
		let catalog = {};
		let soa = data.soa;
		if (data.oldCatalog) {
			delete data.oldCatalog._id;
			catalog = JSON.parse(JSON.stringify(data.oldCatalog));
		}
		catalog.name = soa.name;
		catalog.type = "static";
		catalog.description = soa.description;
		
		//configuration
		if (!catalog.configuration) {
			catalog.configuration = {};
		}
		
		if (soa.group) {
			catalog.configuration.group = soa.group;
		}
		if (soa.subType) {
			catalog.configuration.subType = soa.subType;
		}
		
		//metadata
		if (!catalog.metadata) {
			catalog.metadata = {};
		}
		if (soa.tags) {
			catalog.metadata.tags = soa.tags;
		}
		if (soa.attributes) {
			catalog.metadata.attributes = soa.attributes;
		}
		if (soa.program) {
			catalog.metadata.program = soa.program;
		}
		
		//src
		catalog.src = {
			"provider": data.src.provider,
		};
		if (data.src.owner) {
			catalog.src.owner = data.src.owner;
		}
		if (data.src.repo) {
			catalog.src.repo = data.src.repo;
		}
		//ui
		if (soa.tab) {
			catalog.ui = soa.tab;
		}
		
		
		//version
		let newVersions = [];
		let v = soa.version ? soa.version : "1";
		let ts = new Date().getTime();
		if (!catalog.versions) {
			//new record
			catalog.versions = [];
			let temp = {
				"version": v,
				"lastSync": {
					"ts": ts
				},
				"soa": JSON.stringify(soa),
			};
			lib.assignVersionConf(data.soa, temp);
			if (data.src.branch) {
				temp.lastSync.branch = data.src.branch;
				temp.branches = [data.src.branch];
			} else if (data.src.tag) {
				temp.lastSync.tag = data.src.tag;
				temp.tags = [data.src.tag];
			}
			
			if (data.documentation) {
				if (!temp.documentation) {
					temp.documentation = {};
				}
				if (data.documentation.readme) {
					temp.documentation.readme = data.documentation.readme;
				}
				if (data.documentation.release) {
					temp.documentation.release = data.documentation.release;
				}
			}
			catalog.versions.push(temp);
			return cb(catalog);
		} else {
			let found = false;
			async.each(catalog.versions, function (oneVersion, callback) {
				if (oneVersion.version === v) {
					found = true;
					oneVersion.lastSync = {
						"ts": ts
					};
					lib.assignVersionConf(data.soa, oneVersion);
					if (data.src.branch) {
						oneVersion.lastSync.branch = data.src.branch;
						if (!oneVersion.branches) {
							oneVersion.branches = [];
						}
						let index = oneVersion.branches.indexOf(data.src.branch);
						if (index === -1) {
							oneVersion.branches.push(data.src.branch);
						}
					} else if (data.src.tag) {
						oneVersion.lastSync.tag = data.src.tag;
						if (!oneVersion.tags) {
							oneVersion.tags = [];
						}
						let index = oneVersion.tags.indexOf(data.src.tag);
						if (index === -1) {
							oneVersion.tags.push(data.src.tag);
						}
					}
					oneVersion.soa = JSON.stringify(soa);
					if (data.documentation) {
						if (!oneVersion.documentation) {
							oneVersion.documentation = {};
						}
						if (data.documentation.readme) {
							oneVersion.documentation.readme = data.documentation.readme;
						}
						if (data.documentation.release) {
							oneVersion.documentation.release = data.documentation.release;
						}
					}
					newVersions.push(oneVersion);
				} else {
					if (data.src.branch) {
						if (oneVersion.branches) {
							let index = oneVersion.branches.indexOf(data.src.branch);
							if (index > -1) {
								oneVersion.branches = oneVersion.branches.splice(index, 1);
							}
							if (oneVersion.branches.length > 0) {
								newVersions.push(oneVersion);
							}
						}
					} else if (data.src.tag) {
						if (oneVersion.tags) {
							let index = oneVersion.tags.indexOf(data.src.tag);
							if (index > -1) {
								oneVersion.tags = oneVersion.tags.splice(index, 1);
							}
							if (oneVersion.tags.length > 0) {
								newVersions.push(oneVersion);
							}
						}
					}
					
				}
				return callback();
			}, function () {
				if (!found) {
					let temp = {
						"version": v,
						"lastSync": {
							"ts":ts
						},
						"soa": JSON.stringify(soa),
					};
					lib.assignVersionConf(data.soa, temp);
					if (data.src.branch) {
						temp.lastSync.branch = data.src.branch;
						temp.branches = [data.src.branch];
					} else if (data.src.tag) {
						temp.lastSync.tag = data.src.tag;
						temp.tags = [data.src.tag];
					}
					if (data.documentation) {
						if (!temp.documentation) {
							temp.documentation = {};
						}
						if (data.documentation.readme) {
							temp.documentation.readme = data.documentation.readme;
						}
						if (data.documentation.release) {
							temp.documentation.release = data.documentation.release;
						}
					}
					newVersions.push(temp);
				}
				catalog.versions = newVersions;
				return cb(catalog);
			});
		}
		
	},
	"checkCanUpdate": (data, cb) => {
		let catalog = data.oldCatalog;
		if (catalog && catalog.src) {
			if (catalog.src) {
				if (catalog.src.provider === data.src.provider) {
					if (catalog.src.provider !== "manual") {
						if (catalog.src.owner !== data.src.owner || catalog.src.repo !== data.src.repo) {
							return cb(true);
						}
					}
				} else {
					return cb(true);
				}
			}
		}
		return cb(false);
	},
};

module.exports = lib;