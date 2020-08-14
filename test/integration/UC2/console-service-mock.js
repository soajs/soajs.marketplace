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
		
		"commonFields": {
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
			"env": {
				"source": ["body.env", "query.env"],
				"required": true,
				"validation": {
					"type": "string"
				}
			},
		},
		
		"get": {
			"/registry": {
				"_apiInfo": {
					"l": "This API gets a registry",
					"group": "Registry"
				},
				"commonFields": ["env"]
			}
		}
	}
};
config.packagejson = {};
const service = new soajs.server.service(config);

let manual = {
	code: "DASHBOARD",
	deployer: {
		type: "manual",
		selected: "manual",
		manual: {
			nodes: "127.0.0.1"
		},
		container: {
			docker: {
				local: {
					nodes: "",
					socketPath: "/var/run/docker.sock"
				},
				remote: {
					apiPort: "",
					nodes: "",
					apiProtocol: "",
					auth: {
						token: ""
					}
				}
			}
		}
	},
};

let container = {
	code: "DASHBOARD",
	deployer: {
		type: "container",
		selected: "container.kubernetes",
		container: {
			kubernetes: {
				id: "5ef30a5b5f04686c4f63f693",
				namespace: "dashboard"
			}
		}
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
			},
		}
	}
};

function run(serviceStartCb) {
	service.init(() => {
		service.get("/registry", function (req, res) {
			if (req.soajs.inputmaskData.env === "DASHBOARD") {
				return res.json(req.soajs.buildResponse(null, manual));
			} else {
				return res.json(req.soajs.buildResponse(null, container));
			}
			
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
