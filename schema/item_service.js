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
		"type": {
			"type": "string",
			"required": false,
			"enum": ["service"],
			"default": "service"
		},
		"description": {
			"required": true,
			"type": "string"
		},
		"configuration": {
			"required": true,
			"type": "object",
			"additionalProperties": false,
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
				},
				"port": {
					"required": true,
					"type": "integer"
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
					"type": "object",
					"required": false,
					"additionalProperties": false,
					"properties": {
						"port" : {
							"type": "object",
							"required": true,
							"properties": {
								"type" : {
									"type": "string",
									"required": true
								},
								"value" : {
									"type": "integer",
									"required": false
								}
							}
						},
						"readiness" : {
							"type": "string",
							"required": true
						},
						"commands": {
							"type": "object",
							"required": false
						}
					}
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
					"type": "string"
				},
				"owner": {
					"required": true,
					"type": "string"
				},
				"repo": {
					"required": true,
					"type": "string"
				}
			}
		},
		"version": {
			"required": true,
			"type": "array",
			"properties": {
				"version": {
					"required": true,
					"type": "string"
				},
				"documentation": {
					"required": false,
					"type": "object",
					"properties": {
						"readme": {
							"required": false,
							"type": "string"
						},
						"release": {
							"required": false,
							"type": "string"
						}
					}
				},
				"branch": {
					"required": false,
					"type": "string"
				},
				"tag": {
					"required": false,
					"type": "string"
				},
				"soa": {
					"required": false,
					"type": "string"
				},
				"apis": {
					"required": false,
					"type": "object"
				},
				"extKeyRequired": {
					"type": "boolean",
					"required": false
				},
				"oauth": {
					"type": "boolean",
					"required": false
				},
				"urac": {
					"type": "boolean",
					"required": false
				},
				"urac_Profile": {
					"type": "boolean",
					"required": false
				},
				"urac_ACL": {
					"type": "boolean",
					"required": false
				},
				"tenant_Profile": {
					"type": "boolean",
					"required": false
				},
				"provision_ACL": {
					"type": "boolean",
					"required": false
				},
				"swaggerFilename": {
					"type": "string",
					"required": false
				}
			}
		}
	}
};