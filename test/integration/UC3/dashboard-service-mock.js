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
	"serviceName": "dashboard",
	"serviceGroup": "Console",
	"servicePort": 4003,
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
			"/catalog/recipes/get": {
				"_apiInfo": {
					"l": "Get a Catalog",
					"group": "Catalog"
				},
				"id": {
					"source": ['query.id'],
					"required": true,
					"validation": {
						"type": "string"
					}
				}
			}
		}
	}
};
config.packagejson = {};
const service = new soajs.server.service(config);

let recipe = {
	"_id": "123",
	"recipe": {
		"buildOptions": {
			"env": {
				"SECRET_ENV": {
					"type": "secret"
				},
				"USER_ENV": {
					"type": "userInput"
				},
				"SOAJS_ENV": {
					type: "computed",
					value: "$SOAJS_ENV"
				},
				"SOAJS_DEPLOY_HA": {
					type: "computed",
					value: "$SOAJS_DEPLOY_HA"
				},
				"SOAJS_PROFILE": {
					type: "static",
					value: "/opt/soajs/profile/soajsprofile"
				},
				"SOAJS_MONGO_CON_KEEPALIVE": {
					type: "static",
					value: "true"
				},
				"SOAJS_NX_DOMAIN": {
					type: "computed",
					value: "$SOAJS_NX_DOMAIN"
				},
				"SOAJS_NX_SITE_DOMAIN": {
					type: "computed",
					value: "$SOAJS_NX_SITE_DOMAIN"
				},
				"SOAJS_NX_API_DOMAIN": {
					type: "computed",
					value: "$SOAJS_NX_API_DOMAIN"
				},
				"SOAJS_SRV_PORT": {
					type: "computed",
					value: "$SOAJS_SRV_PORT"
				},
				"SOAJS_SRV_PORT_MAINTENANCE": {
					type: "computed",
					value: "$SOAJS_SRV_PORT_MAINTENANCE"
				},
				"SOAJS_SERVICE_NAME": {
					type: "computed",
					value: "$SOAJS_SERVICE_NAME"
				},
				"SOAJS_NX_CONTROLLER_PORT": {
					type: "computed",
					value: "$SOAJS_NX_CONTROLLER_PORT"
				},
				"SOAJS_CONTROLLER_PORT_MAINTENANCE": {
					type: "computed",
					value: "$SOAJS_CONTROLLER_PORT_MAINTENANCE"
				},
				"SOAJS_NX_CONTROLLER_IP": {
					type: "computed",
					value: "$SOAJS_NX_CONTROLLER_IP"
				},
				"SOAJS_REGISTRY_API": {
					type: "computed",
					value: "$SOAJS_REGISTRY_API"
				},
				"SOAJS_EXTKEY": {
					type: "computed",
					value: "$SOAJS_EXTKEY"
				}
			}
		},
		"deployOptions": {
			image: {
				prefix: "soajsorg",
				name: "deploy",
				tag: "latest",
				pullPolicy: "Always",
				repositoryType: "public",
				override: true,
				binary: false
			},
			sourceCode: {
				"label": "test",
				"catalog": "config-deploy",
				"id": "98023",
				"version": "test",
				"branch": "master",
			},
			readinessProbe: {
				exec: {
					command: [
						"ls"
					]
				},
				initialDelaySeconds: 5,
				timeoutSeconds: 5,
				periodSeconds: 5,
				successThreshold: 5,
				failureThreshold: 5,
			},
			livenessProbe: null,
			ports: [
				{
					name: "http",
					target: 80,
					isPublished: true,
					published: 30080
				}
			],
			voluming: [
				{
					docker: {},
					kubernetes: {
						volume: {
							name: "soajsprofile",
							secret: {
								secretName: "soajsprofile"
							}
						},
						volumeMount: {
							mountPath: "/opt/soajs/profile/",
							name: "soajsprofile"
						}
					}
				}
			],
			restartPolicy: {
				condition: "any",
				maxAttempts: 4
			},
			container: {
				network: "soajsnet",
				workingDir: ""
			},
			labels: {
				ragheb: "ragheb"
			},
			execCommands: {
				list: "ls -l"
			}
		}
	}
};

function run(serviceStartCb) {
	service.init(() => {
		service.get("/catalog/recipes/get", function (req, res) {
			return res.json(req.soajs.buildResponse(null, recipe));
			
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
