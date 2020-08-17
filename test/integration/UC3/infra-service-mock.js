"use strict";

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const soajs = require('soajs');
const __ = require('underscore');

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
			"/cd/token": {
				"_apiInfo": {
					"l": "This API returns a deployment cd token.",
					"group": "Token"
				},
				"token": {
					"source": ["query.token"],
					"required": true,
					"validation": {
						"type": "string"
					}
				}
			},
			
			"/kubernetes/services/:mode": {
				"_apiInfo": {
					"l": "This API returns the services information of all resources of mode (Service).",
					"group": "Kubernetes services"
				},
				"commonFields": ["configuration"],
				"filter": {
					"source": ["query.filter"],
					"required": false,
					"validation": {
						"type": "object",
						"additionalProperties": false,
						"properties": {
							"fieldSelector": {
								"type": "string"
							},
							"includeUninitialized": {
								"type": "boolean"
							},
							"labelSelector": {
								"type": "string"
							}
						}
					}
				}
			},
			"/kubernetes/item/inspect": {
				"_apiInfo": {
					"l": "This API returns the item information meshed (Service, Deployment, DaemonSet, CronJob, and Pod).",
					"group": "Kubernetes item"
				},
				"commonFields": ["configuration"],
				"item": {
					"source": ["query.item"],
					"required": true,
					"validation": {
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
				}
			},
		},
		"put": {
			"/kubernetes/item/redeploy": {
				"_apiInfo": {
					"l": "This API redeploys an item.",
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
				"mode": {
					"source": ["body.mode"],
					"required": true,
					"validation": {
						"type": "string",
						"enum": ["Deployment", "DaemonSet", "CronJob"]
					}
				},
				"serviceName": {
					"source": ["body.serviceName"],
					"required": false,
					"validation": {
						"type": "string"
					}
				},
				"image": {
					"source": ["body.image"],
					"required": false,
					"validation": {
						"type": "object",
						"properties": {
							"tag": {
								"type": "string"
							}
						},
						"required": ["tag"]
					}
				},
				"src": {
					"source": ["body.src"],
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
									}
								},
								"oneOf": [
									{
										"required": ["tag"]
									},
									{
										"required": ["branch", "commit"]
									}
								]
							}
						},
						"required": ["from"]
					}
				}
			},
		},
		"post": {
			"/kubernetes/item/deploy/soajs": {
				"_apiInfo": {
					"l": "This API deploys an item from the catalog using soajs recipe of type Deployment or DaemonSet.",
					"group": "Kubernetes item"
				},
				"commonFields": ["configuration"],
				"recipe": {
					"source": ["body.recipe"],
					"required": true,
					"validation": {
						"type": "object",
						"properties": {
							"catalog": {
								"type": "object",
								"additionalProperties": false,
								"properties": {
									"id": {
										"type": "string"
									},
									"version": {
										"type": "string"
									},
									"shell": {
										"type": "string",
										"pattern": /^(shell\/)([A-Za-z0-9\/_.]*)$/
									},
									"restartPolicy": {
										"type": "string"
									},
								},
								"required": ["id", "version", "shell"]
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
									"group": {
										"type": "string",
										"pattern": /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/,
										"minLength": 1
									},
									"type": {
										"type": "string",
										"pattern": /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/,
										"minLength": 1
									},
									"subtype": {
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
								"required": ["env", "name", "group", "type", "version"]
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
											}
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
									"repo": {
										"type": "string",
										"pattern": /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/,
										"minLength": 1
									},
									"owner": {
										"type": "string",
										"pattern": /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/,
										"minLength": 1
									}
								},
								"required": ["from", "repo", "owner"]
							},
							
							"mode": {
								"type": "string",
								"enum": ["Deployment", "DaemonSet"]
							},
							"labels": {
								"type": "object"
							},
							"image": {
								"type": "object",
								"properties": {
									"name": {
										"type": "string"
									},
									"imagePullPolicy": {
										"type": "string"
									},
									"secret": {
										"type": "string"
									}
								},
								"required": ["name", "imagePullPolicy"]
							},
							"ports": {
								"type": "array",
								"items": {
									"type": "object",
									"additionalProperties": false,
									"properties": {
										"name": {
											"type": "string"
										},
										"containerPort": {
											"type": "integer"
										}
									},
									"required": ["name", "containerPort"]
								}
							},
							"workingDir": {
								"type": "string"
							},
							"command": {
								"type": "array"
							},
							"args": {
								"type": "array"
							},
							"readinessProbe": {
								"type": "object"
							},
							"livenessProbe": {
								"type": "object"
							},
							"env": {
								"type": "array",
								"items": {
									"type": "object",
									"properties": {
										"name": {
											"type": "string"
										},
										"value": {
											"type": "string"
										},
										"valueFrom": {
											"type": "object",
											"additionalProperties": false,
											"properties": {
												"secretKeyRef": {
													"type": "object",
													"additionalProperties": false,
													"properties": {
														"name": {
															"type": "string"
														},
														"key": {
															"type": "string"
														}
													},
													"require": ["name", "key"]
												}
											},
											"required": ["secretKeyRef"]
										}
									},
									"oneOf": [
										{
											"required": ["name", "valueFrom"]
										},
										{
											"required": ["name", "value"]
										}
									]
								}
							},
							"volume": {
								"type": "object",
								"additionalProperties": false,
								"properties": {
									"volumeMounts": {
										"type": "array",
										"items": {
											"type": "object"
										}
									},
									"volumes": {
										"type": "array",
										"items": {
											"type": "object"
										}
									}
								}
							},
							"replicas": {
								"type": "integer",
								"default": 1
							},
							"revisionHistoryLimit": {
								"type": "integer",
								"default": 1
							},
							"service": {
								"type": "object",
								"additionalProperties": false,
								"properties": {
									"ports": {
										"type": "array",
										"items": {
											"type": "object",
											"additionalProperties": true,
											"properties": {
												"name": {
													"type": "string"
												},
												"port": {
													"type": "integer"
												}
											},
											"required": ["name", "port"]
										}
									},
									"type": {
										"type": "string"
									},
									"externalTrafficPolicy": {
										"type": "string"
									}
								}
							}
						},
						"required": ["catalog", "item", "image", "mode", "readinessProbe"]
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
		service.get("/kubernetes/services/:mode", function (req, res) {
			return res.json(req.soajs.buildResponse(null, {
				items: [{
					"metadata": {
						"name": "controller",
					},
					"spec": {
						"clusterIP": "1.0.0.1"
					}
				}]
			}));
		});
		
		service.get("/kubernetes/item/inspect", function (req, res) {
			return res.json(req.soajs.buildResponse(null, {
				"deployments": {
					items: [{
						"metadata": {}
					}]
				}
			}));
		});
		
		service.put("/kubernetes/item/redeploy", function (req, res) {
			return res.json(req.soajs.buildResponse(null, {
				"data": true
			}));
		});
		
		service.get("/cd/token", function (req, res) {
			return res.json(req.soajs.buildResponse(null, {
				"status": "active",
				"token": "12312312"
			}));
		});
		
		service.post("/kubernetes/item/deploy/soajs", function (req, res) {
			let check = __.isEqual(req.soajs.inputmaskData,
				{
					"recipe": {
						"env": [
							{
								"name": "SOAJS_GIT_OWNER",
								"value": "ragheb"
							},
							{
								"name": "SOAJS_GIT_BRANCH",
								"value": "master"
							},
							{
								"name": "SOAJS_GIT_COMMIT",
								"value": "123"
							},
							{
								"name": "SOAJS_GIT_REPO",
								"value": "deploy"
							},
							{
								"name": "SOAJS_GIT_PROVIDER",
								"value": "github"
							},
							{
								"name": "SOAJS_GIT_TOKEN",
								"value": "12345678"
							},
							{
								"name": "SOAJS_GIT_DOMAIN",
								"value": "github.com"
							},
							{
								"name": "SOAJS_NX_DOMAIN",
								"value": "soajs.org"
							},
							{
								"name": "SOAJS_NX_SITE_DOMAIN",
								"value": "site.soajs.org"
							},
							{
								"name": "SOAJS_NX_API_DOMAIN",
								"value": "api.soajs.org"
							},
							{
								"name": "SOAJS_SRV_PORT",
								"value": "6981"
							},
							{
								"name": "SOAJS_SRV_PORT_MAINTENANCE",
								"value": "NaN"
							},
							{
								"name": "SOAJS_ENV",
								"value": "new"
							},
							{
								"name": "SOAJS_SERVICE_NAME",
								"value": "deploy"
							},
							{
								"name": "SOAJS_NX_CONTROLLER_PORT",
								"value": "4000"
							},
							{
								"name": "SOAJS_CONTROLLER_PORT_MAINTENANCE",
								"value": "5000"
							},
							{
								"name": "SOAJS_DEPLOY_HA",
								"value": "kubernetes"
							},
							{
								"name": "SOAJS_EXTKEY",
								"value": "98"
							},
							{
								"name": "SOAJS_NX_CONTROLLER_IP",
								"value": "1.0.0.1"
							},
							{
								"name": "SOAJS_REGISTRY_API",
								"value": "1.0.0.1:5000"
							},
							{
								"name": "SOAJS_CONFIG_REPO_OWNER",
								"value": "ragheb"
							},
							{
								"name": "SOAJS_CONFIG_REPO_BRANCH",
								"value": "master"
							},
							{
								"name": "SOAJS_CONFIG_REPO_COMMIT",
								"value": "12345"
							},
							{
								"name": "SOAJS_CONFIG_REPO_NAME",
								"value": "deploy"
							},
							{
								"name": "SOAJS_CONFIG_REPO_PROVIDER",
								"value": "github"
							},
							{
								"name": "SOAJS_CONFIG_REPO_TOKEN",
								"value": "12345678"
							},
							{
								"name": "SOAJS_CONFIG_REPO_DOMAIN",
								"value": "github.com"
							},
							{
								"name": "SECRET_ENV",
								"valueFrom": {
									"secretKeyRef": {
										"name": "secret name",
										"key": "secret name"
									}
								}
							},
							{
								"name": "USER_ENV",
								"value": "test data"
							},
							{
								"name": "SOAJS_PROFILE",
								"value": "/opt/soajs/profile/soajsprofile"
							},
							{
								"name": "SOAJS_MONGO_CON_KEEPALIVE",
								"value": "true"
							}
						],
						"catalog": {
							"id": "123",
							"version": "1",
							"shell": "shell/bin/bash"
						},
						"item": {
							"env": "new",
							"name": "deploy",
							"type": "service",
							"version": "1",
							"group": "deployItemsExample"
						},
						"src": {
							"repo": "deploy",
							"owner": "ragheb",
							"from": {
								"branch": "master",
								"commit": "123"
							}
						},
						"mode": "Deployment",
						"labels": {
							"ragheb": "ragheb"
						},
						"image": {
							"name": "soajsorg/deploy:latest",
							"imagePullPolicy": "Always"
						},
						"readinessProbe": {},
						"volume": {
							"volumeMounts": [
								{
									"mountPath": "/opt/soajs/profile/",
									"name": "soajsprofile"
								}
							],
							"volumes": [
								{
									"name": "soajsprofile",
									"secret": {
										"secretName": "soajsprofile"
									}
								}
							]
						},
						"replicas": 1,
						"service": {
							"ports": [
								{
									"name": "service-port",
									"protocol": "TCP",
									"target": 6981,
									"port": 6981
								},
								{
									"protocol": "TCP",
									"name": "http",
									"port": 80,
									"targetPort": 80
								}
							]
						},
						"ports": [
							{
								"name": "service",
								"containerPort": 6981
							},
							{
								"name": "http",
								"containerPort": 80
							}
						]
					},
					"configuration": {
						"env": "new"
					}
				});
			return res.json(req.soajs.buildResponse(!check, {
				"data": true
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
