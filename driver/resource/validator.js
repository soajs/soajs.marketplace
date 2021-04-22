/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

let validator = {
	"type": "object",
	"properties": {
		"src": {
			"type": "object",
			"additionalProperties": false,
			"properties": {
				"provider": {
					"type": "string",
					"default": "manual",
					"enum": ["manual", "github", "bitbucket", "bitbucket_enterprise"]
				},
				"owner": {
					"type": "string"
				},
				"repo": {
					"type": "string"
				},
				"branch": {
					"type": "string"
				},
				"tag": {
					"type": "string"
				}
			},
			"required": ["provider"]
		},
		"soa": {
			"type": "object",
			"properties": {
				"type": {
					"type": "string",
					"enum": ["resource"]
				},
				"name": {
					"type": "string",
					"pattern": /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/,
					"minLength": 1
				},
				"group": {
					"type": "string",
					"pattern": /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/,
					"minLength": 1
				},
				"description": {
					"type": "string"
				},
				"version": {
					"type": "string"
				},
				"subType": {
					"type": "string",
					"pattern": /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/,
					"minLength": 1
				},
				"tags": {
					"type": "array",
					"items": {
						"type": "string",
						"uniqueItems": true,
						"minItems": 1
					}
				},
				"attributes": {
					"type": "object"
				},
				"program": {
					"type": "array",
					"items": {
						"type": "string",
						"uniqueItems": true,
						"minItems": 1
					}
				},
				"profile": {
					"type": "object"
				},
				"tab": {
					"type": "object",
					"additionalProperties": false,
					"properties": {
						"main": {
							"type": "string",
							"maxLength": 20,
							"pattern": /^[a-zA-Z0-9_-]+$/
						},
						"sub": {
							"type": "string",
							"maxLength": 20,
							"pattern": /^[a-zA-Z0-9_-]+$/
						}
					},
					"required": ["main", "sub"]
				}
			},
			"required": ["type", "name", "group", "description", "version"]
		},
		"documentation": {
			"type": "object",
			"properties": {
				"readme": {
					"type": "string"
				},
				"release": {
					"type": "string"
				}
			}
		}
	},
	"required": ["src", "soa"]
};

module.exports = validator;