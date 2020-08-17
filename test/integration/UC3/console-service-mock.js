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
	"serviceVersion": "1",
	"serviceName": "console",
	"serviceGroup": "Console",
	"servicePort": 4009,
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
		"get": {
			"/registry": {
				"_apiInfo": {
					"l": "This API gets a registry",
					"group": "Registry"
				},
				"env": {
					"source": ["body.env", "query.env"],
					"required": true,
					"validation": {
						"type": "string"
					}
				}
			},
		},
		"post": {
			"/ledger": {
				"_apiInfo": {
					"l": "This API adds an entry to the ledger of a specific type",
					"group": "Ledger"
				},
				"doc": {
					"source": ["body.doc"],
					"required": true,
					"validation": {
						"type": "object",
						"properties": {
							"type": {
								"type": "string",
								"enum": ["Registry", "Deployment", "Notification"]
							},
							"section": {
								"type": "string",
								"enum": ["Default", "Custom", "Throttling", "DB", "Resource configuration", "Catalog", "Continuous delivery", "Kubernetes", "Environment"]
							},
							"locator": {
								"type": "array",
								"minItems": 1,
								"items": {
									"type": "string"
								}
							},
							"action": {
								"type": "string",
								"enum": ["deleted", "updated", "added"]
							},
							"env": {
								"type": "string"
							},
							"status": {
								"source": ["body.status"],
								"type": "string",
								"enum": ["failed", "succeeded"]
							},
							"header": {
								"source": ['body.header'],
								"type": "object"
							},
							"input": {
								"source": ['body.input'],
								"type": "object"
							},
							"output": {
								"source": ['body.output'],
								"type": "object"
							}
						},
						"required": ["type", "locator", "action", "status", "section"]
					}
				}
			},
		}
	}
};
config.packagejson = {};
const service = new soajs.server.service(config);

let env = {
	code: "NEW",
	description: "new",
	domain: "soajs.org",
	sitePrefix: "site",
	apiPrefix: "api",
	port: 443,
	protocol: "https",
	deployer: {
		type: "container",
		selected: "container.kubernetes",
		container: {
			kubernetes: {
				id: "5ef30a5b5f04686c4f63f693",
				namespace: "new"
			}
		}
	},
	dbs: {
		config: {
			prefix: ""
		},
		databases: {}
	},
	services: {
		controller: {
			authorization: false,
		},
		config: {
			ports: {
				controller: 4000,
				maintenanceInc: 1000,
				randomInc: 100
			}
		}
	}
};

function run(serviceStartCb) {
	service.init(() => {
		service.get("/registry", function (req, res) {
			return res.json(req.soajs.buildResponse(null, env));
			
		});
		service.post("/ledger", function (req, res) {
			return res.json(req.soajs.buildResponse(null, true));
			
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
