/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

'use strict';

const item_resource_schema = require("./driver/resource/validator.js");
const item_service_schema = require("./driver/service/validator.js");
const item_daemon_schema = require("./driver/daemon/validator.js");
const item_static_schema = require("./driver/static/validator.js");
const item_custom_schema = require("./driver/custom/validator.js");
const item_config_schema = require("./driver/config/validator.js");
const item_soajs_schema = require("./driver/soajs/validator.js");

module.exports = {
	"type": 'service',
	'subType': 'soajs',
	"description": "This service provides the ability to create a heterogeneous catalog capable to automatically adapt and onboard all kind of different type of components is the way to go.",
	"prerequisites": {
		cpu: '',
		memory: ''
	},
	"serviceVersion": "1",
	"serviceName": "marketplace",
	"serviceGroup": "Console",
	"servicePort": 4007,
	"requestTimeout": 30,
	"requestTimeoutRenewal": 5,
	"oauth": true,
	"extKeyRequired": true,
	"urac": true,
	
	"maintenance": {
		"readiness": "/heartbeat",
		"port": {"type": "maintenance"},
		"commands": [
			{"label": "Reload Registry", "path": "/reloadRegistry", "icon": "fas fa-undo"},
			{"label": "Resource Info", "path": "/resourceInfo", "icon": "fas fa-info"}
		]
	},
	"interConnect": [
		{
			"name": "dashboard",
			"version": "1"
		},
		{
			"name": "infra",
			"version": "1"
		},
		{
			"name": "repository",
			"version": "1"
		}
	],
	//-------------------------------------
	"errors": {
		400: "Business logic required data are missing",
		
		401: "Catalog Entry with same DNA detected!",
		402: "Branch or Tag is required",
		403: "Branch not found",
		404: "Tag not found",
		405: "Recipe not allowed for this item!",
		406: "You are not allowed to deploy this item in this environment!",
		407: "The deploy configuration of this Environment was not found",
		408: "User Input environment variable not found!",
		409: "Secret environment variable not provided!",
		410: "The deploy configuration of this version was not found",
		411: "Gateway information not found!",
		412: "Invalid git information",
		413: "Item not deployed!",
		414: "Invalid Deploy Token!",
		415: "Deploy Token is inactive!",
		416: "Unable to find healthy configuration in registry.",
		500: "Nothing to Update!",
		501: "Item not found!",
		502: "Item is locked!",
		503: "Service Error",
		
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
			},
			
			'/items/src': {
				"_apiInfo": {
					"l": "This API gets an item by its source.",
					"group": "Item"
				},
				"provider": {
					"source": ['query.provider'],
					"required": true,
					"validation": {"type": "string"}
				},
				"owner": {
					"source": ['query.owner'],
					"required": true,
					"validation": {"type": "string"}
				},
				"repo": {
					"source": ['query.repo'],
					"required": true,
					"validation": {"type": "string"}
				}
			},
			
			'/item/type': {
				"_apiInfo": {
					"l": "This API get one item by its name and type.",
					"group": "Item"
				},
				"name": {
					"source": ['query.name'],
					"required": true,
					"validation": {"type": "string"}
				},
				"type": {
					"source": ['query.type'],
					"required": true,
					"validation": {"type": "string"}
				}
			},
			
			"/item/deploy/inspect": {
				"_apiInfo": {
					"l": "This API gets the configure deployment of an item including (allowed recipes, saved configuration, and kubernetes configuration for both service and deployment|daemonset)",
					"group": "Item deploy"
				},
				"commonFields": ["id"]
			}
		},
		
		"delete": {
			"/item": {
				"_apiInfo": {
					"l": "This API deletes an item",
					"group": "Item management"
				},
				"type": {
					"source": ['query.type'],
					"required": true,
					"validation": {
						"type": "string",
						"enum": ["resource"]
					}
				},
				"name": {
					"source": ['query.name'],
					"required": true,
					"validation": {
						"type": "string",
						"pattern": /^[a-zA-Z0-9_-]+$/
					}
				}
			},
			
			"/items/src": {
				"_apiInfo": {
					"l": "This API deletes items by source",
					"group": "Item management"
				},
				"provider": {
					"source": ['query.provider'],
					"required": true,
					"validation": {"type": "string"}
				},
				"owner": {
					"source": ['query.owner'],
					"required": true,
					"validation": {"type": "string"}
				},
				"repo": {
					"source": ['query.repo'],
					"required": true,
					"validation": {"type": "string"}
				}
			},
			
			"/item/configure/deploy": {
				"_apiInfo": {
					"l": "This API deletes the configure deployment of an item",
					"group": "Item deploy"
				}
			}
		},
		
		"put": {
			
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
						"enum": ["blacklist", "whitelist"]
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
						"enum": ["blacklist", "whitelist"]
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
						"enum": ["blacklist", "whitelist"]
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
						"enum": ["blacklist", "whitelist"]
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
			
			"/item/resource": {
				"_apiInfo": {
					"l": "This API adds/updates an item of type resource to the catalog",
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
					"l": "This API adds/updates an item of type service to the catalog",
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
					"l": "This API adds/updates an item of type daemon to the catalog",
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
					"l": "This API adds/updates an item of type static to the catalog",
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
					"l": "This API adds/updates an item of type custom to the catalog",
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
					"l": "This API adds/updates an item of type config to the catalog",
					"group": "Item management"
				},
				"item": {
					"source": ['body.item'],
					"required": true,
					"validation": item_config_schema
				}
			},
			"/item/version/configuration": {
				"_apiInfo": {
					"l": "This API appends the version configuration of an item.",
					"group": "Item management"
				},
				"name": {
					"source": ['body.name'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"type": {
					"source": ['body.type'],
					"required": true,
					"validation": {
						"type": "string",
						"enum": ["service"]
					}
				},
				"env": {
					"source": ['body.env'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"version": {
					"source": ['body.version'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"settings": {
					"source": ['body.settings'],
					"required": true,
					"validation": {
						"type": "object",
						"properties": {
							"extKeyRequired": {
								"type": "boolean",
								"required": true
							},
							"oauth": {
								"type": "string",
								"required": true
							}
						}
					}
				}
			},
			// SOAJS Framework
			"/item/service/soajs": {
				"_apiInfo": {
					"l": "This API adds/updates an item of type service built using the SOAJS Framework (config.js)",
					"group": "Item management"
				},
				"item": {
					"source": ['body.item'],
					"required": true,
					"validation": item_soajs_schema
				}
			},
			
			"/item/deploy/redeploy": {
				"_apiInfo": {
					"l": "This API redeploys a deployed item",
					"group": "Item deploy"
				},
				"name": {
					"source": ['query.name'],
					"required": true,
					"validation": {
						"type": "string",
					}
				},
				"type": {
					"source": ['query.type'],
					"required": true,
					"validation": {
						"type": "string",
					}
				},
				"env": {
					"source": ['query.env'],
					"required": true,
					"validation": {
						"type": "string",
					}
				},
				"version": {
					"source": ['query.version'],
					"required": true,
					"validation": {
						"type": "string",
					}
				},
				"image": {
					"source": ['body.image'],
					"required": false,
					"validation": {
						"type": "object",
						"properties": {
							"tag": {
								"type": "string",
								"required": true,
							}
						}
					}
				},
				"src": {
					"source": ['body.src'],
					"required": false,
					"validation": {
						"type": "object",
						"properties": {
							"from": {
								"type": "object",
								"properties": {
									"tag": {
										"type": "string",
										"pattern": /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/,
										"minLength": 1
									},
									"branch": {
										"type": "string",
										"pattern": /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/,
										"minLength": 1
									},
									"commit": {
										"type": "string",
										"pattern": /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/,
										"minLength": 1
									},
								},
								"oneOf": [
									{
										"required": ["tag"]
									},
									{
										"required": ["branch", "commit"]
									}
								]
							},
							"required": ["from"]
						},
					}
				},
			},
			"/item/deploy/cd": {
				"_apiInfo": {
					"l": "This API deploys an item used by CI",
					"group": "Item deploy"
				},
				"token": {
					"source": ['query.token'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"repo_token": {
					"source": ['query.repo_token'],
					"required": false,
					"validation": {
						"type": "string"
					}
				},
				"name": {
					"source": ['query.name'],
					"required": true,
					"validation": {
						"type": "string",
					}
				},
				"type": {
					"source": ['query.type'],
					"required": true,
					"validation": {
						"type": "string",
					}
				},
				"version": {
					"source": ['query.version'],
					"required": true,
					"validation": {
						"type": "string",
					}
				},
				"config": {
					"source": ["body.config"],
					"required": true,
					"validation": {
						"type": "object",
						"required": ["from"],
						"properties": {
							"from": {
								"type": "object",
								"properties": {
									"tag": {
										"type": "string",
										"pattern": /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/,
										"minLength": 1
									},
									"branch": {
										"type": "string",
										"pattern": /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/,
										"minLength": 1
									},
									"commit": {
										"type": "string",
										"pattern": /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/,
										"minLength": 1
									},
									"image_prefix": {
										"type": "string"
									},
									"image_name": {
										"type": "string"
									},
									"image_tag": {
										"type": "string"
									},
									"env": {
										"type": "array",
										"items": {
											"type": "string"
										}
									}
								},
								"oneOf": [
									{
										"required": ["tag"]
									},
									{
										"required": ["branch", "commit"]
									},
									{
										"required": ["image_tag", "image_name", "image_prefix"]
									}
								]
							},
							
						}
					}
				}
			},
			"/item/deploy": {
				"_apiInfo": {
					"l": "This API deploys an item",
					"group": "Item deploy"
				},
				"type": {
					"source": ['query.type'],
					"required": true,
					"validation": {
						"type": "string",
					}
				},
				"name": {
					"source": ['query.name'],
					"required": true,
					"validation": {
						"type": "string",
						"pattern": /^[a-zA-Z0-9_-]+$/
					}
				},
				"env": {
					"source": ['query.env'],
					"required": true,
					"validation": {
						"type": "string",
					}
				},
				"version": {
					"source": ['query.version'],
					"required": true,
					"validation": {
						"type": "string",
					}
				}
			},
			"/item/deploy/configure": {
				"_apiInfo": {
					"l": "This API updates the configure deployment of an item",
					"group": "Item deploy"
				},
				"type": {
					"source": ['query.type', 'body.type'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"name": {
					"source": ['body.name', 'query.name'],
					"required": true,
					"validation": {
						"type": "string",
						"pattern": /^[a-zA-Z0-9_-]+$/
					}
				},
				"config": {
					"source": ['body.config'],
					"required": true,
					"validation": {
						"type": "object",
						"additionalProperties": false,
						"properties": {
							"env": {
								"required": true,
								"type": "string"
							},
							"version": {
								"required": true,
								"type": "string"
							},
							"cd": {
								"required": true,
								"type": "object",
								"additionalProperties": false,
								"properties": {
									"strategy": {
										"required": true,
										"type": "string",
										"enum": ["notify", "update"]
									}
								}
							},
							"settings": {
								"required": true,
								"additionalProperties": false,
								"type": "object",
								"properties": {
									"memory": {
										"required": true,
										"type": "string",
									},
									"mode": {
										"required": true,
										"type": "string",
										"enum": ["Deployment", "Daemonset", "cronJob"]
									},
									"replicas": {
										"required": false,
										"type": "integer",
									}
								}
							},
							"src": {
								"type": "object",
								"properties": {
									"from": {
										"type": "object",
										"properties": {
											"tag": {
												"type": "string",
												"pattern": /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/,
												"minLength": 1
											},
											"branch": {
												"type": "string",
												"pattern": /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/,
												"minLength": 1
											},
											"commit": {
												"type": "string",
												"pattern": /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/,
												"minLength": 1
											},
										},
										"oneOf": [
											{
												"required": ["tag"]
											},
											{
												"required": ["branch", "commit"]
											}
										]
									},
									"id": {
										"type": "string",
									}
								},
								"required": ["from", "id"]
							},
							"autoScale": {
								"type": "object",
								"required": false,
								"properties": {
									"replicas": {
										"required": true,
										"type": "object",
										"properties": {
											"min": {"required": true, "type": "integer", "min": 1},
											"max": {"required": true, "type": "integer", "min": 1}
										},
										"additionalProperties": false
									},
									"metrics": {
										"required": true,
										"type": "object",
										"properties": {
											"cpu": {
												"required": true,
												"type": "object",
												"properties": {
													"percent": {"required": true, "type": "number"}
												},
												"additionalProperties": false
											}
										},
										"additionalProperties": false
									}
								},
								"additionalProperties": false
							},
							"recipe": {
								"required": true,
								"additionalProperties": false,
								"type": "object",
								"properties": {
									"id": {
										"required": true,
										"type": "string"
									},
									"image": {
										"required": false,
										"additionalProperties": false,
										"type": "object",
										"properties": {
											"name": {
												"required": true,
												"type": "string"
											},
											"prefix": {
												"required": true,
												"type": "string"
											},
											"tag": {
												"required": true,
												"type": "string"
											}
										}
									},
									"ports": {
										"required": false,
										"type": "array",
										"items": {
											"type": "object",
											"properties": {
												"name": {
													"type": "string",
													"required": true
												},
												"target": {
													"type": "integer",
													"required": false
												},
												"isPublished": {
													"type": "boolean",
													"required": false
												}
											}
										}
									},
									"env": {
										"required": false,
										"additionalProperties": false,
										"type": "object",
										"patternProperties": {
											"^.*$": {
												"anyOf": [
													//normal
													{
														"type": "string",
														"required": true,
													},
													//secret
													{
														"type": "object",
														"properties": {
															"name": {
																"type": "string",
																"required": true,
															},
															"key": {
																"type": "string",
																"required": true,
															}
														}
													}
												]
											}
										}
									}
								}
							}
						}
					}
				}
			},
			"/item/deploy/build": {
				"_apiInfo": {
					"l": "This API updates the configure deployment of an item and deploy",
					"group": "Item deploy"
				},
				"type": {
					"source": ['query.type'],
					"required": true,
					"validation": {
						"type": "string",
					}
				},
				"name": {
					"source": ['query.name'],
					"required": true,
					"validation": {
						"type": "string",
						"pattern": /^[a-zA-Z0-9_-]+$/
					}
				},
				"version": {
					"source": ['query.version'],
					"required": true,
					"validation": {
						"type": "string",
					}
				},
				"config": {
					"source": ['body.config'],
					"required": true,
					"validation": {
						"type": "object",
						"additionalProperties": false,
						"properties": {
							"env": {
								"required": true,
								"type": "string"
							},
							"version": {
								"required": true,
								"type": "string"
							},
							"cd": {
								"required": true,
								"type": "object",
								"additionalProperties": false,
								"properties": {
									"strategy": {
										"required": true,
										"type": "string",
										"enum": ["notify", "update"]
									}
								}
							},
							"settings": {
								"required": true,
								"additionalProperties": false,
								"type": "object",
								"properties": {
									"memory": {
										"required": true,
										"type": "string",
									},
									"mode": {
										"required": true,
										"type": "string",
										"enum": ["Deployment", "Daemonset", "cronJob"]
									},
									"replicas": {
										"required": false,
										"type": "integer",
									}
								}
							},
							"src": {
								"type": "object",
								"properties": {
									"from": {
										"type": "object",
										"properties": {
											"tag": {
												"type": "string",
												"pattern": /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/,
												"minLength": 1
											},
											"branch": {
												"type": "string",
												"pattern": /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/,
												"minLength": 1
											},
											"commit": {
												"type": "string",
												"pattern": /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/,
												"minLength": 1
											},
										},
										"oneOf": [
											{
												"required": ["tag"]
											},
											{
												"required": ["branch", "commit"]
											}
										]
									},
									"id": {
										"type": "string",
									}
								},
								"required": ["from", "id"]
							},
							"autoScale": {
								"type": "object",
								"required": false,
								"properties": {
									"replicas": {
										"required": true,
										"type": "object",
										"properties": {
											"min": {"required": true, "type": "integer", "min": 1},
											"max": {"required": true, "type": "integer", "min": 1}
										},
										"additionalProperties": false
									},
									"metrics": {
										"required": true,
										"type": "object",
										"properties": {
											"cpu": {
												"required": true,
												"type": "object",
												"properties": {
													"percent": {"required": true, "type": "number"}
												},
												"additionalProperties": false
											}
										},
										"additionalProperties": false
									}
								},
								"additionalProperties": false
							},
							"recipe": {
								"required": true,
								"additionalProperties": false,
								"type": "object",
								"properties": {
									"id": {
										"required": true,
										"type": "string"
									},
									"image": {
										"required": false,
										"additionalProperties": false,
										"type": "object",
										"properties": {
											"name": {
												"required": true,
												"type": "string"
											},
											"prefix": {
												"required": true,
												"type": "string"
											},
											"tag": {
												"required": true,
												"type": "string"
											}
										}
									},
									"ports": {
										"required": false,
										"type": "array",
										"items": {
											"type": "object",
											"properties": {
												"name": {
													"type": "string",
													"required": true
												},
												"target": {
													"type": "integer",
													"required": false
												},
												"isPublished": {
													"type": "boolean",
													"required": false
												}
											}
										}
									},
									"env": {
										"required": false,
										"additionalProperties": false,
										"type": "object",
										"patternProperties": {
											"^.*$": {
												"anyOf": [
													//normal
													{
														"type": "string",
														"required": true,
													},
													//secret
													{
														"type": "object",
														"properties": {
															"secret": {
																"type": "string",
																"required": true,
															},
															"key": {
																"type": "string",
																"required": true,
															}
														}
													}
												]
											}
										}
									}
								}
							}
						}
					}
				}
			},
			
			"/item/branch": {
				"_apiInfo": {
					"l": "This API appends an item by branch",
					"group": "Item management"
				},
				"name": {
					"source": ['query.name'],
					"required": true,
					"validation": {"type": "string"}
				},
				"type": {
					"source": ['query.type'],
					"required": true,
					"validation": {"type": "string"}
				},
				"branch": {
					"source": ['query.branch'],
					"required": true,
					"validation": {"type": "string"}
				}
			},
			"/item/tag": {
				"_apiInfo": {
					"l": "This API appends an item by tag",
					"group": "Item management"
				},
				"name": {
					"source": ['query.name'],
					"required": true,
					"validation": {"type": "string"}
				},
				"type": {
					"source": ['query.type'],
					"required": true,
					"validation": {"type": "string"}
				},
				"tag": {
					"source": ['query.tag'],
					"required": true,
					"validation": {"type": "string"}
				}
			},
		}
	}
}
;