"use strict";


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
				"name": "resource",
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
	"resource_1_2": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.resource",
				"branch": "dev"
			},
			"soa": {
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
				"name": "resource",
				"group": "resource",
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
	}
};