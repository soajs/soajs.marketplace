/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

'use strict';

const item_resource_schema = require("./schema/item_resource.js");
const item_service_schema = require("./schema/item_service.js");
const item_daemon_schema = require("./schema/item_daemon.js");
const item_static_schema = require("./schema/item_static.js");
const item_custom_schema = require("./schema/item_custom.js");
const item_config_schema = require("./schema/item_config.js");

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
					"l": "This API lists the items matching certain keywords from soajs catalog only.",
					"group": "SOAJS",
				},
				"commonFields": ["start", "limit", "keywords"]
			},
			'/public/items': {
				"_apiInfo": {
					"l": "This API lists the public items matching certain keywords with option to select from what type and subtype.",
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
					"l": "This API lists the items matching certain keywords with option to select from what type and subtype.",
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
					"l": "This API lists the items matching certain type with option to select a subtype.",
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
		"post": {
			"/item/resource": {
				"_apiInfo": {
					"l": "This API adds an item of type resource to the catalog",
					"group": "Item management"
				},
				"item": {
					"source": ['body.item'],
					"required": true,
					"validation": item_resource_schema
				}
			},
			"/item/service": {
				"_apiInfo": {
					"l": "This API adds an item of type service to the catalog",
					"group": "Item management"
				},
				"item": {
					"source": ['body.item'],
					"required": true,
					"validation": item_service_schema
				}
			},
			"/item/daemon": {
				"_apiInfo": {
					"l": "This API adds an item of type daemon to the catalog",
					"group": "Item management"
				},
				"item": {
					"source": ['body.item'],
					"required": true,
					"validation": item_daemon_schema
				}
			},
			"/item/static": {
				"_apiInfo": {
					"l": "This API adds an item of type static to the catalog",
					"group": "Item management"
				},
				"item": {
					"source": ['body.item'],
					"required": true,
					"validation": item_static_schema
				}
			},
			"/item/custom": {
				"_apiInfo": {
					"l": "This API adds an item of type custom to the catalog",
					"group": "Item management"
				},
				"item": {
					"source": ['body.item'],
					"required": true,
					"validation": item_custom_schema
				}
			},
			"/item/config": {
				"_apiInfo": {
					"l": "This API adds an item of type config to the catalog",
					"group": "Item management"
				},
				"item": {
					"source": ['body.item'],
					"required": true,
					"validation": item_config_schema
				}
			}
		},
		"delete": {
			"/item": {
				"_apiInfo": {
					"l": "This API deletes an item",
					"group": "Item management"
				},
				"commonFields": ["id"]
			}
		},
		"put": {
			"/item": {
				"_apiInfo": {
					"l": "This API updates an item",
					"group": "Item management"
				},
				"commonFields": ["id"]
			},
			"/item/configure/deploy": {
				"_apiInfo": {
					"l": "This API updates the configure deployment of an item",
					"group": "Item management"
				},
				"commonFields": ["id"]
			},
			"/item/deploy": {
				"_apiInfo": {
					"l": "THis API deploy an item",
					"group": "Item management"
				},
				"commonFields": ["id"]
			},
			'/item/environments': {
				"_apiInfo": {
					"l": "This API updates the item environments",
					"group": "Item settings"
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
			'/item/recipes': {
				"_apiInfo": {
					"l": "This API updates the item recipes",
					"group": "Item settings"
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
			'/item/acl': {
				"_apiInfo": {
					"l": "This API updates the item ACL",
					"group": "Item settings"
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
			},
			'/soajs/item/environments': {
				"_apiInfo": {
					"l": "This API updates the item environments from soajs catalog only",
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
					"l": "This API updates the item recipes from soajs catalog only",
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
					"l": "This API updates the item ACL from soajs catalog only",
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