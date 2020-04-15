"use strict";


module.exports = {
	"custom_1": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.custom",
				"branch": "master"
			},
			"soa": {
				"name": "config",
				"group": "custom",
				"version": "1",
				"description": "description is description",
				"documentation": {
					"readme": "README.md",
					"release": "RELEASE.md"
				},
			},
			"documentation": {
				"release": "Release: V1",
				"readme": "# soajs.custom config Express Service for Patch, Head, and others"
			}
		}
	},
	"custom_1_2": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.custom",
				"branch": "dev"
			},
			"soa": {
				"name": "config",
				"group": "custom",
				"version": "2",
				"description": "description is description",
				"documentation": {
					"readme": "README.md",
					"release": "RELEASE.md"
				},
			},
			"documentation": {
				"release": "Release: V2",
				"readme": "# soajs.custom config Express Service for Patch, Head, and others"
			}
		}
	},
	"custom_1_3": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.custom",
				"branch": "stg"
			},
			"soa": {
				"name": "config",
				"group": "custom",
				"version": "2",
				"description": "description is description",
				"documentation": {
					"readme": "README.md",
					"release": "RELEASE.md"
				},
			},
			"documentation": {
				"release": "Release: V2",
				"readme": "# soajs.custom custom Express Service for Patch, Head, and others"
			}
		}
	}
};