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
	"required": true,
	"properties": {
		"src": {
			"required": true,
			"type": "object",
			"additionalProperties": false,
			"properties": {
				"provider": {
					"required": true,
					"type": "string",
					"default": "manual",
					"enum": ["manual", "github", "bitbucket", "bitbucket_enterprise"]
				},
				"owner": {
					"required": false,
					"type": "string"
				},
				"repo": {
					"required": false,
					"type": "string"
				},
				"branch": {
					"required": false,
					"type": "string"
				},
				"tag": {
					"required": false,
					"type": "string"
				}
			}
		},
		"soa": {
			"type": "object",
			"required": true,
			"properties": {
				"type": {
					"type": "string",
					"required": false,
					"enum": ["config"]
				},
				"subType": {
					"type": "string",
					"required": false,
					"pattern": /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/,
					"minLength": 1
				},
				"name": {
					"type": "string",
					"required": true,
					"pattern": /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/,
					"minLength": 1
				},
				"group": {
					"type": "string",
					"required": true,
					"pattern": /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/,
					"minLength": 1
				},
				"description": {
					"type": "string",
					"required": true
				},
				"tags": {
					"type": "array",
					"required": false,
					"items": {
						"type": "string",
						"uniqueItems": true,
						"minItems": 1
					}
				},
				"attributes": {
					"type": "object",
					"required": false,
				},
				"tab": {
					"type": "object",
					"required": false,
					"additionalProperties": false,
					"properties": {
						"main": {
							"type": "string",
							"required": true,
							"maxLength": 20,
							"pattern": /^[a-zA-Z0-9_-]+$/
						},
						"sub": {
							"type": "string",
							"required": true,
							"maxLength": 20,
							"pattern": /^[a-zA-Z0-9_-]+$/
						}
					}
				},
				"program": {
					"type": "array",
					"required": false,
					"items": {
						"type": "string",
						"uniqueItems": true,
						"minItems": 1
					}
				},
				"profile": {
					"type": "object",
					"required": false
				},
				"version": {
					"type": "string",
					"required": true
				}
			}
		},
		"documentation": {
			"type": "object",
			"required": false,
			"properties": {
				"readme": {
					"type": "string",
					"required": false,
				},
				"release": {
					"type": "string",
					"required": false,
				}
				
			}
		}
	}
};

module.exports = validator;