'use strict';

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

module.exports = {
	"type": "object",
	"additionalProperties": false,
	"properties": {
		"name": {
			"required": true,
			"type": "string",
			"maxLength": 20,
			"pattern": /^[a-zA-Z0-9_-]+$/
		},
		"description": {
			"required": true,
			"type": "string"
		},
		"type": {
			"required": false,
			"type": "string",
			"default": "resource",
			"enum": ["resource"]
		},
		"configuration": {
			"required": true,
			"type": "object",
			"additionalProperties": true,
			"properties": {
				"subType": {
					"required": true,
					"type": "string",
					"pattern": /^[a-zA-Z0-9_-]+$/
				},
				"group": {
					"required": true,
					"type": "string",
					"pattern": /^[a-zA-Z0-9_-]+$/
				}
			}
		},
		"metadata": {
			"required": false,
			"type": "object",
			"additionalProperties": false,
			"properties": {
				"tags": {
					"required": true,
					"type": "array",
					"minItems": 1
				},
				"program": {
					"required": true,
					"type": "array",
					"minItems": 1
				},
				"attributes": {
					"required": false,
					"type": "object"
				}
			}
		},
		"ui": {
			"required": false,
			"type": "object",
			"additionalProperties": false,
			"properties": {
				"main": {
					"required": true,
					"type": "string",
					"maxLength": 20,
					"pattern": /^[a-zA-Z0-9_-]+$/
				},
				"sub": {
					"required": true,
					"type": "string",
					"maxLength": 20,
					"pattern": /^[a-zA-Z0-9_-]+$/
				}
			}
		},
		"src": {
			"required": false,
			"type": "object",
			"additionalProperties": false,
			"properties": {
				"provider": {
					"required": true,
					"type": "string",
					"default": "manual",
					"enum": ["manual"]
				}
			}
		},
		"version": {
			"required": true,
			"type": "object",
			"additionalProperties": true,
			"properties": {
				"version": {
					"required": true,
					"type": "string"
				},
				"documentation": {
					"required": false,
					"type": "string"
				}
			}
		}
	}
};