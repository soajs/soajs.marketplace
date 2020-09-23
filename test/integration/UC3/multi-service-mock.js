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
	"serviceName": "multitenant",
	"serviceGroup": "Console",
	"servicePort": 4004,
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
			"/tenant/console": {
				_apiInfo: {
					"l": "Get Console tenant",
					"group": "Console Tenant"
				},
				"code": {
					"source": ['query.code'],
					"required": true,
					"validation": {
						"type": "string"
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
		service.get("/tenant/console", function (req, res) {
			return res.json(req.soajs.buildResponse(null, {
				code: "DBTN",
				applications: [
					{
						product: "DSBRD",
						package: "DSBRD_GUEST",
						description: "Dashboard application for DSBRD_GUEST package",
						keys: [
							{
								key: "a139786a6e6d18e48b4987e83789430b",
								extKeys: [
									{
										extKey: "98",
										device: null,
										geo: null,
										env: "DASHBOARD",
										dashboardAccess: true,
										expDate: null
									}
								]
							}
						]
					}
				],
				console: true,
				description: "This is the tenant that holds the access rights and configuration for the console users with DSBRD_GUEST as Guest default package",
				locked: true,
				name: "Console Tenant",
				tag: "Console",
				type: "product"
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
