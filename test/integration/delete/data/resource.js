"use strict";


module.exports = {
	"resource_delete": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.resource",
				"branch": "stg"
			},
			"soa": {
				"name": "antoine",
				"group": "delete",
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