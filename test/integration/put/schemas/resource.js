"use strict";

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

let validator = {
	"type": "object",
	"required": ["name", "type", "versions", "configuration"],
	"additionalProperties": false,
	"properties": {
		"name": {
			"type": "string",
		},
		"type": {
			"type": "string",
		},
		"configuration": {
			"type": "object",
			"additionalProperties": false,
			"properties": {
				"subType": {
					"type": "string"
				},
				"port": {
					"type": "integer"
				},
				"group": {
					"type": "string"
				},
				"requestTimeout": {
					"required": false,
					"type": "integer"
				},
				"requestTimeoutRenewal": {
					"required": false,
					"type": "integer"
				},
				"maintenance": {
					"required": false,
					"additionalProperties": false,
					"properties": {
						"port": {
							"type": "object",
							"properties": {
								"type": {
									"type": "string",
								},
								"value": {
									"type": "integer",
								},
								"required": ["type"]
							}
						},
						"readiness": {
							"type": "string",
						},
						"commands": {
							"type": "array",
							"items": {
								"type": "object",
								"properties": {
									"label": {
										"type": "string",
									},
									"path": {
										"type": "string",
									},
									"icon": {
										"type": "string",
									}
								},
								"required": ["label", "path", "icon"]
							}
						},
						"required": ["readiness", "port"]
					}
				},
				"required": ["group"]
			},
		},
		"description": {
			"required": true,
			"type": "string"
		},
		"metadata": {
			"type": "object",
			"required": false,
			"additionalProperties": false,
			"properties": {
				"tags": {
					"type": "array",
					"items": {
						"type": "string",
						"uniqueItems": true,
						"minItems": 1
					}
				},
				"program": {
					"type": "array",
					"items": {
						"type": "string",
						"uniqueItems": true,
						"minItems": 1
					}
				},
				"attributes": {
					"type": "object"
				}
			}
		},
		"src": {
			"type": "object",
			"required": false,
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
			}
		},
		"ui": {
			"type": "object",
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
		"versions": {
			"type": "array",
			"items": {
				"type": "object",
				"uniqueItems": true,
				"minItems": 1,
				"properties": {
					"version" :{
						"type": "string",
						"required": false
					},
					
					"branches": {
						"type": "array",
						"items": {
							"type": "string",
							"uniqueItems": true,
							"minItems": 1
						}
					},
					"tags": {
						"type": "array",
						"items": {
							"type": "string",
							"uniqueItems": true,
							"minItems": 1
						}
					},
					"swagger": {
						"type": "string",
						"required": false
					},
					"lastSync": {
						"type": "object",
						"properties": {
							"ts": {
								"type": "integer",
							},
							"tag" : {
								"type": "string",
							},
							"branch" : {
								"type": "string",
							}
						},
						"oneOf" : [
							{
								"required" : ["ts", "tag"]
							},
							{
								"required" : ["ts", "branch"]
							}
						]
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
					},
				},
				"required": ["version", "lastSync"]
			}
		}
	}
};


module.exports = validator;