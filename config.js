/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

'use strict';

module.exports = {
	type: 'service',
	prerequisites: {
		cpu: '',
		memory: ''
	},
	"serviceVersion": 1,
	"serviceName": "marketplace",
	"serviceGroup": "SOAJS Core Services",
	"servicePort": 4007,
	"requestTimeout": 30,
	"requestTimeoutRenewal": 5,
	"oauth": true,
	"extKeyRequired": true,
	"urac": true,
	
	
	"errors": {
		400: "Business logic required data are missing",
		
		601: "Model not found",
		602: "Model error: ",
		
	},
	"schema": {
		
		"commonFields": {
			"keywords": {
				"source": ['query.keywords', 'body.keywords'],
				"required": false,
				"validation": {"type": "string"}
			},
			"start": {
				"required": false,
				"source": ["query.start", "body.start"],
				"default": 0,
				"validation": {
					"type": "integer",
					"min": 0
				}
			},
			"limit": {
				"required": false,
				"source": ["query.limit", "body.limit"],
				"default": 100,
				"validation": {
					"type": "integer",
					"max": 2000
				}
			},
			"id": {
				"source": ['query.id', 'body.id'],
				"required": true,
				"validation": {"type": "string"}
			}
		},
		
		"get": {
			'/soajs/items': {
				"_apiInfo": {
					"l": "List items matching certain keywords from soajs only",
					"group": "SOAJS",
				},
				"commonFields": ["start", "limit", "keywords"]
			},
			'/public/items': {
				"_apiInfo": {
					"l": "List public items matching certain keywords with option to set from what type and subtype",
					"group": "Guest",
				},
				"commonFields": ["start", "limit", "keywords"],
				"type": {
					"source": ['query.type'],
					"required": false,
					"validation": {"type": "string"}
				},
				"subtype": {
					"source": ['query.subtype'],
					"required": false,
					"validation": {"type": "string"}
				}
			},
			'/items': {
				"_apiInfo": {
					"l": "List items matching certain keywords with option to set from what type and subtype",
					"group": "Item",
				},
				"commonFields": ["start", "limit", "keywords"],
				"type": {
					"source": ['query.type'],
					"required": false,
					"validation": {"type": "string"}
				},
				"subtype": {
					"source": ['query.subtype'],
					"required": false,
					"validation": {"type": "string"}
				}
			},
			'/items/type': {
				"_apiInfo": {
					"l": "List items matching a type with option to set subtype",
					"group": "Item"
				},
				"commonFields": ["start", "limit"],
				"type": {
					"source": ['query.type'],
					"required": true,
					"validation": {"type": "string"}
				},
				"subtype": {
					"source": ['query.subtype'],
					"required": false,
					"validation": {"type": "string"}
				}
			}
		},
		
		"put": {
			'/soajs/item/environments': {
				"_apiInfo": {
					"l": "Update item environments from soajs only",
					"group": "SOAJS"
				},
				"commonFields": ["id"],
				"type": {
					"source": ['body.type'],
					"required": true,
					"validation": {
						"type": "string",
						"enum": ["blackList", "whitelist"]
					}
				},
				"environments": {
					"source": ['body.environments'],
					"required": true,
					"validation": {
						"type": "array",
						"minItems": 1
					}
				}
			},
			'/soajs/item/recipes': {
				"_apiInfo": {
					"l": "Update item recipes from soajs only",
					"group": "SOAJS"
				},
				"commonFields": ["id"],
				"recipes": {
					"source": ['body.recipes'],
					"required": true,
					"validation": {
						"type": "array",
						"minItems": 1
					}
				}
			},
			'/soajs/item/acl': {
				"_apiInfo": {
					"l": "Update item ACL from soajs only",
					"group": "SOAJS"
				},
				"commonFields": ["id"],
				"type": {
					"source": ['body.type'],
					"required": true,
					"validation": {
						"type": "string",
						"enum": ["blackList", "whitelist"]
					}
				},
				"groups": {
					"source": ['body.groups'],
					"required": true,
					"validation": {
						"type": "array",
						"minItems": 1
					}
				}
			}
			
		}
		
	}
};