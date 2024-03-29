"use strict";

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

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
				"type":"resource",
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