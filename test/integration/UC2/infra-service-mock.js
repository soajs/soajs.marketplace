"use strict";

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const soajs = require('soajs');

let config = {
	"type": 'service',
	'subType': 'soajs',
	"description": "This service takes care of updates and upgrades as well as everything related to registry",
	prerequisites: {
		cpu: '',
		memory: ''
	},
	"serviceVersion": 1,
	"serviceName": "infra",
	"serviceGroup": "Console",
	"servicePort": 4008,
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
	//-------------------------------------
	"errors": {
		400: "Business logic required data are missing",
	},
	"schema": {
		"commonFields": {
			"configuration": {
				"source": ["body.configuration", "query.configuration"],
				"required": true,
				"validation": {
					"type": "object",
					"properties": {
						"id": {
							"type": "string"
						},
						"env": {
							"type": "string",
							"pattern": /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/,
						},
						"namespace": {
							"type": "string"
						},
						"type": {
							"type": "string",
							"enum": ["secret"]
						},
						"token": {
							"type": "string"
						},
						"url": {
							"type": "string"
						}
					},
					"oneOf": [
						{
							"required": ["id"]
						},
						{
							"required": ["env"]
						},
						{
							"required": ["namespace", "type", "token", "url"]
						}
					]
				}
			}
		},
		
		"get": {
			"/kubernetes/item/maintenance": {
				"_apiInfo": {
					"l": "This API trigger maintenance operation on a deployed item.",
					"group": "Kubernetes item"
				},
				"commonFields": ["configuration"],
				"name": {
					"source": ["body.name"],
					"required": true,
					"validation": {
						"type": "object",
						"properties": {
							"metaname": {
								"type": "string"
							},
							"item": {
								"type": "object",
								"additionalProperties": false,
								"properties": {
									"env": {
										"type": "string",
										"pattern": /^(([a-z0-9][-a-z0-9_.]*)?[a-z0-9])?$/,
										"minLength": 1
									},
									"name": {
										"type": "string",
										"pattern": /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/,
										"minLength": 1
									},
									"version": {
										"type": "string",
										"pattern": /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/,
										"minLength": 1
									}
								},
								"required": ["env", "name", "version"]
							}
						},
						"oneOf": [
							{
								"required": ["metaname"]
							},
							{
								"required": ["item"]
							}
						]
					}
				},
				"maintenancePort": {
					"source": ["body.maintenancePort"],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"operation": {
					"source": ["body.operation"],
					"required": true,
					"validation": {
						"type": "object",
						"additionalProperties": false,
						"properties": {
							"route": {
								"type": "string"
							},
							"qs": {
								"type": "string"
							}
						},
						"required": ["route"]
					}
				}
			},
		}
	}
};
config.packagejson = {};
const service = new soajs.server.service(config);

function run(serviceStartCb) {
	service.init(() => {
		service.put("/kubernetes/item/maintenance", function (req, res) {
			return res.json(req.soajs.buildResponse(null, {
				"operation" : "successful"
			}));
			
		});
		service.start(serviceStartCb);
	});
}

function stop(serviceStopCb) {
	service.stop(serviceStopCb);
}

module.exports = {
	"runService": (serviceStartCb) => {
		if (serviceStartCb && typeof serviceStartCb === "function") {
			run(serviceStartCb);
		} else {
			run(null);
		}
	},
	"stopService": (serviceStopCb) => {
		if (serviceStopCb && typeof serviceStopCb === "function") {
			stop(serviceStopCb);
		} else {
			stop(null);
		}
	}
};
