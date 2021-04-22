"use strict";

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

module.exports = {
	"resource_1": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.resource",
				"branch": "master"
			},
			"soa": {
				"type":"resource",
				"name": "resource",
				"group": "resource",
				"version": "1",
				"description": "description is description",
				"documentation": {
					"readme": "README.md",
					"release": "RELEASE.md"
				},
				"tab": {
					"main" : "mainTab",
					"sub" : "subtab"
				},
				"tags": ["tag1"],
				"program": ["program1"],
				"attributes": {
					"attrib": "1"
				}
			},
			"documentation": {
				"release": "Release: V1",
				"readme": "# soajs.resource config Express Service for Patch, Head, and others"
			}
		}
	},
	"resource_1_2": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.resource",
				"branch": "dev"
			},
			"soa": {
				"type":"resource",
				"name": "resource",
				"group": "resource",
				"version": "2",
				"description": "description is description",
				"documentation": {
					"readme": "README.md",
					"release": "RELEASE.md"
				},
				"swaggerFilename": "swagger.json",
			},
			"documentation": {
				"release": "Release: V2",
				"readme": "# soajs.resource config Express Service for Patch, Head, and others"
			}
		}
	},
	"resource_1_3": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.resource",
				"branch": "stg"
			},
			"soa": {
				"type":"resource",
				"name": "resource",
				"group": "resource",
				"subType": "Resource",
				"profile": {
					"personal": "info"
				},
				"version": "2",
				"description": "description is description",
				"documentation": {
					"readme": "README.md",
					"release": "RELEASE.md"
				},
			},
			"documentation": {
				"release": "Release: V2",
				"readme": "# soajs.resource config Express Service for Patch, Head, and others"
			}
		}
	},
	"resource_2": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.second",
				"tag": "1"
			},
			"soa": {
				"type":"resource",
				"profile": {
					"personal": "info"
				},
				"name": "second",
				"group": "resource",
				"version": "1",
				"description": "description is description",
				"documentation": {
					"readme": "README.md",
					"release": "RELEASE.md"
				},
			},
			"documentation": {
				"release": "Release: V1",
				"readme": "# soajs.resource config Express Service for Patch, Head, and others"
			}
		}
	},
	"resource_2_1": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.second",
				"tag": "2"
			},
			"soa": {
				"type":"resource",
				"profile": {
					"personal": "info"
				},
				"name": "second",
				"group": "resource",
				"version": "1",
				"description": "new description is description",
				"documentation": {
					"readme": "README.md",
					"release": "RELEASE.md"
				},
			},
			"documentation": {
				"release": "Release: V1",
				"readme": "# soajs.second config Express Service for Patch, Head, and others"
			}
		}
	},
	"resource_2_2": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.second",
				"tag": "3"
			},
			"soa": {
				"type":"resource",
				"profile": {
					"personal": "info"
				},
				"name": "second",
				"group": "resource",
				"version": "2",
				"description": "new description is description",
				"documentation": {
					"readme": "README.md",
					"release": "RELEASE.md"
				},
			},
			"documentation": {
				"release": "Release: V1",
				"readme": "# soajs.second config Express Service for Patch, Head, and others"
			}
		}
	}
};