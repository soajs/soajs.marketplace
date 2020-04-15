"use strict";


module.exports = {
	"config_1": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.config",
				"branch": "master"
			},
			"soa": {
				"name": "config",
				"group": "config",
				"version": "1",
				"description": "description is description",
				"documentation": {
					"readme": "README.md",
					"release": "RELEASE.md"
				},
			},
			"documentation": {
				"release": "Release: V1",
				"readme": "# soajs.config config Express Service for Patch, Head, and others"
			}
		}
	},
	"config_1_2": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.config",
				"branch": "dev"
			},
			"soa": {
				"name": "config",
				"group": "config",
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
				"readme": "# soajs.config config Express Service for Patch, Head, and others"
			}
		}
	},
	"config_1_3": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.config",
				"branch": "stg"
			},
			"soa": {
				"name": "config",
				"group": "Example",
				"version": "2",
				"description": "description is description",
				"documentation": {
					"readme": "README.md",
					"release": "RELEASE.md"
				},
			},
			"documentation": {
				"release": "Release: V12",
				"readme": "# soajs.config config Express Service for Patch, Head, and others"
			}
		}
	}
};