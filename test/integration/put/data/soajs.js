"use strict";

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

module.exports = {
	"soajs_1": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.test",
				"branch": "master"
			},
			"soa": {
				"name": "infra",
				"group": "soajs",
				"subType": 'soajs',
				"profile" : {
					"test": "1"
				},
				"port": 4008,
				"version": "1",
				"description": "description is description",
				"extKeyRequired": true,
				"oauth": false,
				"urac": true,
				"urac_Profile": false,
				"requestTimeout": 30,
				"requestTimeoutRenewal": 5,
				"urac_ACL": false,
				"provision_ACL": false,
				"type": "service",
				"interConnect": [{
					"name": "example2"
				}],
				"prerequisites": {
					"cpu": " ",
					"memory": " "
				},
				"documentation": {
					"readme": "README.md",
					"release": "RELEASE.md"
				},
				"swaggerFilename": "swagger.json",
				"maintenance": {
					"port": {
						"type": "inherit"
					},
					"readiness": "/heartbeat"
				}
			},
			"apiList": {
				"type": "schema",
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
						"/account/kubernetes": {
							"_apiInfo": {
								"l": "This API returns kubernetes account(s).",
								"group": "Account"
							},
							"id": {
								"source": ["query.id"],
								"validation": {
									"type": "string"
								}
							}
						},
						"/account/kubernetes/token": {
							"_apiInfo": {
								"l": "This API returns kubernetes account with token.",
								"group": "Internal"
							},
							"id": {
								"source": ["query.id"],
								"required": true,
								"validation": {
									"type": "string"
								}
							}
						},
						
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
						"/cd/tokens": {
							"_apiInfo": {
								"l": "This API returns all the available deployment cd tokens.",
								"group": "Token"
							}
						},
						
						"/kubernetes/plugin": {
							"_apiInfo": {
								"l": "This API fetches the information of a plugin along with all its resources.",
								"group": "Kubernetes plugin"
							},
							"commonFields": ["configuration"],
							"plugin": {
								"source": ["query.plugin"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["metric-server"]
								}
							}
						},
						"/kubernetes/bundle": {
							"_apiInfo": {
								"l": "This API fetches the information of a bundle deployment.",
								"group": "Kubernetes bundle"
							},
							"commonFields": ["configuration"],
							"bundle": {
								"source": ["query.bundle"],
								"required": true,
								"validation": {
									"type": "array",
									"minItems": 1,
									"items": {
										"type": "object",
										"properties": {
											"apiVersion": {
												"type": "string"
											},
											"kind": {
												"type": "string"
											},
											"metadata": {
												"type": "object",
												"properties": {
													"name": {
														"type": "string"
													}
												},
												"required": ["name"]
											}
										},
										"required": ["kind", "metadata"]
									}
								}
							}
						},
						
						"/kubernetes/cluster/:mode": {
							"_apiInfo": {
								"l": "This API returns the cluster information of a resource of mode (Node, Namespace).",
								"group": "Kubernetes cluster"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Node", "Namespace"]
								}
							}
						},
						"/kubernetes/workload/:mode": {
							"_apiInfo": {
								"l": "This API returns the workloads information of a resource of mode (Deployment, DaemonSet, CronJob, Pod, HPA).",
								"group": "Kubernetes workloads"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Deployment", "DaemonSet", "CronJob", "Pod", "HPA"]
								}
							}
						},
						"/kubernetes/service/:mode": {
							"_apiInfo": {
								"l": "This API returns the services information of a resource of mode (Service).",
								"group": "Kubernetes services"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Service"]
								}
							}
						},
						"/kubernetes/storage/:mode": {
							"_apiInfo": {
								"l": "This API returns the storage information of a resource of mode (PVC, PV, StorageClass).",
								"group": "Kubernetes storage"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["PVC", "PV", "StorageClass"]
								}
							}
						},
						"/kubernetes/configuration/:mode": {
							"_apiInfo": {
								"l": "This API returns the storage information of a resource of mode (Secret).",
								"group": "Kubernetes configuration"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Secret"]
								}
							}
						},
						"/kubernetes/rbac/:mode": {
							"_apiInfo": {
								"l": "This API returns the rbac information of a resource of mode (ClusterRole, ClusterRoleBinding, RoleBinding, APIService, ServiceAccount).",
								"group": "Kubernetes RBAC"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["ClusterRole", "ClusterRoleBinding", "RoleBinding", "APIService", "ServiceAccount"]
								}
							}
						},
						
						"/kubernetes/clusters/:mode": {
							"_apiInfo": {
								"l": "This API returns the cluster information of all resources of mode (Node, Namespace).",
								"group": "Kubernetes cluster"
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
							},
							"limit": {
								"source": ["query.limit"],
								"required": false,
								"validation": {
									"type": "integer",
									"minimum": 100,
									"maximum": 500
								}
							},
							"continue": {
								"source": ["query.continue"],
								"required": false,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Node", "Namespace"]
								}
							},
							"type": {
								"source": ["query.type"],
								"required": false,
								"validation": {
									"type": "string",
									"enum": ["Item", "Other", "All"]
								}
							}
						},
						"/kubernetes/workloads/:mode": {
							"_apiInfo": {
								"l": "This API returns the workloads information of all resources of mode (Deployment, DaemonSet, CronJob, Pod, HPA).",
								"group": "Kubernetes workloads"
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
							},
							"limit": {
								"source": ["query.limit"],
								"required": true,
								"validation": {
									"type": "integer",
									"minimum": 100,
									"maximum": 500
								}
							},
							"continue": {
								"source": ["query.continue"],
								"required": false,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Deployment", "DaemonSet", "CronJob", "Pod", "HPA"]
								}
							},
							"type": {
								"source": ["query.type"],
								"required": false,
								"validation": {
									"type": "string",
									"enum": ["Item", "Other", "All"]
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
							},
							"limit": {
								"source": ["query.limit"],
								"required": true,
								"validation": {
									"type": "integer",
									"minimum": 100,
									"maximum": 500
								}
							},
							"continue": {
								"source": ["query.continue"],
								"required": false,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Service"]
								}
							},
							"type": {
								"source": ["query.type"],
								"required": false,
								"validation": {
									"type": "string",
									"enum": ["Item", "Other", "All"]
								}
							}
						},
						"/kubernetes/storages/:mode": {
							"_apiInfo": {
								"l": "This API returns the storage information of all resources of mode (PVC, PV, StorageClass).",
								"group": "Kubernetes storage"
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
							},
							"limit": {
								"source": ["query.limit"],
								"required": true,
								"validation": {
									"type": "integer",
									"minimum": 100,
									"maximum": 500
								}
							},
							"continue": {
								"source": ["query.continue"],
								"required": false,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["PVC", "PV", "StorageClass"]
								}
							},
							"type": {
								"source": ["query.type"],
								"required": false,
								"validation": {
									"type": "string",
									"enum": ["Item", "Other", "All"]
								}
							}
						},
						"/kubernetes/configurations/:mode": {
							"_apiInfo": {
								"l": "This API returns the storage information of all resources of mode (Secret).",
								"group": "Kubernetes configuration"
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
							},
							"limit": {
								"source": ["query.limit"],
								"required": true,
								"validation": {
									"type": "integer",
									"minimum": 100,
									"maximum": 500
								}
							},
							"continue": {
								"source": ["query.continue"],
								"required": false,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Secret"]
								}
							},
							"type": {
								"source": ["query.type"],
								"required": false,
								"validation": {
									"type": "string",
									"enum": ["Item", "Other", "All"]
								}
							}
						},
						"/kubernetes/rbacs/:mode": {
							"_apiInfo": {
								"l": "This API returns the rbac information of all resources of mode (ClusterRole, ClusterRoleBinding, RoleBinding, APIService, ServiceAccount).",
								"group": "Kubernetes RBAC"
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
							},
							"limit": {
								"source": ["query.limit"],
								"required": true,
								"validation": {
									"type": "integer",
									"minimum": 100,
									"maximum": 500
								}
							},
							"continue": {
								"source": ["query.continue"],
								"required": false,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["ClusterRole", "ClusterRoleBinding", "RoleBinding", "APIService", "ServiceAccount"]
								}
							},
							"type": {
								"source": ["query.type"],
								"required": false,
								"validation": {
									"type": "string",
									"enum": ["Item", "Other", "All"]
								}
							}
						},
						
						"/kubernetes/item/latestVersion": {
							"_apiInfo": {
								"l": "This API fetches the latest version deployed of an item.",
								"group": "Kubernetes item"
							},
							"commonFields": ["configuration"],
							"itemName": {
								"source": ["query.itemName"],
								"required": true,
								"validation": {
									"type": "string"
								}
							}
						},
						"/kubernetes/pod/log": {
							"_apiInfo": {
								"l": "This API fetches the container Logs and capable to tail the log if follow is set to true.",
								"group": "Kubernetes workloads"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"follow": {
								"source": ["query.follow"],
								"required": false,
								"validation": {
									"type": "boolean",
									"default": false
								}
							},
							"lines": {
								"source": ["query.lines"],
								"required": false,
								"validation": {
									"type": "integer",
									"default": 400,
									"minimum": 400,
									"maximum": 2000
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
						
						"/kubernetes/item/metrics": {
							"_apiInfo": {
								"l": "This API fetches the item metrics.",
								"group": "Kubernetes item"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							}
						},
						"/kubernetes/pods/metrics": {
							"_apiInfo": {
								"l": "This API fetches the container metrics.",
								"group": "Kubernetes workloads"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": false,
								"validation": {
									"type": "string"
								}
							},
							"filter": {
								"source": ["query.filter"],
								"required": false,
								"validation": {
									"type": "object",
									"additionalProperties": true,
									"properties": {
										"labelSelector": {
											"type": "string"
										}
									}
								}
							}
						},
						"/kubernetes/nodes/metrics": {
							"_apiInfo": {
								"l": "This API fetches the node metrics.",
								"group": "Kubernetes cluster"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": false,
								"validation": {
									"type": "string"
								}
							},
							"filter": {
								"source": ["query.filter"],
								"required": false,
								"validation": {
									"type": "object",
									"additionalProperties": true,
									"properties": {
										"labelSelector": {
											"type": "string"
										}
									}
								}
							}
						},
						
						"/manual/awareness": {
							"_apiInfo": {
								"l": "This API gets the controller microservices awareness",
								"group": "Manual"
							},
							"env": {
								"source": ["query.env"],
								"required": true,
								"validation": {
									"type": "string",
									"pattern": /^(([a-z0-9][-a-z0-9_.]*)?[a-z0-9])?$/
								}
							}
						}
					},
					
					"put": {
						"/account/kubernetes/configuration": {
							"_apiInfo": {
								"l": "This API updates kubernetes account configuration",
								"group": "Account"
							},
							"id": {
								"source": ["body.id"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"configuration": {
								"source": ["body.configuration"],
								"required": true,
								"validation": {
									"type": "object",
									"properties": {
										"type": {
											"type": "string",
											"enum": ["secret"]
										},
										"token": {
											"type": "string"
										},
										"url": {
											"type": "string"
										},
										"protocol": {
											"type": "string",
											"enum": ["http", "https"]
										},
										"port": {
											"type": "integer"
										}
									},
									"required": ["type", "token", "url", "port"]
								}
							}
						},
						"/account/kubernetes/environment": {
							"_apiInfo": {
								"l": "This API updates kubernetes account environment usage.",
								"group": "Account"
							},
							"id": {
								"source": ["body.id"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"environment": {
								"source": ["body.environment"],
								"required": true,
								"validation": {
									"type": "object",
									"properties": {
										"env": {
											"type": "string",
											"pattern": /^(([a-z0-9][-a-z0-9_.]*)?[a-z0-9])?$/
										},
										"namespace": {
											"type": "string",
										}
									},
									"required": ["env"]
								}
							},
							"delete": {
								"source": ["body.delete"],
								"validation": {
									"type": "boolean"
								}
							}
						},
						"/account/kubernetes/acl": {
							"_apiInfo": {
								"l": "This API updates kubernetes account acl",
								"group": "Account"
							},
							"id": {
								"source": ["body.id"],
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
						"/cd/token/status": {
							"_apiInfo": {
								"l": "This API updates the status of a deployment cd token.",
								"group": "Token"
							},
							"token": {
								"source": ["body.token"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"status": {
								"source": ["body.status"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["active", "inactive"]
								}
							}
						},
						
						"/kubernetes/deployment/scale": {
							"_apiInfo": {
								"l": "This API scales a resource of type deployment only.",
								"group": "Kubernetes item"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["body.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"scale": {
								"source": ["body.scale"],
								"required": true,
								"validation": {
									"type": "integer",
									"minimum": 0
									
								}
							}
						},
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
						"/kubernetes/resource/restart": {
							"_apiInfo": {
								"l": "This API restarts a resource of type (Deployment, DaemonSet, or CronJob) and all its pod.",
								"group": "Kubernetes item"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["body.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["body.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Deployment", "DaemonSet", "CronJob"]
								}
							}
						},
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
						
						"/kubernetes/pods/exec": {
							"_apiInfo": {
								"l": "This API triggers maintenance operation in all the pods.",
								"group": "Kubernetes workloads"
							},
							"commonFields": ["configuration"],
							"filter": {
								"source": ["body.filter"],
								"required": true,
								"validation": {
									"type": "object"
								}
							},
							"commands": {
								"source": ["body.commands"],
								"required": true,
								"validation": {
									"type": "array",
									"minItems": 1,
									"items": {
										"type": "string"
									}
								}
							},
							"processResult": {
								"source": ["body.processResult"],
								"required": false,
								"validation": {
									"type": "boolean"
								}
							}
						},
						"/kubernetes/pod/exec": {
							"_apiInfo": {
								"l": "This API triggers maintenance operation in a pod.",
								"group": "Kubernetes workloads"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["body.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"commands": {
								"source": ["body.commands"],
								"required": true,
								"validation": {
									"type": "array",
									"minItems": 1,
									"items": {
										"type": "string"
									}
								}
							},
							"processResult": {
								"source": ["body.processResult"],
								"required": false,
								"validation": {
									"type": "boolean"
								}
							}
						},
						"/kubernetes/item/hpa": {
							"_apiInfo": {
								"l": "This API creates an HPA.",
								"group": "Kubernetes item"
							},
							"commonFields": ["configuration"],
							"item": {
								"source": ["body.item"],
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
							},
							"replica": {
								"source": ["body.replica"],
								"required": true,
								"validation": {
									"type": "object",
									"properties": {
										"min": {
											"type": "integer",
											"minimum": 1
											
										},
										"max": {
											"type": "integer",
											"minimum": 1
										}
									},
									"required": ["min", "max"]
								}
							},
							"metrics": {
								"source": ["body.metrics"],
								"required": true,
								"validation": {
									"type": "array",
									"minItems": 1,
									"items": {
										"anyOf": [{
											"type": "object",
											"additionalProperties": false,
											"properties": {
												"type": {
													"type": "string",
													"enum": ["Resource"]
												},
												"name": {
													"type": "string",
													"enum": ["cpu", "memory"]
												},
												"target": {
													"type": "string",
													"enum": ["AverageValue", "Utilization"]
												},
												"percentage": {
													"type": "integer",
													"minimum": 1,
													"maximum": 100
												}
											},
											"required": ["type", "name", "target", "percentage"]
										},
											{
												"type": "object",
												"additionalProperties": false,
												"properties": {
													"type": {
														"type": "string",
														"enum": ["Pods"]
													},
													"name": {
														"type": "string",
														"enum": ["packets-per-second"]
													},
													"target": {
														"type": "string",
														"enum": ["AverageValue"]
													},
													"value": {
														"type": "string"
													}
												},
												"required": ["type", "name", "target", "value"]
											},
											{
												"type": "object",
												"additionalProperties": false,
												"properties": {
													"type": {
														"type": "string",
														"enum": ["Object"]
													},
													"name": {
														"type": "string",
														"enum": ["requests-per-second"]
													},
													"target": {
														"type": "string",
														"enum": ["AverageValue", "Value"]
													},
													"value": {
														"type": "string"
													}
												},
												"required": ["type", "name", "target", "value"]
											}
										]
									}
								}
							}
						},
						
						"/kubernetes/workload/:mode": {
							"_apiInfo": {
								"l": "This API updates a resource of mode (Deployment, DaemonSet, CronJob, HPA).",
								"group": "Kubernetes workloads"
							},
							"commonFields": ["configuration"],
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Deployment", "DaemonSet", "CronJob", "HPA"]
								}
							},
							"name": {
								"source": ["body.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"body": {
								"source": ["body.body"],
								"required": true,
								"validation": {
									"type": "object",
									"properties": {
										"kind": {
											"type": "string",
											"enum": ["Deployment", "DaemonSet", "CronJob", "HorizontalPodAutoscaler"]
										},
										"metadata": {
											"type": "object",
											"properties": {
												"name": {
													"type": "string"
												}
											},
											"required": ["name"]
										}
									},
									"required": ["kind", "metadata"]
								}
							}
						},
						"/kubernetes/service/:mode": {
							"_apiInfo": {
								"l": "This API updates a resource of mode (Service).",
								"group": "Kubernetes services"
							},
							"commonFields": ["configuration"],
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Service"]
								}
							},
							"name": {
								"source": ["body.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"body": {
								"source": ["body.body"],
								"required": true,
								"validation": {
									"type": "object",
									"properties": {
										"kind": {
											"type": "string",
											"enum": ["Service"]
										},
										"metadata": {
											"type": "object",
											"properties": {
												"name": {
													"type": "string"
												}
											},
											"required": ["name"]
										}
									},
									"required": ["kind", "metadata"]
								}
							}
						},
						"/kubernetes/storage/:mode": {
							"_apiInfo": {
								"l": "This API updates a resource of mode (PV, StorageClass).",
								"group": "Kubernetes storage"
							},
							"commonFields": ["configuration"],
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["PV", "StorageClass"]
								}
							},
							"name": {
								"source": ["body.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"body": {
								"source": ["body.body"],
								"required": true,
								"validation": {
									"type": "object",
									"properties": {
										"kind": {
											"type": "string",
											"enum": ["PersistentVolume", "StorageClass"]
										},
										"metadata": {
											"type": "object",
											"properties": {
												"name": {
													"type": "string"
												}
											},
											"required": ["name"]
										}
									},
									"required": ["kind", "metadata"]
								}
							}
						}
					},
					
					"post": {
						"/account/kubernetes": {
							"_apiInfo": {
								"l": "This API adds a kubernetes account.",
								"group": "Account"
							},
							"label": {
								"source": ["body.label"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"description": {
								"source": ["body.description"],
								"validation": {
									"type": "string"
								}
							},
							"configuration": {
								"source": ["body.configuration"],
								"required": true,
								"validation": {
									"type": "object",
									"additionalProperties": false,
									"properties": {
										"type": {
											"type": "string",
											"enum": ["secret"]
										},
										"token": {
											"type": "string"
										},
										"url": {
											"type": "string"
										},
										"protocol": {
											"type": "string",
											"enum": ["http", "https"]
										},
										"port": {
											"type": "integer"
										}
									},
									"required": ["type", "token", "url", "port"]
								}
							}
						},
						"/cd/token": {
							"_apiInfo": {
								"l": "This API adds a deployment cd token.",
								"group": "Token"
							},
							"label": {
								"source": ["body.label"],
								"required": true,
								"validation": {
									"type": "string"
								}
							}
						},
						
						"/kubernetes/plugin": {
							"_apiInfo": {
								"l": "This API deploys a plugin along with all its resources.",
								"group": "Kubernetes plugin"
							},
							"commonFields": ["configuration"],
							"plugin": {
								"source": ["body.plugin"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["metric-server"]
								}
							}
						},
						"/kubernetes/bundle": {
							"_apiInfo": {
								"l": "This API deploys a bundle deployment of resources.",
								"group": "Kubernetes bundle"
							},
							"commonFields": ["configuration"],
							"bundle": {
								"source": ["body.bundle"],
								"required": true,
								"validation": {
									"type": "array",
									"minItems": 1,
									"items": {
										"type": "object",
										"properties": {
											"type": {
												"type": "string",
												"enum": ["native"]
											},
											"recipe": {
												"type": "object",
												"properties": {
													"apiVersion": {
														"type": "string"
													},
													"kind": {
														"type": "string"
													},
													"metadata": {
														"type": "object",
														"properties": {
															"name": {
																"type": "string"
															}
														},
														"required": ["name"]
													}
												},
												"required": ["apiVersion", "kind", "metadata"]
											}
										},
										"required": ["type", "recipe"]
									}
								}
							}
						},
						
						"/kubernetes/workload/:mode": {
							"_apiInfo": {
								"l": "This API creates a resource of mode (Deployment, DaemonSet, CronJob, HPA. Pod).",
								"group": "Kubernetes workloads"
							},
							"commonFields": ["configuration"],
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Deployment", "DaemonSet", "CronJob", "HPA", "Pod"]
								}
							},
							"body": {
								"source": ["body.body"],
								"required": true,
								"validation": {
									"type": "object",
									"properties": {
										"kind": {
											"type": "string",
											"enum": ["Deployment", "DaemonSet", "CronJob", "HorizontalPodAutoscaler", "Pod"]
										}
									},
									"required": ["kind"]
								}
							}
						},
						"/kubernetes/service/:mode": {
							"_apiInfo": {
								"l": "This API creates a resource of mode (Service).",
								"group": "Kubernetes services"
							},
							"commonFields": ["configuration"],
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Service"]
								}
							},
							"body": {
								"source": ["body.body"],
								"required": true,
								"validation": {
									"type": "object",
									"properties": {
										"kind": {
											"type": "string",
											"enum": ["Service"]
										}
									},
									"required": ["kind"]
								}
							}
						},
						"/kubernetes/storage/:mode": {
							"_apiInfo": {
								"l": "This API creates a resource of mode (PVC, PV, StorageClass).",
								"group": "Kubernetes storage"
							},
							"commonFields": ["configuration"],
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["PVC", "PV", "StorageClass"]
								}
							},
							"body": {
								"source": ["body.body"],
								"required": true,
								"validation": {
									"type": "object",
									"properties": {
										"kind": {
											"type": "string",
											"enum": ["PersistentVolumeClaim", "PersistentVolume", "StorageClass"]
										}
									},
									"required": ["kind"]
								}
							}
						},
						"/kubernetes/configuration/:mode": {
							"_apiInfo": {
								"l": "This API creates a resource of mode (Secret).",
								"group": "Kubernetes configuration"
							},
							"commonFields": ["configuration"],
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Secret"]
								}
							},
							"body": {
								"source": ["body.body"],
								"required": true,
								"validation": {
									"type": "object",
									"properties": {
										"kind": {
											"type": "string",
											"enum": ["Secret"]
										}
									},
									"required": ["kind"]
								}
							}
						},
						"/kubernetes/rbac/:mode": {
							"_apiInfo": {
								"l": "This API creates a resource of mode (ClusterRole, ClusterRoleBinding, RoleBinding, APIService, ServiceAccount).",
								"group": "Kubernetes RBAC"
							},
							"commonFields": ["configuration"],
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["ClusterRole", "ClusterRoleBinding", "RoleBinding", "APIService", "ServiceAccount"]
								}
							},
							"body": {
								"source": ["body.body"],
								"required": true,
								"validation": {
									"type": "object",
									"properties": {
										"kind": {
											"type": "string",
											"enum": ["ClusterRole", "ClusterRoleBinding", "RoleBinding", "APIService", "ServiceAccount"]
										}
									},
									"required": ["kind"]
								}
							}
						},
						
						"/kubernetes/namespace": {
							"_apiInfo": {
								"l": "This API creates a namespace.",
								"group": "Kubernetes environment"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["body.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							}
						},
						
						"/kubernetes/item/hpa": {
							"_apiInfo": {
								"l": "This API creates an HPA.",
								"group": "Kubernetes item"
							},
							"commonFields": ["configuration"],
							"item": {
								"source": ["body.item"],
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
							},
							"replica": {
								"source": ["body.replica"],
								"required": true,
								"validation": {
									"type": "object",
									"properties": {
										"min": {
											"type": "integer",
											"minimum": 1
											
										},
										"max": {
											"type": "integer",
											"minimum": 1
										}
									},
									"required": ["min", "max"]
								}
							},
							"metrics": {
								"source": ["body.metrics"],
								"required": true,
								"validation": {
									"type": "array",
									"minItems": 1,
									"items": {
										"anyOf": [{
											"type": "object",
											"additionalProperties": false,
											"properties": {
												"type": {
													"type": "string",
													"enum": ["Resource"]
												},
												"name": {
													"type": "string",
													"enum": ["cpu", "memory"]
												},
												"target": {
													"type": "string",
													"enum": ["AverageValue", "Utilization"]
												},
												"percentage": {
													"type": "integer",
													"minimum": 1,
													"maximum": 100
												}
											},
											"required": ["type", "name", "target", "percentage"]
										},
											{
												"type": "object",
												"additionalProperties": false,
												"properties": {
													"type": {
														"type": "string",
														"enum": ["Pods"]
													},
													"name": {
														"type": "string",
														"enum": ["packets-per-second"]
													},
													"target": {
														"type": "string",
														"enum": ["AverageValue"]
													},
													"value": {
														"type": "string"
													}
												},
												"required": ["type", "name", "target", "value"]
											},
											{
												"type": "object",
												"additionalProperties": false,
												"properties": {
													"type": {
														"type": "string",
														"enum": ["Object"]
													},
													"name": {
														"type": "string",
														"enum": ["requests-per-second"]
													},
													"target": {
														"type": "string",
														"enum": ["AverageValue", "Value"]
													},
													"value": {
														"type": "string"
													}
												},
												"required": ["type", "name", "target", "value"]
											}
										]
									}
								}
							}
						},
						"/kubernetes/secret": {
							"_apiInfo": {
								"l": "This API creates a secret.",
								"group": "Kubernetes configuration wizard"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["body.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"content": {
								"source": ["body.content"],
								"required": true,
								"validation": {
									"type": "array",
									"minItems": 1,
									"items": {
										"type": "object",
										"properties": {
											"name": {
												"type": "string"
											},
											"content": {
												"type": "string"
											}
										},
										"required": ["name", "content"]
									}
								}
							}
						},
						"/kubernetes/secret/registry": {
							"_apiInfo": {
								"l": "This API creates a secret for private image registry.",
								"group": "Kubernetes configuration wizard"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["body.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"content": {
								"source": ["body.content"],
								"required": true,
								"validation": {
									"type": "object",
									"properties": {
										"username": {
											"type": "string"
										},
										"password": {
											"type": "string"
										},
										"email": {
											"type": "string"
										},
										"server": {
											"type": "string"
										}
									},
									"required": ["username", "password", "email", "server"]
								}
							}
						},
						"/kubernetes/pvc": {
							"_apiInfo": {
								"l": "This API creates a PVC.",
								"group": "Kubernetes storage wizard"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["body.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"accessModes": {
								"source": ["body.accessModes"],
								"required": true,
								"validation": {
									"type": "array",
									"minItems": 1,
									"uniqueItems": true,
									'items': {
										'type': "string",
										'enum': ["ReadWriteOnce", "ReadOnlyMany", "ReadWriteMany"]
									}
								}
							},
							"storage": {
								"source": ["body.storage"],
								"required": false,
								"validation": {
									"type": "string"
								}
							},
							"storageClassName": {
								"source": ["body.storageClassName"],
								"required": false,
								"validation": {
									"type": "string"
								}
							},
							"volumeMode": {
								"source": ["body.volumeMode"],
								"required": false,
								"validation": {
									"type": "string",
									"enum": ["Filesystem", "Block"]
								}
							}
						},
						
						"/kubernetes/item/deploy/soajs": {
							"_apiInfo": {
								"l": "This API deploys an item from the catalog using soajs recipe of type Deployment or DaemonSet.",
								"group": "Kubernetes item"
							},
							"commonFields": ["configuration"],
							"recipe": {
								"source": ["body.recipe"],
								"required": true,
								"validation": {}
							}
						},
						"/kubernetes/item/deploy/soajs/cronjob": {
							"_apiInfo": {
								"l": "This API deploys an item from the catalog using soajs recipe of type CronJob.",
								"group": "Kubernetes item"
							},
							"commonFields": ["configuration"],
							"recipe": {
								"source": ["body.recipe"],
								"required": true,
								"validation": {}
							}
						},
						"/kubernetes/item/deploy/native": {
							"_apiInfo": {
								"l": "This API deploys an item from the catalog using kubernetes native recipe of type Deployment or DaemonSet.",
								"group": "Kubernetes item"
							},
							"commonFields": ["configuration"],
							"recipe": {
								"source": ["body.recipe"],
								"required": true,
								"validation": {}
							}
						},
						"/kubernetes/item/deploy/native/cronjob": {
							"_apiInfo": {
								"l": "This API deploys an item from the catalog using kubernetes native recipe of type CronJob.",
								"group": "Kubernetes item"
							},
							"commonFields": ["configuration"],
							"recipe": {
								"source": ["body.recipe"],
								"required": true,
								"validation": {}
							}
						},
						"/kubernetes/deploy/native": {
							"_apiInfo": {
								"l": "This API creates the service and the related Deployment, DaemonSet or CronJob.",
								"group": "Kubernetes item"
							},
							"commonFields": ["configuration"],
							"service": {
								"source": ["body.service"],
								"required": false,
								"validation": {
									"type": "object"
								}
							},
							"deployment": {
								"source": ["body.deployment"],
								"required": true,
								"validation": {
									"type": "object",
									"properties": {
										"kind": {
											"type": "string",
											"enum": ["Deployment", "DaemonSet", "CronJob"]
										}
									},
									"required": ["kind"]
								}
							}
						}
					},
					
					"delete": {
						"/account/kubernetes": {
							"_apiInfo": {
								"l": "This API deletes a kubernetes account.",
								"group": "Account"
							},
							"id": {
								"source": ["body.id"],
								"required": true,
								"validation": {
									"type": "string"
								}
							}
						},
						"/account/kubernetes/acl": {
							"_apiInfo": {
								"l": "This API deletes kubernetes account acl",
								"group": "Account"
							},
							"id": {
								"source": ["query.id"],
								"required": true,
								"validation": {
									"type": "string"
								}
							}
						},
						"/cd/token": {
							"_apiInfo": {
								"l": "This API deletes a deployment cd token.",
								"group": "Token"
							},
							"token": {
								"source": ["body.token"],
								"required": true,
								"validation": {
									"type": "string"
								}
							}
						},
						"/kubernetes/plugin": {
							"_apiInfo": {
								"l": "This API deletes a plugin along with all its resources.",
								"group": "Kubernetes plugin"
							},
							"commonFields": ["configuration"],
							"plugin": {
								"source": ["query.plugin"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["metric-server"]
								}
							}
						},
						"/kubernetes/bundle": {
							"_apiInfo": {
								"l": "This API removes all the resources of a deployed bundle.",
								"group": "Kubernetes bundle"
							},
							"commonFields": ["configuration"],
							"bundle": {
								"source": ["body.bundle"],
								"required": true,
								"validation": {
									"type": "array",
									"minItems": 1,
									"items": {
										"type": "object",
										"properties": {
											"apiVersion": {
												"type": "string"
											},
											"kind": {
												"type": "string"
											},
											"metadata": {
												"type": "object",
												"properties": {
													"name": {
														"type": "string"
													}
												},
												"required": ["name"]
											}
										},
										"required": ["kind", "metadata"]
									}
								}
							}
						},
						
						"/kubernetes/workload/:mode": {
							"_apiInfo": {
								"l": "This API deletes a resource of mode (Deployment, DaemonSet, CronJob, HPA).",
								"group": "Kubernetes workloads"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Deployment", "DaemonSet", "CronJob", "HPA"]
								}
							}
						},
						"/kubernetes/service/:mode": {
							"_apiInfo": {
								"l": "This API deletes a resource of mode (Service).",
								"group": "Kubernetes services"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Service"]
								}
							}
						},
						"/kubernetes/storage/:mode": {
							"_apiInfo": {
								"l": "This API deletes a resource of mode (PVC, PV, StorageClass).",
								"group": "Kubernetes storage"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["PVC", "PV", "StorageClass"]
								}
							}
						},
						"/kubernetes/configuration/:mode": {
							"_apiInfo": {
								"l": "This API deletes a resource of mode (Secret).",
								"group": "Kubernetes configuration"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Secret"]
								}
							}
						},
						"/kubernetes/rbac/:mode": {
							"_apiInfo": {
								"l": "This API deletes a resource of mode (ClusterRole, ClusterRoleBinding, RoleBinding, APIService, ServiceAccount).",
								"group": "Kubernetes RBAC"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["ClusterRole", "ClusterRoleBinding", "RoleBinding", "APIService", "ServiceAccount"]
								}
							}
						},
						
						"/kubernetes/pods": {
							"_apiInfo": {
								"l": "This API deletes pods.",
								"group": "Kubernetes workloads"
							},
							"commonFields": ["configuration"],
							"filter": {
								"source": ["body.filter"],
								"required": true,
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
						"/kubernetes/namespace": {
							"_apiInfo": {
								"l": "This API deletes a namespace.",
								"group": "Kubernetes environment"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["body.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							}
						},
						"/kubernetes/item": {
							"_apiInfo": {
								"l": "This API deletes an item of type (Deployment, DaemonSet  or CronJob) as well as the related HPA with the related service.",
								"group": "Kubernetes item"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["body.name"],
								"required": true,
								"validation": {
									"type": "string"
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
							"cleanup": {
								"source": ["body.cleanup"],
								"required": false,
								"validation": {
									"type": "boolean",
									"default": false
								}
							}
						}
					}
				},
			},
			"documentation": {
				"release": "Release: V1",
				"readme": "# soajs.test Test Express Service for Patch, Head, and others"
			}
		}
	},
	"soajs_1_2": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.test",
				"branch": "master"
			},
			"soa": {
				"name": "infra",
				"group": "soajs",
				"subType": 'soajs',
				"port": 4008,
				"version": "2",
				"description": "description is description",
				"extKeyRequired": true,
				"oauth": false,
				"urac": true,
				"urac_Profile": false,
				"requestTimeout": 30,
				"requestTimeoutRenewal": 5,
				"urac_ACL": false,
				"provision_ACL": false,
				"type": "service",
				"interConnect": [{
					"name": "example2"
				}],
				"prerequisites": {
					"cpu": " ",
					"memory": " "
				},
				"documentation": {
					"readme": "README.md",
					"release": "RELEASE.md"
				},
				"swaggerFilename": "swagger.json",
				"maintenance": {
					"port": {
						"type": "inherit"
					},
					"readiness": "/heartbeat"
				}
			},
			"apiList": {
				"type": "schema",
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
						"/account/kubernetes": {
							"_apiInfo": {
								"l": "This API returns kubernetes account(s).",
								"group": "Account"
							},
							"id": {
								"source": ["query.id"],
								"validation": {
									"type": "string"
								}
							}
						},
						"/account/kubernetes/token": {
							"_apiInfo": {
								"l": "This API returns kubernetes account with token.",
								"group": "Internal"
							},
							"id": {
								"source": ["query.id"],
								"required": true,
								"validation": {
									"type": "string"
								}
							}
						},
						
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
						"/cd/tokens": {
							"_apiInfo": {
								"l": "This API returns all the available deployment cd tokens.",
								"group": "Token"
							}
						},
						
						"/kubernetes/plugin": {
							"_apiInfo": {
								"l": "This API fetches the information of a plugin along with all its resources.",
								"group": "Kubernetes plugin"
							},
							"commonFields": ["configuration"],
							"plugin": {
								"source": ["query.plugin"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["metric-server"]
								}
							}
						},
						"/kubernetes/bundle": {
							"_apiInfo": {
								"l": "This API fetches the information of a bundle deployment.",
								"group": "Kubernetes bundle"
							},
							"commonFields": ["configuration"],
							"bundle": {
								"source": ["query.bundle"],
								"required": true,
								"validation": {
									"type": "array",
									"minItems": 1,
									"items": {
										"type": "object",
										"properties": {
											"apiVersion": {
												"type": "string"
											},
											"kind": {
												"type": "string"
											},
											"metadata": {
												"type": "object",
												"properties": {
													"name": {
														"type": "string"
													}
												},
												"required": ["name"]
											}
										},
										"required": ["kind", "metadata"]
									}
								}
							}
						},
						
						"/kubernetes/cluster/:mode": {
							"_apiInfo": {
								"l": "This API returns the cluster information of a resource of mode (Node, Namespace).",
								"group": "Kubernetes cluster"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Node", "Namespace"]
								}
							}
						},
						"/kubernetes/workload/:mode": {
							"_apiInfo": {
								"l": "This API returns the workloads information of a resource of mode (Deployment, DaemonSet, CronJob, Pod, HPA).",
								"group": "Kubernetes workloads"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Deployment", "DaemonSet", "CronJob", "Pod", "HPA"]
								}
							}
						},
						"/kubernetes/service/:mode": {
							"_apiInfo": {
								"l": "This API returns the services information of a resource of mode (Service).",
								"group": "Kubernetes services"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Service"]
								}
							}
						},
						"/kubernetes/storage/:mode": {
							"_apiInfo": {
								"l": "This API returns the storage information of a resource of mode (PVC, PV, StorageClass).",
								"group": "Kubernetes storage"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["PVC", "PV", "StorageClass"]
								}
							}
						},
						"/kubernetes/configuration/:mode": {
							"_apiInfo": {
								"l": "This API returns the storage information of a resource of mode (Secret).",
								"group": "Kubernetes configuration"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Secret"]
								}
							}
						},
						"/kubernetes/rbac/:mode": {
							"_apiInfo": {
								"l": "This API returns the rbac information of a resource of mode (ClusterRole, ClusterRoleBinding, RoleBinding, APIService, ServiceAccount).",
								"group": "Kubernetes RBAC"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["ClusterRole", "ClusterRoleBinding", "RoleBinding", "APIService", "ServiceAccount"]
								}
							}
						},
						
						"/kubernetes/clusters/:mode": {
							"_apiInfo": {
								"l": "This API returns the cluster information of all resources of mode (Node, Namespace).",
								"group": "Kubernetes cluster"
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
							},
							"limit": {
								"source": ["query.limit"],
								"required": false,
								"validation": {
									"type": "integer",
									"minimum": 100,
									"maximum": 500
								}
							},
							"continue": {
								"source": ["query.continue"],
								"required": false,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Node", "Namespace"]
								}
							},
							"type": {
								"source": ["query.type"],
								"required": false,
								"validation": {
									"type": "string",
									"enum": ["Item", "Other", "All"]
								}
							}
						},
						"/kubernetes/workloads/:mode": {
							"_apiInfo": {
								"l": "This API returns the workloads information of all resources of mode (Deployment, DaemonSet, CronJob, Pod, HPA).",
								"group": "Kubernetes workloads"
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
							},
							"limit": {
								"source": ["query.limit"],
								"required": true,
								"validation": {
									"type": "integer",
									"minimum": 100,
									"maximum": 500
								}
							},
							"continue": {
								"source": ["query.continue"],
								"required": false,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Deployment", "DaemonSet", "CronJob", "Pod", "HPA"]
								}
							},
							"type": {
								"source": ["query.type"],
								"required": false,
								"validation": {
									"type": "string",
									"enum": ["Item", "Other", "All"]
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
							},
							"limit": {
								"source": ["query.limit"],
								"required": true,
								"validation": {
									"type": "integer",
									"minimum": 100,
									"maximum": 500
								}
							},
							"continue": {
								"source": ["query.continue"],
								"required": false,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Service"]
								}
							},
							"type": {
								"source": ["query.type"],
								"required": false,
								"validation": {
									"type": "string",
									"enum": ["Item", "Other", "All"]
								}
							}
						},
						"/kubernetes/storages/:mode": {
							"_apiInfo": {
								"l": "This API returns the storage information of all resources of mode (PVC, PV, StorageClass).",
								"group": "Kubernetes storage"
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
							},
							"limit": {
								"source": ["query.limit"],
								"required": true,
								"validation": {
									"type": "integer",
									"minimum": 100,
									"maximum": 500
								}
							},
							"continue": {
								"source": ["query.continue"],
								"required": false,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["PVC", "PV", "StorageClass"]
								}
							},
							"type": {
								"source": ["query.type"],
								"required": false,
								"validation": {
									"type": "string",
									"enum": ["Item", "Other", "All"]
								}
							}
						},
						"/kubernetes/configurations/:mode": {
							"_apiInfo": {
								"l": "This API returns the storage information of all resources of mode (Secret).",
								"group": "Kubernetes configuration"
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
							},
							"limit": {
								"source": ["query.limit"],
								"required": true,
								"validation": {
									"type": "integer",
									"minimum": 100,
									"maximum": 500
								}
							},
							"continue": {
								"source": ["query.continue"],
								"required": false,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Secret"]
								}
							},
							"type": {
								"source": ["query.type"],
								"required": false,
								"validation": {
									"type": "string",
									"enum": ["Item", "Other", "All"]
								}
							}
						},
						"/kubernetes/rbacs/:mode": {
							"_apiInfo": {
								"l": "This API returns the rbac information of all resources of mode (ClusterRole, ClusterRoleBinding, RoleBinding, APIService, ServiceAccount).",
								"group": "Kubernetes RBAC"
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
							},
							"limit": {
								"source": ["query.limit"],
								"required": true,
								"validation": {
									"type": "integer",
									"minimum": 100,
									"maximum": 500
								}
							},
							"continue": {
								"source": ["query.continue"],
								"required": false,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["ClusterRole", "ClusterRoleBinding", "RoleBinding", "APIService", "ServiceAccount"]
								}
							},
							"type": {
								"source": ["query.type"],
								"required": false,
								"validation": {
									"type": "string",
									"enum": ["Item", "Other", "All"]
								}
							}
						},
						
						"/kubernetes/item/latestVersion": {
							"_apiInfo": {
								"l": "This API fetches the latest version deployed of an item.",
								"group": "Kubernetes item"
							},
							"commonFields": ["configuration"],
							"itemName": {
								"source": ["query.itemName"],
								"required": true,
								"validation": {
									"type": "string"
								}
							}
						},
						"/kubernetes/pod/log": {
							"_apiInfo": {
								"l": "This API fetches the container Logs and capable to tail the log if follow is set to true.",
								"group": "Kubernetes workloads"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"follow": {
								"source": ["query.follow"],
								"required": false,
								"validation": {
									"type": "boolean",
									"default": false
								}
							},
							"lines": {
								"source": ["query.lines"],
								"required": false,
								"validation": {
									"type": "integer",
									"default": 400,
									"minimum": 400,
									"maximum": 2000
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
						
						"/kubernetes/item/metrics": {
							"_apiInfo": {
								"l": "This API fetches the item metrics.",
								"group": "Kubernetes item"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							}
						},
						"/kubernetes/pods/metrics": {
							"_apiInfo": {
								"l": "This API fetches the container metrics.",
								"group": "Kubernetes workloads"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": false,
								"validation": {
									"type": "string"
								}
							},
							"filter": {
								"source": ["query.filter"],
								"required": false,
								"validation": {
									"type": "object",
									"additionalProperties": true,
									"properties": {
										"labelSelector": {
											"type": "string"
										}
									}
								}
							}
						},
						"/kubernetes/nodes/metrics": {
							"_apiInfo": {
								"l": "This API fetches the node metrics.",
								"group": "Kubernetes cluster"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": false,
								"validation": {
									"type": "string"
								}
							},
							"filter": {
								"source": ["query.filter"],
								"required": false,
								"validation": {
									"type": "object",
									"additionalProperties": true,
									"properties": {
										"labelSelector": {
											"type": "string"
										}
									}
								}
							}
						},
						
						"/manual/awareness": {
							"_apiInfo": {
								"l": "This API gets the controller microservices awareness",
								"group": "Manual"
							},
							"env": {
								"source": ["query.env"],
								"required": true,
								"validation": {
									"type": "string",
									"pattern": /^(([a-z0-9][-a-z0-9_.]*)?[a-z0-9])?$/
								}
							}
						}
					},
					
					"put": {
						"/account/kubernetes/configuration": {
							"_apiInfo": {
								"l": "This API updates kubernetes account configuration",
								"group": "Account"
							},
							"id": {
								"source": ["body.id"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"configuration": {
								"source": ["body.configuration"],
								"required": true,
								"validation": {
									"type": "object",
									"properties": {
										"type": {
											"type": "string",
											"enum": ["secret"]
										},
										"token": {
											"type": "string"
										},
										"url": {
											"type": "string"
										},
										"protocol": {
											"type": "string",
											"enum": ["http", "https"]
										},
										"port": {
											"type": "integer"
										}
									},
									"required": ["type", "token", "url", "port"]
								}
							}
						},
						"/account/kubernetes/environment": {
							"_apiInfo": {
								"l": "This API updates kubernetes account environment usage.",
								"group": "Account"
							},
							"id": {
								"source": ["body.id"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"environment": {
								"source": ["body.environment"],
								"required": true,
								"validation": {
									"type": "object",
									"properties": {
										"env": {
											"type": "string",
											"pattern": /^(([a-z0-9][-a-z0-9_.]*)?[a-z0-9])?$/
										},
										"namespace": {
											"type": "string",
										}
									},
									"required": ["env"]
								}
							},
							"delete": {
								"source": ["body.delete"],
								"validation": {
									"type": "boolean"
								}
							}
						},
						"/account/kubernetes/acl": {
							"_apiInfo": {
								"l": "This API updates kubernetes account acl",
								"group": "Account"
							},
							"id": {
								"source": ["body.id"],
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
						"/cd/token/status": {
							"_apiInfo": {
								"l": "This API updates the status of a deployment cd token.",
								"group": "Token"
							},
							"token": {
								"source": ["body.token"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"status": {
								"source": ["body.status"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["active", "inactive"]
								}
							}
						},
						
						"/kubernetes/deployment/scale": {
							"_apiInfo": {
								"l": "This API scales a resource of type deployment only.",
								"group": "Kubernetes item"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["body.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"scale": {
								"source": ["body.scale"],
								"required": true,
								"validation": {
									"type": "integer",
									"minimum": 0
									
								}
							}
						},
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
						"/kubernetes/resource/restart": {
							"_apiInfo": {
								"l": "This API restarts a resource of type (Deployment, DaemonSet, or CronJob) and all its pod.",
								"group": "Kubernetes item"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["body.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["body.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Deployment", "DaemonSet", "CronJob"]
								}
							}
						},
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
						
						"/kubernetes/pods/exec": {
							"_apiInfo": {
								"l": "This API triggers maintenance operation in all the pods.",
								"group": "Kubernetes workloads"
							},
							"commonFields": ["configuration"],
							"filter": {
								"source": ["body.filter"],
								"required": true,
								"validation": {
									"type": "object"
								}
							},
							"commands": {
								"source": ["body.commands"],
								"required": true,
								"validation": {
									"type": "array",
									"minItems": 1,
									"items": {
										"type": "string"
									}
								}
							},
							"processResult": {
								"source": ["body.processResult"],
								"required": false,
								"validation": {
									"type": "boolean"
								}
							}
						},
						"/kubernetes/pod/exec": {
							"_apiInfo": {
								"l": "This API triggers maintenance operation in a pod.",
								"group": "Kubernetes workloads"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["body.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"commands": {
								"source": ["body.commands"],
								"required": true,
								"validation": {
									"type": "array",
									"minItems": 1,
									"items": {
										"type": "string"
									}
								}
							},
							"processResult": {
								"source": ["body.processResult"],
								"required": false,
								"validation": {
									"type": "boolean"
								}
							}
						},
						"/kubernetes/item/hpa": {
							"_apiInfo": {
								"l": "This API creates an HPA.",
								"group": "Kubernetes item"
							},
							"commonFields": ["configuration"],
							"item": {
								"source": ["body.item"],
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
							},
							"replica": {
								"source": ["body.replica"],
								"required": true,
								"validation": {
									"type": "object",
									"properties": {
										"min": {
											"type": "integer",
											"minimum": 1
											
										},
										"max": {
											"type": "integer",
											"minimum": 1
										}
									},
									"required": ["min", "max"]
								}
							},
							"metrics": {
								"source": ["body.metrics"],
								"required": true,
								"validation": {
									"type": "array",
									"minItems": 1,
									"items": {
										"anyOf": [{
											"type": "object",
											"additionalProperties": false,
											"properties": {
												"type": {
													"type": "string",
													"enum": ["Resource"]
												},
												"name": {
													"type": "string",
													"enum": ["cpu", "memory"]
												},
												"target": {
													"type": "string",
													"enum": ["AverageValue", "Utilization"]
												},
												"percentage": {
													"type": "integer",
													"minimum": 1,
													"maximum": 100
												}
											},
											"required": ["type", "name", "target", "percentage"]
										},
											{
												"type": "object",
												"additionalProperties": false,
												"properties": {
													"type": {
														"type": "string",
														"enum": ["Pods"]
													},
													"name": {
														"type": "string",
														"enum": ["packets-per-second"]
													},
													"target": {
														"type": "string",
														"enum": ["AverageValue"]
													},
													"value": {
														"type": "string"
													}
												},
												"required": ["type", "name", "target", "value"]
											},
											{
												"type": "object",
												"additionalProperties": false,
												"properties": {
													"type": {
														"type": "string",
														"enum": ["Object"]
													},
													"name": {
														"type": "string",
														"enum": ["requests-per-second"]
													},
													"target": {
														"type": "string",
														"enum": ["AverageValue", "Value"]
													},
													"value": {
														"type": "string"
													}
												},
												"required": ["type", "name", "target", "value"]
											}
										]
									}
								}
							}
						},
						
						"/kubernetes/workload/:mode": {
							"_apiInfo": {
								"l": "This API updates a resource of mode (Deployment, DaemonSet, CronJob, HPA).",
								"group": "Kubernetes workloads"
							},
							"commonFields": ["configuration"],
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Deployment", "DaemonSet", "CronJob", "HPA"]
								}
							},
							"name": {
								"source": ["body.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"body": {
								"source": ["body.body"],
								"required": true,
								"validation": {
									"type": "object",
									"properties": {
										"kind": {
											"type": "string",
											"enum": ["Deployment", "DaemonSet", "CronJob", "HorizontalPodAutoscaler"]
										},
										"metadata": {
											"type": "object",
											"properties": {
												"name": {
													"type": "string"
												}
											},
											"required": ["name"]
										}
									},
									"required": ["kind", "metadata"]
								}
							}
						},
						"/kubernetes/service/:mode": {
							"_apiInfo": {
								"l": "This API updates a resource of mode (Service).",
								"group": "Kubernetes services"
							},
							"commonFields": ["configuration"],
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Service"]
								}
							},
							"name": {
								"source": ["body.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"body": {
								"source": ["body.body"],
								"required": true,
								"validation": {
									"type": "object",
									"properties": {
										"kind": {
											"type": "string",
											"enum": ["Service"]
										},
										"metadata": {
											"type": "object",
											"properties": {
												"name": {
													"type": "string"
												}
											},
											"required": ["name"]
										}
									},
									"required": ["kind", "metadata"]
								}
							}
						},
						"/kubernetes/storage/:mode": {
							"_apiInfo": {
								"l": "This API updates a resource of mode (PV, StorageClass).",
								"group": "Kubernetes storage"
							},
							"commonFields": ["configuration"],
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["PV", "StorageClass"]
								}
							},
							"name": {
								"source": ["body.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"body": {
								"source": ["body.body"],
								"required": true,
								"validation": {
									"type": "object",
									"properties": {
										"kind": {
											"type": "string",
											"enum": ["PersistentVolume", "StorageClass"]
										},
										"metadata": {
											"type": "object",
											"properties": {
												"name": {
													"type": "string"
												}
											},
											"required": ["name"]
										}
									},
									"required": ["kind", "metadata"]
								}
							}
						}
					},
					
					"post": {
						"/account/kubernetes": {
							"_apiInfo": {
								"l": "This API adds a kubernetes account.",
								"group": "Account"
							},
							"label": {
								"source": ["body.label"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"description": {
								"source": ["body.description"],
								"validation": {
									"type": "string"
								}
							},
							"configuration": {
								"source": ["body.configuration"],
								"required": true,
								"validation": {
									"type": "object",
									"additionalProperties": false,
									"properties": {
										"type": {
											"type": "string",
											"enum": ["secret"]
										},
										"token": {
											"type": "string"
										},
										"url": {
											"type": "string"
										},
										"protocol": {
											"type": "string",
											"enum": ["http", "https"]
										},
										"port": {
											"type": "integer"
										}
									},
									"required": ["type", "token", "url", "port"]
								}
							}
						},
						"/cd/token": {
							"_apiInfo": {
								"l": "This API adds a deployment cd token.",
								"group": "Token"
							},
							"label": {
								"source": ["body.label"],
								"required": true,
								"validation": {
									"type": "string"
								}
							}
						},
						
						"/kubernetes/plugin": {
							"_apiInfo": {
								"l": "This API deploys a plugin along with all its resources.",
								"group": "Kubernetes plugin"
							},
							"commonFields": ["configuration"],
							"plugin": {
								"source": ["body.plugin"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["metric-server"]
								}
							}
						},
						"/kubernetes/bundle": {
							"_apiInfo": {
								"l": "This API deploys a bundle deployment of resources.",
								"group": "Kubernetes bundle"
							},
							"commonFields": ["configuration"],
							"bundle": {
								"source": ["body.bundle"],
								"required": true,
								"validation": {
									"type": "array",
									"minItems": 1,
									"items": {
										"type": "object",
										"properties": {
											"type": {
												"type": "string",
												"enum": ["native"]
											},
											"recipe": {
												"type": "object",
												"properties": {
													"apiVersion": {
														"type": "string"
													},
													"kind": {
														"type": "string"
													},
													"metadata": {
														"type": "object",
														"properties": {
															"name": {
																"type": "string"
															}
														},
														"required": ["name"]
													}
												},
												"required": ["apiVersion", "kind", "metadata"]
											}
										},
										"required": ["type", "recipe"]
									}
								}
							}
						},
						
						"/kubernetes/workload/:mode": {
							"_apiInfo": {
								"l": "This API creates a resource of mode (Deployment, DaemonSet, CronJob, HPA. Pod).",
								"group": "Kubernetes workloads"
							},
							"commonFields": ["configuration"],
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Deployment", "DaemonSet", "CronJob", "HPA", "Pod"]
								}
							},
							"body": {
								"source": ["body.body"],
								"required": true,
								"validation": {
									"type": "object",
									"properties": {
										"kind": {
											"type": "string",
											"enum": ["Deployment", "DaemonSet", "CronJob", "HorizontalPodAutoscaler", "Pod"]
										}
									},
									"required": ["kind"]
								}
							}
						},
						"/kubernetes/service/:mode": {
							"_apiInfo": {
								"l": "This API creates a resource of mode (Service).",
								"group": "Kubernetes services"
							},
							"commonFields": ["configuration"],
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Service"]
								}
							},
							"body": {
								"source": ["body.body"],
								"required": true,
								"validation": {
									"type": "object",
									"properties": {
										"kind": {
											"type": "string",
											"enum": ["Service"]
										}
									},
									"required": ["kind"]
								}
							}
						},
						"/kubernetes/storage/:mode": {
							"_apiInfo": {
								"l": "This API creates a resource of mode (PVC, PV, StorageClass).",
								"group": "Kubernetes storage"
							},
							"commonFields": ["configuration"],
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["PVC", "PV", "StorageClass"]
								}
							},
							"body": {
								"source": ["body.body"],
								"required": true,
								"validation": {
									"type": "object",
									"properties": {
										"kind": {
											"type": "string",
											"enum": ["PersistentVolumeClaim", "PersistentVolume", "StorageClass"]
										}
									},
									"required": ["kind"]
								}
							}
						},
						"/kubernetes/configuration/:mode": {
							"_apiInfo": {
								"l": "This API creates a resource of mode (Secret).",
								"group": "Kubernetes configuration"
							},
							"commonFields": ["configuration"],
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Secret"]
								}
							},
							"body": {
								"source": ["body.body"],
								"required": true,
								"validation": {
									"type": "object",
									"properties": {
										"kind": {
											"type": "string",
											"enum": ["Secret"]
										}
									},
									"required": ["kind"]
								}
							}
						},
						"/kubernetes/rbac/:mode": {
							"_apiInfo": {
								"l": "This API creates a resource of mode (ClusterRole, ClusterRoleBinding, RoleBinding, APIService, ServiceAccount).",
								"group": "Kubernetes RBAC"
							},
							"commonFields": ["configuration"],
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["ClusterRole", "ClusterRoleBinding", "RoleBinding", "APIService", "ServiceAccount"]
								}
							},
							"body": {
								"source": ["body.body"],
								"required": true,
								"validation": {
									"type": "object",
									"properties": {
										"kind": {
											"type": "string",
											"enum": ["ClusterRole", "ClusterRoleBinding", "RoleBinding", "APIService", "ServiceAccount"]
										}
									},
									"required": ["kind"]
								}
							}
						},
						
						"/kubernetes/namespace": {
							"_apiInfo": {
								"l": "This API creates a namespace.",
								"group": "Kubernetes environment"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["body.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							}
						},
						
						"/kubernetes/item/hpa": {
							"_apiInfo": {
								"l": "This API creates an HPA.",
								"group": "Kubernetes item"
							},
							"commonFields": ["configuration"],
							"item": {
								"source": ["body.item"],
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
							},
							"replica": {
								"source": ["body.replica"],
								"required": true,
								"validation": {
									"type": "object",
									"properties": {
										"min": {
											"type": "integer",
											"minimum": 1
											
										},
										"max": {
											"type": "integer",
											"minimum": 1
										}
									},
									"required": ["min", "max"]
								}
							},
							"metrics": {
								"source": ["body.metrics"],
								"required": true,
								"validation": {
									"type": "array",
									"minItems": 1,
									"items": {
										"anyOf": [{
											"type": "object",
											"additionalProperties": false,
											"properties": {
												"type": {
													"type": "string",
													"enum": ["Resource"]
												},
												"name": {
													"type": "string",
													"enum": ["cpu", "memory"]
												},
												"target": {
													"type": "string",
													"enum": ["AverageValue", "Utilization"]
												},
												"percentage": {
													"type": "integer",
													"minimum": 1,
													"maximum": 100
												}
											},
											"required": ["type", "name", "target", "percentage"]
										},
											{
												"type": "object",
												"additionalProperties": false,
												"properties": {
													"type": {
														"type": "string",
														"enum": ["Pods"]
													},
													"name": {
														"type": "string",
														"enum": ["packets-per-second"]
													},
													"target": {
														"type": "string",
														"enum": ["AverageValue"]
													},
													"value": {
														"type": "string"
													}
												},
												"required": ["type", "name", "target", "value"]
											},
											{
												"type": "object",
												"additionalProperties": false,
												"properties": {
													"type": {
														"type": "string",
														"enum": ["Object"]
													},
													"name": {
														"type": "string",
														"enum": ["requests-per-second"]
													},
													"target": {
														"type": "string",
														"enum": ["AverageValue", "Value"]
													},
													"value": {
														"type": "string"
													}
												},
												"required": ["type", "name", "target", "value"]
											}
										]
									}
								}
							}
						},
						"/kubernetes/secret": {
							"_apiInfo": {
								"l": "This API creates a secret.",
								"group": "Kubernetes configuration wizard"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["body.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"content": {
								"source": ["body.content"],
								"required": true,
								"validation": {
									"type": "array",
									"minItems": 1,
									"items": {
										"type": "object",
										"properties": {
											"name": {
												"type": "string"
											},
											"content": {
												"type": "string"
											}
										},
										"required": ["name", "content"]
									}
								}
							}
						},
						"/kubernetes/secret/registry": {
							"_apiInfo": {
								"l": "This API creates a secret for private image registry.",
								"group": "Kubernetes configuration wizard"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["body.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"content": {
								"source": ["body.content"],
								"required": true,
								"validation": {
									"type": "object",
									"properties": {
										"username": {
											"type": "string"
										},
										"password": {
											"type": "string"
										},
										"email": {
											"type": "string"
										},
										"server": {
											"type": "string"
										}
									},
									"required": ["username", "password", "email", "server"]
								}
							}
						},
						"/kubernetes/pvc": {
							"_apiInfo": {
								"l": "This API creates a PVC.",
								"group": "Kubernetes storage wizard"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["body.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"accessModes": {
								"source": ["body.accessModes"],
								"required": true,
								"validation": {
									"type": "array",
									"minItems": 1,
									"uniqueItems": true,
									'items': {
										'type': "string",
										'enum': ["ReadWriteOnce", "ReadOnlyMany", "ReadWriteMany"]
									}
								}
							},
							"storage": {
								"source": ["body.storage"],
								"required": false,
								"validation": {
									"type": "string"
								}
							},
							"storageClassName": {
								"source": ["body.storageClassName"],
								"required": false,
								"validation": {
									"type": "string"
								}
							},
							"volumeMode": {
								"source": ["body.volumeMode"],
								"required": false,
								"validation": {
									"type": "string",
									"enum": ["Filesystem", "Block"]
								}
							}
						},
						
						"/kubernetes/item/deploy/soajs": {
							"_apiInfo": {
								"l": "This API deploys an item from the catalog using soajs recipe of type Deployment or DaemonSet.",
								"group": "Kubernetes item"
							},
							"commonFields": ["configuration"],
							"recipe": {
								"source": ["body.recipe"],
								"required": true,
								"validation": {}
							}
						},
						"/kubernetes/item/deploy/soajs/cronjob": {
							"_apiInfo": {
								"l": "This API deploys an item from the catalog using soajs recipe of type CronJob.",
								"group": "Kubernetes item"
							},
							"commonFields": ["configuration"],
							"recipe": {
								"source": ["body.recipe"],
								"required": true,
								"validation": {}
							}
						},
						"/kubernetes/item/deploy/native": {
							"_apiInfo": {
								"l": "This API deploys an item from the catalog using kubernetes native recipe of type Deployment or DaemonSet.",
								"group": "Kubernetes item"
							},
							"commonFields": ["configuration"],
							"recipe": {
								"source": ["body.recipe"],
								"required": true,
								"validation": {}
							}
						},
						"/kubernetes/item/deploy/native/cronjob": {
							"_apiInfo": {
								"l": "This API deploys an item from the catalog using kubernetes native recipe of type CronJob.",
								"group": "Kubernetes item"
							},
							"commonFields": ["configuration"],
							"recipe": {
								"source": ["body.recipe"],
								"required": true,
								"validation": {}
							}
						},
						"/kubernetes/deploy/native": {
							"_apiInfo": {
								"l": "This API creates the service and the related Deployment, DaemonSet or CronJob.",
								"group": "Kubernetes item"
							},
							"commonFields": ["configuration"],
							"service": {
								"source": ["body.service"],
								"required": false,
								"validation": {
									"type": "object"
								}
							},
							"deployment": {
								"source": ["body.deployment"],
								"required": true,
								"validation": {
									"type": "object",
									"properties": {
										"kind": {
											"type": "string",
											"enum": ["Deployment", "DaemonSet", "CronJob"]
										}
									},
									"required": ["kind"]
								}
							}
						}
					},
					
					"delete": {
						"/account/kubernetes": {
							"_apiInfo": {
								"l": "This API deletes a kubernetes account.",
								"group": "Account"
							},
							"id": {
								"source": ["body.id"],
								"required": true,
								"validation": {
									"type": "string"
								}
							}
						},
						"/account/kubernetes/acl": {
							"_apiInfo": {
								"l": "This API deletes kubernetes account acl",
								"group": "Account"
							},
							"id": {
								"source": ["query.id"],
								"required": true,
								"validation": {
									"type": "string"
								}
							}
						},
						"/cd/token": {
							"_apiInfo": {
								"l": "This API deletes a deployment cd token.",
								"group": "Token"
							},
							"token": {
								"source": ["body.token"],
								"required": true,
								"validation": {
									"type": "string"
								}
							}
						},
						"/kubernetes/plugin": {
							"_apiInfo": {
								"l": "This API deletes a plugin along with all its resources.",
								"group": "Kubernetes plugin"
							},
							"commonFields": ["configuration"],
							"plugin": {
								"source": ["query.plugin"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["metric-server"]
								}
							}
						},
						"/kubernetes/bundle": {
							"_apiInfo": {
								"l": "This API removes all the resources of a deployed bundle.",
								"group": "Kubernetes bundle"
							},
							"commonFields": ["configuration"],
							"bundle": {
								"source": ["body.bundle"],
								"required": true,
								"validation": {
									"type": "array",
									"minItems": 1,
									"items": {
										"type": "object",
										"properties": {
											"apiVersion": {
												"type": "string"
											},
											"kind": {
												"type": "string"
											},
											"metadata": {
												"type": "object",
												"properties": {
													"name": {
														"type": "string"
													}
												},
												"required": ["name"]
											}
										},
										"required": ["kind", "metadata"]
									}
								}
							}
						},
						
						"/kubernetes/workload/:mode": {
							"_apiInfo": {
								"l": "This API deletes a resource of mode (Deployment, DaemonSet, CronJob, HPA).",
								"group": "Kubernetes workloads"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Deployment", "DaemonSet", "CronJob", "HPA"]
								}
							}
						},
						"/kubernetes/service/:mode": {
							"_apiInfo": {
								"l": "This API deletes a resource of mode (Service).",
								"group": "Kubernetes services"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Service"]
								}
							}
						},
						"/kubernetes/storage/:mode": {
							"_apiInfo": {
								"l": "This API deletes a resource of mode (PVC, PV, StorageClass).",
								"group": "Kubernetes storage"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["PVC", "PV", "StorageClass"]
								}
							}
						},
						"/kubernetes/configuration/:mode": {
							"_apiInfo": {
								"l": "This API deletes a resource of mode (Secret).",
								"group": "Kubernetes configuration"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Secret"]
								}
							}
						},
						"/kubernetes/rbac/:mode": {
							"_apiInfo": {
								"l": "This API deletes a resource of mode (ClusterRole, ClusterRoleBinding, RoleBinding, APIService, ServiceAccount).",
								"group": "Kubernetes RBAC"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["ClusterRole", "ClusterRoleBinding", "RoleBinding", "APIService", "ServiceAccount"]
								}
							}
						},
						
						"/kubernetes/pods": {
							"_apiInfo": {
								"l": "This API deletes pods.",
								"group": "Kubernetes workloads"
							},
							"commonFields": ["configuration"],
							"filter": {
								"source": ["body.filter"],
								"required": true,
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
						"/kubernetes/namespace": {
							"_apiInfo": {
								"l": "This API deletes a namespace.",
								"group": "Kubernetes environment"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["body.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							}
						},
						"/kubernetes/item": {
							"_apiInfo": {
								"l": "This API deletes an item of type (Deployment, DaemonSet  or CronJob) as well as the related HPA with the related service.",
								"group": "Kubernetes item"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["body.name"],
								"required": true,
								"validation": {
									"type": "string"
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
							"cleanup": {
								"source": ["body.cleanup"],
								"required": false,
								"validation": {
									"type": "boolean",
									"default": false
								}
							}
						}
					}
				},
			},
			"documentation": {
				"release": "Release: V1",
				"readme": "# soajs.test Test Express Service for Patch, Head, and others"
			}
		}
	},
	"soajs_1_3": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.test",
				"branch": "master"
			},
			"soa": {
				"name": "infra",
				"group": "soajs",
				"subType": 'soajs',
				"port": 4008,
				"version": "2",
				"description": "description is description",
				"extKeyRequired": true,
				"oauth": false,
				"urac": true,
				"urac_Profile": false,
				"requestTimeout": 30,
				"requestTimeoutRenewal": 5,
				"urac_ACL": false,
				"provision_ACL": false,
				"type": "service",
				"tags": ["tag1"],
				"program": ["program1"],
				"attributes": {
					"attrib": "1"
				},
				"tab": {
					"main" : "mainTab",
					"sub" : "subtab"
				},
				"interConnect": [{
					"name": "example2"
				}],
				"prerequisites": {
					"cpu": " ",
					"memory": " "
				},
				"documentation": {
					"readme": "README.md",
					"release": "RELEASE.md"
				},
				"swaggerFilename": "swagger.json",
				"maintenance": {
					"port": {
						"type": "inherit"
					},
					"readiness": "/heartbeat"
				}
			},
			"apiList": {
				"type": "schema",
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
						"/account/kubernetes": {
							"_apiInfo": {
								"l": "This API returns kubernetes account(s).",
								"group": "Account"
							},
							"id": {
								"source": ["query.id"],
								"validation": {
									"type": "string"
								}
							}
						},
						"/account/kubernetes/token": {
							"_apiInfo": {
								"l": "This API returns kubernetes account with token.",
								"group": "Internal"
							},
							"id": {
								"source": ["query.id"],
								"required": true,
								"validation": {
									"type": "string"
								}
							}
						},
						
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
						"/cd/tokens": {
							"_apiInfo": {
								"l": "This API returns all the available deployment cd tokens.",
								"group": "Token"
							}
						},
						
						"/kubernetes/plugin": {
							"_apiInfo": {
								"l": "This API fetches the information of a plugin along with all its resources.",
								"group": "Kubernetes plugin"
							},
							"commonFields": ["configuration"],
							"plugin": {
								"source": ["query.plugin"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["metric-server"]
								}
							}
						},
						"/kubernetes/bundle": {
							"_apiInfo": {
								"l": "This API fetches the information of a bundle deployment.",
								"group": "Kubernetes bundle"
							},
							"commonFields": ["configuration"],
							"bundle": {
								"source": ["query.bundle"],
								"required": true,
								"validation": {
									"type": "array",
									"minItems": 1,
									"items": {
										"type": "object",
										"properties": {
											"apiVersion": {
												"type": "string"
											},
											"kind": {
												"type": "string"
											},
											"metadata": {
												"type": "object",
												"properties": {
													"name": {
														"type": "string"
													}
												},
												"required": ["name"]
											}
										},
										"required": ["kind", "metadata"]
									}
								}
							}
						},
						
						"/kubernetes/cluster/:mode": {
							"_apiInfo": {
								"l": "This API returns the cluster information of a resource of mode (Node, Namespace).",
								"group": "Kubernetes cluster"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Node", "Namespace"]
								}
							}
						},
						"/kubernetes/workload/:mode": {
							"_apiInfo": {
								"l": "This API returns the workloads information of a resource of mode (Deployment, DaemonSet, CronJob, Pod, HPA).",
								"group": "Kubernetes workloads"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Deployment", "DaemonSet", "CronJob", "Pod", "HPA"]
								}
							}
						},
						"/kubernetes/service/:mode": {
							"_apiInfo": {
								"l": "This API returns the services information of a resource of mode (Service).",
								"group": "Kubernetes services"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Service"]
								}
							}
						},
						"/kubernetes/storage/:mode": {
							"_apiInfo": {
								"l": "This API returns the storage information of a resource of mode (PVC, PV, StorageClass).",
								"group": "Kubernetes storage"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["PVC", "PV", "StorageClass"]
								}
							}
						},
						"/kubernetes/configuration/:mode": {
							"_apiInfo": {
								"l": "This API returns the storage information of a resource of mode (Secret).",
								"group": "Kubernetes configuration"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Secret"]
								}
							}
						},
						"/kubernetes/rbac/:mode": {
							"_apiInfo": {
								"l": "This API returns the rbac information of a resource of mode (ClusterRole, ClusterRoleBinding, RoleBinding, APIService, ServiceAccount).",
								"group": "Kubernetes RBAC"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["ClusterRole", "ClusterRoleBinding", "RoleBinding", "APIService", "ServiceAccount"]
								}
							}
						},
						
						"/kubernetes/clusters/:mode": {
							"_apiInfo": {
								"l": "This API returns the cluster information of all resources of mode (Node, Namespace).",
								"group": "Kubernetes cluster"
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
							},
							"limit": {
								"source": ["query.limit"],
								"required": false,
								"validation": {
									"type": "integer",
									"minimum": 100,
									"maximum": 500
								}
							},
							"continue": {
								"source": ["query.continue"],
								"required": false,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Node", "Namespace"]
								}
							},
							"type": {
								"source": ["query.type"],
								"required": false,
								"validation": {
									"type": "string",
									"enum": ["Item", "Other", "All"]
								}
							}
						},
						"/kubernetes/workloads/:mode": {
							"_apiInfo": {
								"l": "This API returns the workloads information of all resources of mode (Deployment, DaemonSet, CronJob, Pod, HPA).",
								"group": "Kubernetes workloads"
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
							},
							"limit": {
								"source": ["query.limit"],
								"required": true,
								"validation": {
									"type": "integer",
									"minimum": 100,
									"maximum": 500
								}
							},
							"continue": {
								"source": ["query.continue"],
								"required": false,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Deployment", "DaemonSet", "CronJob", "Pod", "HPA"]
								}
							},
							"type": {
								"source": ["query.type"],
								"required": false,
								"validation": {
									"type": "string",
									"enum": ["Item", "Other", "All"]
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
							},
							"limit": {
								"source": ["query.limit"],
								"required": true,
								"validation": {
									"type": "integer",
									"minimum": 100,
									"maximum": 500
								}
							},
							"continue": {
								"source": ["query.continue"],
								"required": false,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Service"]
								}
							},
							"type": {
								"source": ["query.type"],
								"required": false,
								"validation": {
									"type": "string",
									"enum": ["Item", "Other", "All"]
								}
							}
						},
						"/kubernetes/storages/:mode": {
							"_apiInfo": {
								"l": "This API returns the storage information of all resources of mode (PVC, PV, StorageClass).",
								"group": "Kubernetes storage"
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
							},
							"limit": {
								"source": ["query.limit"],
								"required": true,
								"validation": {
									"type": "integer",
									"minimum": 100,
									"maximum": 500
								}
							},
							"continue": {
								"source": ["query.continue"],
								"required": false,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["PVC", "PV", "StorageClass"]
								}
							},
							"type": {
								"source": ["query.type"],
								"required": false,
								"validation": {
									"type": "string",
									"enum": ["Item", "Other", "All"]
								}
							}
						},
						"/kubernetes/configurations/:mode": {
							"_apiInfo": {
								"l": "This API returns the storage information of all resources of mode (Secret).",
								"group": "Kubernetes configuration"
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
							},
							"limit": {
								"source": ["query.limit"],
								"required": true,
								"validation": {
									"type": "integer",
									"minimum": 100,
									"maximum": 500
								}
							},
							"continue": {
								"source": ["query.continue"],
								"required": false,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["Secret"]
								}
							},
							"type": {
								"source": ["query.type"],
								"required": false,
								"validation": {
									"type": "string",
									"enum": ["Item", "Other", "All"]
								}
							}
						},
						"/kubernetes/rbacs/:mode": {
							"_apiInfo": {
								"l": "This API returns the rbac information of all resources of mode (ClusterRole, ClusterRoleBinding, RoleBinding, APIService, ServiceAccount).",
								"group": "Kubernetes RBAC"
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
							},
							"limit": {
								"source": ["query.limit"],
								"required": true,
								"validation": {
									"type": "integer",
									"minimum": 100,
									"maximum": 500
								}
							},
							"continue": {
								"source": ["query.continue"],
								"required": false,
								"validation": {
									"type": "string"
								}
							},
							"mode": {
								"source": ["params.mode"],
								"required": true,
								"validation": {
									"type": "string",
									"enum": ["ClusterRole", "ClusterRoleBinding", "RoleBinding", "APIService", "ServiceAccount"]
								}
							},
							"type": {
								"source": ["query.type"],
								"required": false,
								"validation": {
									"type": "string",
									"enum": ["Item", "Other", "All"]
								}
							}
						},
						
						"/kubernetes/item/latestVersion": {
							"_apiInfo": {
								"l": "This API fetches the latest version deployed of an item.",
								"group": "Kubernetes item"
							},
							"commonFields": ["configuration"],
							"itemName": {
								"source": ["query.itemName"],
								"required": true,
								"validation": {
									"type": "string"
								}
							}
						},
						"/kubernetes/pod/log": {
							"_apiInfo": {
								"l": "This API fetches the container Logs and capable to tail the log if follow is set to true.",
								"group": "Kubernetes workloads"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							},
							"follow": {
								"source": ["query.follow"],
								"required": false,
								"validation": {
									"type": "boolean",
									"default": false
								}
							},
							"lines": {
								"source": ["query.lines"],
								"required": false,
								"validation": {
									"type": "integer",
									"default": 400,
									"minimum": 400,
									"maximum": 2000
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
						
						"/kubernetes/item/metrics": {
							"_apiInfo": {
								"l": "This API fetches the item metrics.",
								"group": "Kubernetes item"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": true,
								"validation": {
									"type": "string"
								}
							}
						},
						"/kubernetes/pods/metrics": {
							"_apiInfo": {
								"l": "This API fetches the container metrics.",
								"group": "Kubernetes workloads"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": false,
								"validation": {
									"type": "string"
								}
							},
							"filter": {
								"source": ["query.filter"],
								"required": false,
								"validation": {
									"type": "object",
									"additionalProperties": true,
									"properties": {
										"labelSelector": {
											"type": "string"
										}
									}
								}
							}
						},
						"/kubernetes/nodes/metrics": {
							"_apiInfo": {
								"l": "This API fetches the node metrics.",
								"group": "Kubernetes cluster"
							},
							"commonFields": ["configuration"],
							"name": {
								"source": ["query.name"],
								"required": false,
								"validation": {
									"type": "string"
								}
							},
							"filter": {
								"source": ["query.filter"],
								"required": false,
								"validation": {
									"type": "object",
									"additionalProperties": true,
									"properties": {
										"labelSelector": {
											"type": "string"
										}
									}
								}
							}
						},
						
						"/manual/awareness": {
							"_apiInfo": {
								"l": "This API gets the controller microservices awareness",
								"group": "Manual"
							},
							"env": {
								"source": ["query.env"],
								"required": true,
								"validation": {
									"type": "string",
									"pattern": /^(([a-z0-9][-a-z0-9_.]*)?[a-z0-9])?$/
								}
							}
						}
					}
				},
			},
			"documentation": {
				"release": "Release: V1",
				"readme": "# soajs.test Test Express Service for Patch, Head, and others"
			}
		}
	},
	"soajs_2": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.dashboard",
				"tag": "1"
			},
			"soa": {
				"name": "dashboard",
				"group": "soajs",
				"subType": 'soajs',
				"profile" : {
					"test": "1"
				},
				"port": 4021,
				"version": "1",
				"description": "description is description",
				"extKeyRequired": true,
				"oauth": false,
				"urac": true,
				"urac_Profile": false,
				"requestTimeout": 30,
				"requestTimeoutRenewal": 5,
				"urac_ACL": false,
				"provision_ACL": false,
				"type": "service",
				"interConnect": [{
					"name": "example2"
				}],
				"prerequisites": {
					"cpu": " ",
					"memory": " "
				},
				"documentation": {
					"readme": "README.md",
					"release": "RELEASE.md"
				},
				"swaggerFilename": "swagger.json",
				"maintenance": {
					"port": {
						"type": "inherit"
					},
					"readiness": "/heartbeat"
				}
			},
			"apiList": {
				"type": "swagger",
				"schema": {
					"swagger": "2.0",
					"info": {
						"version": "1908.0001",
						"title": "calendar"
					},
					"host": "",
					"basePath": "/calendar",
					"tags": [
						{
							"name": "calendar"
						}
					],
					"paths": {
						"/v1/domain": {
							"post": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Creates a domain",
								"operationId": "createDomain",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"in": "body",
										"name": "body",
										"description": "Domain to be added",
										"required": false,
										"schema": {
											"$ref": "#/definitions/Create Domain Message"
										}
									}
								],
								"responses": {
									"200": {
										"description": "OK"
									},
									"412": {
										"description": "Domain already exists.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/health": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Returns health status of server.",
								"operationId": "healthCheck",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "apiVersion",
										"in": "path",
										"description": "v1|v2",
										"required": true,
										"type": "string",
										"default": "v2"
									},
									{
										"name": "checkInterfaces",
										"in": "query",
										"description": "Check Interfaces",
										"required": false,
										"type": "array",
										"items": {
											"type": "boolean",
											"default": true
										},
										"collectionFormat": "multi"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"$ref": "#/definitions/Health Check Message"
										}
									},
									"400": {
										"description": "Not healthy",
										"schema": {
											"$ref": "#/definitions/Health Check Message"
										}
									}
								}
							}
						},
						"/v1/schedules": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Returns a list of Scheduler Requests based upon the filter criteria.",
								"operationId": "searchScheduleRequests",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "domain",
										"in": "query",
										"description": "Schedule domain.",
										"required": false,
										"type": "string"
									},
									{
										"name": "scheduleId",
										"in": "query",
										"description": "Schedule identifier",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "scheduleName",
										"in": "query",
										"description": "Schedule name",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "userId",
										"in": "query",
										"description": "Schedule User id of creator",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "status",
										"in": "query",
										"description": "Schedule status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "createDateTime",
										"in": "query",
										"description": "Creation date and time (yyyy-MM-dd'T'HH:mm:ssZ)",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "optimizerStatus",
										"in": "query",
										"description": "Optimizer status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "domainData",
										"in": "query",
										"description": "Domain data (Ex: name:value)",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "eventData",
										"in": "query",
										"description": "Event data (Ex : name:value)",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"type": "array",
											"items": {
												"$ref": "#/definitions/Schedule"
											}
										}
									},
									"400": {
										"description": "Invalid query scheduler details request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"404": {
										"description": "No records found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/schedules/scheduleDetails": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Returns a list of Scheduler details based upon the filter criteria.",
								"operationId": "searchScheduleRequestDetails",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "domain",
										"in": "query",
										"description": "Schedule domain.",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.scheduleId",
										"in": "query",
										"description": "Schedule identifier",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.scheduleName",
										"in": "query",
										"description": "Schedule name",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.userId",
										"in": "query",
										"description": "SCheduler creator User id of ",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.status",
										"in": "query",
										"description": "Schedule status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.createDateTime",
										"in": "query",
										"description": "Creation date and time (<low date>[,<hi date>])",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.optimizerStatus",
										"in": "query",
										"description": "Optimizer status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.approvalUserId",
										"in": "query",
										"description": "Request Approval user id",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.approvalStatus",
										"in": "query",
										"description": "Request Approval status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.approvalType",
										"in": "query",
										"description": "Request Approval type",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "startTime",
										"in": "query",
										"description": "Start time <low>,<high>",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "finishTime",
										"in": "query",
										"description": "Finish time <low>,<high>",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "maxSchedules",
										"in": "query",
										"description": "Maximum number of schedules to return",
										"required": false,
										"type": "integer",
										"format": "int32"
									},
									{
										"name": "lastScheduleId",
										"in": "query",
										"description": "Return schedules > lastScheduleId",
										"required": false,
										"type": "string"
									},
									{
										"name": "dd",
										"in": "query",
										"description": "Domain data name:Value dd=name:value",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "ed",
										"in": "query",
										"description": "Event data name:Value ed=name:value",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"type": "array",
											"items": {
												"$ref": "#/definitions/ScheduleEventMessage"
											}
										}
									},
									"400": {
										"description": "Invalid query scheduler details request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"404": {
										"description": "No records found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/schedules/{scheduleId}": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Retrieves a schedule request for scheduleId",
								"operationId": "getScheduleRequestInfo",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule info being retrieved.",
										"required": true,
										"type": "string"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"$ref": "#/definitions/Schedule"
										}
									},
									"404": {
										"description": "No record found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							},
							"post": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Creates a schedule request for scheduleId",
								"operationId": "createScheduleRequest",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule request being created.",
										"required": true,
										"type": "string"
									},
									{
										"in": "body",
										"name": "body",
										"description": "Data for creating a schedule request for the given schedule id",
										"required": false,
										"schema": {
											"$ref": "#/definitions/Schedule Message"
										}
									}
								],
								"responses": {
									"202": {
										"description": "Schedule request accepted."
									},
									"400": {
										"description": "Invalid schedule create request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"412": {
										"description": "Schedule request already exists for this schedule id.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							},
							"delete": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Deletes a schedule requests for scheduleId",
								"operationId": "deleteScheduleRequest",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule request being deleted.",
										"required": true,
										"type": "string"
									}
								],
								"responses": {
									"204": {
										"description": "Delete successful"
									},
									"404": {
										"description": "No record found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/schedules/{scheduleId}/approvals": {
							"post": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Adds an accept/reject approval status to the schedule request identified by scheduleId",
								"operationId": "approveScheduleRequest",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule request being accepted or rejected.",
										"required": true,
										"type": "string"
									},
									{
										"in": "body",
										"name": "body",
										"description": "Accept or reject approval message",
										"required": false,
										"schema": {
											"$ref": "#/definitions/ApprovalMessage"
										}
									}
								],
								"responses": {
									"200": {
										"description": "OK"
									},
									"400": {
										"description": "Invalid schedule approval/reject request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"404": {
										"description": "No record found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						}
					},
					"definitions": {
						"ApprovalMessage": {
							"type": "object",
							"required": [
								"approvalStatus",
								"approvalType",
								"approvalUserId"
							],
							"properties": {
								"approvalUserId": {
									"type": "string",
									"description": "User Id- ATTUID of the approving user"
								},
								"approvalStatus": {
									"type": "string",
									"description": "Approval status ",
									"enum": [
										"Accepted",
										"Rejected"
									]
								},
								"approvalType": {
									"type": "string",
									"description": "Approval Type",
									"enum": [
										"Tier 2"
									]
								}
							}
						},
						"ApprovalType": {
							"type": "object",
							"properties": {
								"id": {
									"type": "integer",
									"format": "int64"
								},
								"approvalCount": {
									"type": "integer",
									"format": "int32"
								},
								"approvalType": {
									"type": "string"
								},
								"domain": {
									"type": "string"
								},
								"scheduleApprovals": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/ScheduleApproval"
									}
								}
							}
						},
						"Create Domain Message": {
							"type": "object",
							"required": [
								"domain"
							],
							"properties": {
								"domain": {
									"type": "string",
									"description": "Domain name"
								}
							},
							"description": "Event definition for schedule creation"
						},
						"DomainData": {
							"type": "object",
							"properties": {
								"name": {
									"type": "string"
								},
								"value": {
									"type": "string"
								}
							}
						},
						"Event": {
							"type": "object",
							"properties": {
								"eventText": {
									"type": "string"
								},
								"eventTime": {
									"type": "string"
								},
								"recurEndTime": {
									"type": "string"
								},
								"reminder": {
									"type": "integer",
									"format": "int64"
								},
								"status": {
									"type": "string"
								},
								"statusMessage": {
									"type": "string"
								},
								"rrule": {
									"type": "string"
								},
								"timeSensitive": {
									"type": "boolean"
								},
								"eventData": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventData"
									}
								},
								"eventsPending": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventsPending"
									}
								}
							}
						},
						"EventData": {
							"type": "object",
							"properties": {
								"name": {
									"type": "string"
								},
								"value": {
									"type": "string"
								}
							}
						},
						"EventsPending": {
							"type": "object",
							"properties": {
								"id": {
									"type": "string"
								},
								"dispatchTime": {
									"type": "integer",
									"format": "int64"
								},
								"eventTime": {
									"type": "integer",
									"format": "int64"
								},
								"eventsId": {
									"type": "string"
								},
								"status": {
									"type": "string"
								},
								"eventTimeString": {
									"type": "string"
								},
								"dispatchTimeString": {
									"type": "string"
								}
							}
						},
						"Health Check Component": {
							"type": "object",
							"properties": {
								"name": {
									"type": "string",
									"description": "Componnent/interface name",
									"enum": [
										"Database",
										"DMaaPMR"
									]
								},
								"url": {
									"type": "string",
									"description": "URL representing component/interface"
								},
								"status": {
									"type": "string",
									"description": "'OK' or error status message"
								},
								"healthy": {
									"type": "boolean",
									"description": "Component health"
								}
							},
							"description": "Health of a single component of the instance"
						},
						"Health Check Message": {
							"type": "object",
							"properties": {
								"healthy": {
									"type": "boolean",
									"description": "Overall health of instance. false if even one component reports not healthy."
								},
								"buildInfo": {
									"type": "string",
									"description": "Build info (docker image name)"
								},
								"currentTime": {
									"type": "string",
									"description": "Current time on the instance."
								},
								"hostname": {
									"type": "string",
									"description": "Hostname (in k8s = pod name)"
								},
								"components": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/Health Check Component"
									}
								}
							},
							"description": "Returns status of calendar service instance"
						},
						"RequestError": {
							"type": "object",
							"properties": {
								"messageId": {
									"type": "string"
								},
								"text": {
									"type": "string"
								},
								"variables": {
									"type": "array",
									"items": {
										"type": "string"
									}
								}
							}
						},
						"Schedule": {
							"type": "object",
							"properties": {
								"id": {
									"type": "string"
								},
								"createDateTime": {
									"type": "string",
									"description": "Date/time of schedule creation"
								},
								"deleteDateTime": {
									"type": "string",
									"description": "Date/time of schedule deletion"
								},
								"globalRrule": {
									"type": "string",
									"description": "Global recurrence rule. Applies to all events unless a local RRULE is defined"
								},
								"globalRecurEndTime": {
									"type": "string",
									"description": "End time for global recurrance rule"
								},
								"optimizerDateTime": {
									"type": "string"
								},
								"optimizerReturnDateTime": {
									"type": "string"
								},
								"scheduleId": {
									"type": "string",
									"description": "Unique identifier of the schedule (UUID)"
								},
								"scheduleName": {
									"type": "string",
									"description": "User provided name for the schedule."
								},
								"status": {
									"type": "string",
									"description": "Status of the schedule.",
									"enum": [
										"PendingSchedule",
										"ScheduleFailed",
										"OptimizationInProgress",
										"PendingApproval",
										"OptimizationFailed",
										"Accepted",
										"Rejected",
										"Scheduled",
										"PublishingEvents",
										"PublishedEvents",
										"Completed",
										"CompletedWithError",
										"Deleted",
										"Cancelled"
									]
								},
								"userId": {
									"type": "string",
									"description": "ATTUID of the scheduler creator."
								},
								"domainData": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/DomainData"
									}
								},
								"events": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/Event"
									}
								},
								"scheduleApprovals": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/ScheduleApproval"
									}
								},
								"domain": {
									"type": "string"
								}
							}
						},
						"Schedule Event Message": {
							"type": "object",
							"required": [
								"eventJson",
								"eventTime"
							],
							"properties": {
								"eventJson": {
									"type": "object",
									"description": "Application provided JSON object which is pubvlished as eventData in the DMaaP event"
								},
								"eventTime": {
									"type": "string",
									"description": "Date/time of the event. (The first occurance in the case of a recurring event.)"
								},
								"recurEndTime": {
									"type": "string",
									"description": "Recurring events - date/time to end recurring event"
								},
								"reminder": {
									"type": "integer",
									"format": "int64",
									"description": "Reminder time, in seconds. Seconds subtracted from the event time to calculate actual publish time to account for the DMaaP latency."
								},
								"timeSensitive": {
									"type": "boolean",
									"description": "Time sensitive event.If true, Calendar will not publish event and update it to 'Past Due' if the event time has passed. Defaults to false which will not check for 'Past Due' events before publishing."
								},
								"rrule": {
									"type": "string",
									"description": "Event RRULE (RFC 5545) overrides the global RRULE in the schedule, if any"
								},
								"eventData": {
									"type": "array",
									"description": "Event metadata. These attributes may be used in query API and/or referenced in the eventText as ${eventdata.name}",
									"items": {
										"$ref": "#/definitions/EventData"
									}
								}
							},
							"description": "Event definition for schedule creation"
						},
						"Schedule Message": {
							"type": "object",
							"required": [
								"domain",
								"scheduleId",
								"userId"
							],
							"properties": {
								"domain": {
									"type": "string",
									"description": "Domain - Identifies the client application",
									"enum": [
										"ChangeManagement",
										"CLAMP",
										"POLO"
									]
								},
								"scheduleId": {
									"type": "string",
									"description": "Unique identifier of the schedule (UUID)"
								},
								"scheduleName": {
									"type": "string",
									"description": "User provided name of the scheduler, defaults to the scheduleId"
								},
								"userId": {
									"type": "string",
									"description": "Id of the user creating teh schedule"
								},
								"domainData": {
									"type": "array",
									"description": "Domain metadata - list of name/values ",
									"items": {
										"$ref": "#/definitions/DomainData"
									}
								},
								"globalRrule": {
									"type": "string",
									"description": "Global RRULE (RFC 5545) applied to all events in the schedule. Mutually exclusive of Event RRULE"
								},
								"scheduleInfo": {
									"type": "string"
								},
								"events": {
									"type": "array",
									"description": "Events provided by client or generated by optimizer.",
									"items": {
										"$ref": "#/definitions/Schedule Event Message"
									}
								}
							},
							"description": "Request for schedule creation"
						},
						"ScheduleApproval": {
							"type": "object",
							"properties": {
								"id": {
									"type": "integer",
									"format": "int64"
								},
								"approvalDateTime": {
									"type": "integer"
								},
								"status": {
									"type": "string"
								},
								"userId": {
									"type": "string"
								},
								"approvalType": {
									"$ref": "#/definitions/ApprovalType"
								}
							}
						},
						"ScheduleEventMessage": {
							"type": "object",
							"properties": {
								"eventText": {
									"type": "string"
								},
								"eventTime": {
									"type": "string"
								},
								"recurEndTime": {
									"type": "string"
								},
								"reminder": {
									"type": "integer",
									"format": "int64"
								},
								"status": {
									"type": "string"
								},
								"statusMessage": {
									"type": "string"
								},
								"rrule": {
									"type": "string"
								},
								"timeSensitive": {
									"type": "boolean"
								},
								"eventData": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventData"
									}
								},
								"eventsPending": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventsPending"
									}
								},
								"scheduleRequest": {
									"$ref": "#/definitions/Schedule"
								}
							}
						},
						"SchedulerRequestError": {
							"type": "object",
							"properties": {
								"requestError": {
									"$ref": "#/definitions/RequestError"
								}
							}
						}
					}
				},
			},
			"documentation": {
				"release": "Release: V1",
				"readme": "# soajs.test Test Express Service for Patch, Head, and others"
			}
		}
	},
	"soajs_2_2": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.dashboard",
				"tag": "2"
			},
			"soa": {
				"name": "dashboard",
				"group": "soajs",
				"subType": 'soajs',
				"profile" : {
					"test": "1"
				},
				"port": 4021,
				"version": "2",
				"description": "description is description",
				"extKeyRequired": true,
				"oauth": false,
				"urac": true,
				"urac_Profile": false,
				"requestTimeout": 30,
				"requestTimeoutRenewal": 5,
				"urac_ACL": false,
				"provision_ACL": false,
				"type": "service",
				"interConnect": [{
					"name": "example2"
				}],
				"prerequisites": {
					"cpu": " ",
					"memory": " "
				},
				"documentation": {
					"readme": "README.md",
					"release": "RELEASE.md"
				},
				"swaggerFilename": "swagger.json",
				"maintenance": {
					"port": {
						"type": "inherit"
					},
					"readiness": "/heartbeat"
				}
			},
			"apiList": {
				"type": "swagger",
				"schema": {
					"swagger": "2.0",
					"info": {
						"version": "1908.0001",
						"title": "calendar"
					},
					"host": "",
					"basePath": "/calendar",
					"tags": [
						{
							"name": "calendar"
						}
					],
					"paths": {
						"/v1/domain": {
							"post": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Creates a domain",
								"operationId": "createDomain",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"in": "body",
										"name": "body",
										"description": "Domain to be added",
										"required": false,
										"schema": {
											"$ref": "#/definitions/Create Domain Message"
										}
									}
								],
								"responses": {
									"200": {
										"description": "OK"
									},
									"412": {
										"description": "Domain already exists.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/health": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Returns health status of server.",
								"operationId": "healthCheck",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "apiVersion",
										"in": "path",
										"description": "v1|v2",
										"required": true,
										"type": "string",
										"default": "v2"
									},
									{
										"name": "checkInterfaces",
										"in": "query",
										"description": "Check Interfaces",
										"required": false,
										"type": "array",
										"items": {
											"type": "boolean",
											"default": true
										},
										"collectionFormat": "multi"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"$ref": "#/definitions/Health Check Message"
										}
									},
									"400": {
										"description": "Not healthy",
										"schema": {
											"$ref": "#/definitions/Health Check Message"
										}
									}
								}
							}
						},
						"/v1/schedules": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Returns a list of Scheduler Requests based upon the filter criteria.",
								"operationId": "searchScheduleRequests",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "domain",
										"in": "query",
										"description": "Schedule domain.",
										"required": false,
										"type": "string"
									},
									{
										"name": "scheduleId",
										"in": "query",
										"description": "Schedule identifier",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "scheduleName",
										"in": "query",
										"description": "Schedule name",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "userId",
										"in": "query",
										"description": "Schedule User id of creator",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "status",
										"in": "query",
										"description": "Schedule status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "createDateTime",
										"in": "query",
										"description": "Creation date and time (yyyy-MM-dd'T'HH:mm:ssZ)",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "optimizerStatus",
										"in": "query",
										"description": "Optimizer status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "domainData",
										"in": "query",
										"description": "Domain data (Ex: name:value)",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "eventData",
										"in": "query",
										"description": "Event data (Ex : name:value)",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"type": "array",
											"items": {
												"$ref": "#/definitions/Schedule"
											}
										}
									},
									"400": {
										"description": "Invalid query scheduler details request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"404": {
										"description": "No records found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/schedules/scheduleDetails": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Returns a list of Scheduler details based upon the filter criteria.",
								"operationId": "searchScheduleRequestDetails",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "domain",
										"in": "query",
										"description": "Schedule domain.",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.scheduleId",
										"in": "query",
										"description": "Schedule identifier",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.scheduleName",
										"in": "query",
										"description": "Schedule name",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.userId",
										"in": "query",
										"description": "SCheduler creator User id of ",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.status",
										"in": "query",
										"description": "Schedule status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.createDateTime",
										"in": "query",
										"description": "Creation date and time (<low date>[,<hi date>])",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.optimizerStatus",
										"in": "query",
										"description": "Optimizer status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.approvalUserId",
										"in": "query",
										"description": "Request Approval user id",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.approvalStatus",
										"in": "query",
										"description": "Request Approval status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.approvalType",
										"in": "query",
										"description": "Request Approval type",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "startTime",
										"in": "query",
										"description": "Start time <low>,<high>",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "finishTime",
										"in": "query",
										"description": "Finish time <low>,<high>",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "maxSchedules",
										"in": "query",
										"description": "Maximum number of schedules to return",
										"required": false,
										"type": "integer",
										"format": "int32"
									},
									{
										"name": "lastScheduleId",
										"in": "query",
										"description": "Return schedules > lastScheduleId",
										"required": false,
										"type": "string"
									},
									{
										"name": "dd",
										"in": "query",
										"description": "Domain data name:Value dd=name:value",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "ed",
										"in": "query",
										"description": "Event data name:Value ed=name:value",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"type": "array",
											"items": {
												"$ref": "#/definitions/ScheduleEventMessage"
											}
										}
									},
									"400": {
										"description": "Invalid query scheduler details request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"404": {
										"description": "No records found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/schedules/{scheduleId}": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Retrieves a schedule request for scheduleId",
								"operationId": "getScheduleRequestInfo",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule info being retrieved.",
										"required": true,
										"type": "string"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"$ref": "#/definitions/Schedule"
										}
									},
									"404": {
										"description": "No record found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							},
							"post": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Creates a schedule request for scheduleId",
								"operationId": "createScheduleRequest",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule request being created.",
										"required": true,
										"type": "string"
									},
									{
										"in": "body",
										"name": "body",
										"description": "Data for creating a schedule request for the given schedule id",
										"required": false,
										"schema": {
											"$ref": "#/definitions/Schedule Message"
										}
									}
								],
								"responses": {
									"202": {
										"description": "Schedule request accepted."
									},
									"400": {
										"description": "Invalid schedule create request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"412": {
										"description": "Schedule request already exists for this schedule id.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							},
							"delete": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Deletes a schedule requests for scheduleId",
								"operationId": "deleteScheduleRequest",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule request being deleted.",
										"required": true,
										"type": "string"
									}
								],
								"responses": {
									"204": {
										"description": "Delete successful"
									},
									"404": {
										"description": "No record found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/schedules/{scheduleId}/approvals": {
							"post": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Adds an accept/reject approval status to the schedule request identified by scheduleId",
								"operationId": "approveScheduleRequest",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule request being accepted or rejected.",
										"required": true,
										"type": "string"
									},
									{
										"in": "body",
										"name": "body",
										"description": "Accept or reject approval message",
										"required": false,
										"schema": {
											"$ref": "#/definitions/ApprovalMessage"
										}
									}
								],
								"responses": {
									"200": {
										"description": "OK"
									},
									"400": {
										"description": "Invalid schedule approval/reject request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"404": {
										"description": "No record found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						}
					},
					"definitions": {
						"ApprovalMessage": {
							"type": "object",
							"required": [
								"approvalStatus",
								"approvalType",
								"approvalUserId"
							],
							"properties": {
								"approvalUserId": {
									"type": "string",
									"description": "User Id- ATTUID of the approving user"
								},
								"approvalStatus": {
									"type": "string",
									"description": "Approval status ",
									"enum": [
										"Accepted",
										"Rejected"
									]
								},
								"approvalType": {
									"type": "string",
									"description": "Approval Type",
									"enum": [
										"Tier 2"
									]
								}
							}
						},
						"ApprovalType": {
							"type": "object",
							"properties": {
								"id": {
									"type": "integer",
									"format": "int64"
								},
								"approvalCount": {
									"type": "integer",
									"format": "int32"
								},
								"approvalType": {
									"type": "string"
								},
								"domain": {
									"type": "string"
								},
								"scheduleApprovals": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/ScheduleApproval"
									}
								}
							}
						},
						"Create Domain Message": {
							"type": "object",
							"required": [
								"domain"
							],
							"properties": {
								"domain": {
									"type": "string",
									"description": "Domain name"
								}
							},
							"description": "Event definition for schedule creation"
						},
						"DomainData": {
							"type": "object",
							"properties": {
								"name": {
									"type": "string"
								},
								"value": {
									"type": "string"
								}
							}
						},
						"Event": {
							"type": "object",
							"properties": {
								"eventText": {
									"type": "string"
								},
								"eventTime": {
									"type": "string"
								},
								"recurEndTime": {
									"type": "string"
								},
								"reminder": {
									"type": "integer",
									"format": "int64"
								},
								"status": {
									"type": "string"
								},
								"statusMessage": {
									"type": "string"
								},
								"rrule": {
									"type": "string"
								},
								"timeSensitive": {
									"type": "boolean"
								},
								"eventData": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventData"
									}
								},
								"eventsPending": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventsPending"
									}
								}
							}
						},
						"EventData": {
							"type": "object",
							"properties": {
								"name": {
									"type": "string"
								},
								"value": {
									"type": "string"
								}
							}
						},
						"EventsPending": {
							"type": "object",
							"properties": {
								"id": {
									"type": "string"
								},
								"dispatchTime": {
									"type": "integer",
									"format": "int64"
								},
								"eventTime": {
									"type": "integer",
									"format": "int64"
								},
								"eventsId": {
									"type": "string"
								},
								"status": {
									"type": "string"
								},
								"eventTimeString": {
									"type": "string"
								},
								"dispatchTimeString": {
									"type": "string"
								}
							}
						},
						"Health Check Component": {
							"type": "object",
							"properties": {
								"name": {
									"type": "string",
									"description": "Componnent/interface name",
									"enum": [
										"Database",
										"DMaaPMR"
									]
								},
								"url": {
									"type": "string",
									"description": "URL representing component/interface"
								},
								"status": {
									"type": "string",
									"description": "'OK' or error status message"
								},
								"healthy": {
									"type": "boolean",
									"description": "Component health"
								}
							},
							"description": "Health of a single component of the instance"
						},
						"Health Check Message": {
							"type": "object",
							"properties": {
								"healthy": {
									"type": "boolean",
									"description": "Overall health of instance. false if even one component reports not healthy."
								},
								"buildInfo": {
									"type": "string",
									"description": "Build info (docker image name)"
								},
								"currentTime": {
									"type": "string",
									"description": "Current time on the instance."
								},
								"hostname": {
									"type": "string",
									"description": "Hostname (in k8s = pod name)"
								},
								"components": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/Health Check Component"
									}
								}
							},
							"description": "Returns status of calendar service instance"
						},
						"RequestError": {
							"type": "object",
							"properties": {
								"messageId": {
									"type": "string"
								},
								"text": {
									"type": "string"
								},
								"variables": {
									"type": "array",
									"items": {
										"type": "string"
									}
								}
							}
						},
						"Schedule": {
							"type": "object",
							"properties": {
								"id": {
									"type": "string"
								},
								"createDateTime": {
									"type": "string",
									"description": "Date/time of schedule creation"
								},
								"deleteDateTime": {
									"type": "string",
									"description": "Date/time of schedule deletion"
								},
								"globalRrule": {
									"type": "string",
									"description": "Global recurrence rule. Applies to all events unless a local RRULE is defined"
								},
								"globalRecurEndTime": {
									"type": "string",
									"description": "End time for global recurrance rule"
								},
								"optimizerDateTime": {
									"type": "string"
								},
								"optimizerReturnDateTime": {
									"type": "string"
								},
								"scheduleId": {
									"type": "string",
									"description": "Unique identifier of the schedule (UUID)"
								},
								"scheduleName": {
									"type": "string",
									"description": "User provided name for the schedule."
								},
								"status": {
									"type": "string",
									"description": "Status of the schedule.",
									"enum": [
										"PendingSchedule",
										"ScheduleFailed",
										"OptimizationInProgress",
										"PendingApproval",
										"OptimizationFailed",
										"Accepted",
										"Rejected",
										"Scheduled",
										"PublishingEvents",
										"PublishedEvents",
										"Completed",
										"CompletedWithError",
										"Deleted",
										"Cancelled"
									]
								},
								"userId": {
									"type": "string",
									"description": "ATTUID of the scheduler creator."
								},
								"domainData": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/DomainData"
									}
								},
								"events": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/Event"
									}
								},
								"scheduleApprovals": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/ScheduleApproval"
									}
								},
								"domain": {
									"type": "string"
								}
							}
						},
						"Schedule Event Message": {
							"type": "object",
							"required": [
								"eventJson",
								"eventTime"
							],
							"properties": {
								"eventJson": {
									"type": "object",
									"description": "Application provided JSON object which is pubvlished as eventData in the DMaaP event"
								},
								"eventTime": {
									"type": "string",
									"description": "Date/time of the event. (The first occurance in the case of a recurring event.)"
								},
								"recurEndTime": {
									"type": "string",
									"description": "Recurring events - date/time to end recurring event"
								},
								"reminder": {
									"type": "integer",
									"format": "int64",
									"description": "Reminder time, in seconds. Seconds subtracted from the event time to calculate actual publish time to account for the DMaaP latency."
								},
								"timeSensitive": {
									"type": "boolean",
									"description": "Time sensitive event.If true, Calendar will not publish event and update it to 'Past Due' if the event time has passed. Defaults to false which will not check for 'Past Due' events before publishing."
								},
								"rrule": {
									"type": "string",
									"description": "Event RRULE (RFC 5545) overrides the global RRULE in the schedule, if any"
								},
								"eventData": {
									"type": "array",
									"description": "Event metadata. These attributes may be used in query API and/or referenced in the eventText as ${eventdata.name}",
									"items": {
										"$ref": "#/definitions/EventData"
									}
								}
							},
							"description": "Event definition for schedule creation"
						},
						"Schedule Message": {
							"type": "object",
							"required": [
								"domain",
								"scheduleId",
								"userId"
							],
							"properties": {
								"domain": {
									"type": "string",
									"description": "Domain - Identifies the client application",
									"enum": [
										"ChangeManagement",
										"CLAMP",
										"POLO"
									]
								},
								"scheduleId": {
									"type": "string",
									"description": "Unique identifier of the schedule (UUID)"
								},
								"scheduleName": {
									"type": "string",
									"description": "User provided name of the scheduler, defaults to the scheduleId"
								},
								"userId": {
									"type": "string",
									"description": "Id of the user creating teh schedule"
								},
								"domainData": {
									"type": "array",
									"description": "Domain metadata - list of name/values ",
									"items": {
										"$ref": "#/definitions/DomainData"
									}
								},
								"globalRrule": {
									"type": "string",
									"description": "Global RRULE (RFC 5545) applied to all events in the schedule. Mutually exclusive of Event RRULE"
								},
								"scheduleInfo": {
									"type": "string"
								},
								"events": {
									"type": "array",
									"description": "Events provided by client or generated by optimizer.",
									"items": {
										"$ref": "#/definitions/Schedule Event Message"
									}
								}
							},
							"description": "Request for schedule creation"
						},
						"ScheduleApproval": {
							"type": "object",
							"properties": {
								"id": {
									"type": "integer",
									"format": "int64"
								},
								"approvalDateTime": {
									"type": "integer"
								},
								"status": {
									"type": "string"
								},
								"userId": {
									"type": "string"
								},
								"approvalType": {
									"$ref": "#/definitions/ApprovalType"
								}
							}
						},
						"ScheduleEventMessage": {
							"type": "object",
							"properties": {
								"eventText": {
									"type": "string"
								},
								"eventTime": {
									"type": "string"
								},
								"recurEndTime": {
									"type": "string"
								},
								"reminder": {
									"type": "integer",
									"format": "int64"
								},
								"status": {
									"type": "string"
								},
								"statusMessage": {
									"type": "string"
								},
								"rrule": {
									"type": "string"
								},
								"timeSensitive": {
									"type": "boolean"
								},
								"eventData": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventData"
									}
								},
								"eventsPending": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventsPending"
									}
								},
								"scheduleRequest": {
									"$ref": "#/definitions/Schedule"
								}
							}
						},
						"SchedulerRequestError": {
							"type": "object",
							"properties": {
								"requestError": {
									"$ref": "#/definitions/RequestError"
								}
							}
						}
					}
				},
			},
			"documentation": {
				"release": "Release: V1",
				"readme": "# soajs.test Test Express Service for Patch, Head, and others"
			}
		}
	},
	"soajs_2_3": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.dashboard",
				"tag": "3"
			},
			"soa": {
				"name": "dashboard",
				"group": "soajs",
				"subType": 'soajs',
				"profile" : {
					"test": "1"
				},
				"port": 4021,
				"version": "2",
				"description": "description is description",
				"extKeyRequired": true,
				"oauth": false,
				"urac": true,
				"urac_Profile": false,
				"requestTimeout": 30,
				"requestTimeoutRenewal": 5,
				"urac_ACL": false,
				"provision_ACL": false,
				"type": "service",
				"tags": ["tag1"],
				"program": ["program1"],
				"attributes": {
					"attrib": "1"
				},
				"tab": {
					"main" : "mainTab",
					"sub" : "subtab"
				},
				"interConnect": [{
					"name": "example2"
				}],
				"prerequisites": {
					"cpu": " ",
					"memory": " "
				},
				"documentation": {
					"readme": "README.md",
					"release": "RELEASE.md"
				},
				"swaggerFilename": "swagger.json",
				"maintenance": {
					"port": {
						"type": "inherit"
					},
					"readiness": "/heartbeat"
				}
			},
			"apiList": {
				"type": "swagger",
				"schema": {
					"swagger": "2.0",
					"info": {
						"version": "1908.0001",
						"title": "calendar"
					},
					"host": "",
					"basePath": "/calendar",
					"tags": [
						{
							"name": "calendar"
						}
					],
					"paths": {
						"/v1/domain": {
							"post": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Creates a domain",
								"operationId": "createDomain",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"in": "body",
										"name": "body",
										"description": "Domain to be added",
										"required": false,
										"schema": {
											"$ref": "#/definitions/Create Domain Message"
										}
									}
								],
								"responses": {
									"200": {
										"description": "OK"
									},
									"412": {
										"description": "Domain already exists.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/health": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Returns health status of server.",
								"operationId": "healthCheck",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "apiVersion",
										"in": "path",
										"description": "v1|v2",
										"required": true,
										"type": "string",
										"default": "v2"
									},
									{
										"name": "checkInterfaces",
										"in": "query",
										"description": "Check Interfaces",
										"required": false,
										"type": "array",
										"items": {
											"type": "boolean",
											"default": true
										},
										"collectionFormat": "multi"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"$ref": "#/definitions/Health Check Message"
										}
									},
									"400": {
										"description": "Not healthy",
										"schema": {
											"$ref": "#/definitions/Health Check Message"
										}
									}
								}
							}
						},
						"/v1/schedules": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Returns a list of Scheduler Requests based upon the filter criteria.",
								"operationId": "searchScheduleRequests",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "domain",
										"in": "query",
										"description": "Schedule domain.",
										"required": false,
										"type": "string"
									},
									{
										"name": "scheduleId",
										"in": "query",
										"description": "Schedule identifier",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "scheduleName",
										"in": "query",
										"description": "Schedule name",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "userId",
										"in": "query",
										"description": "Schedule User id of creator",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "status",
										"in": "query",
										"description": "Schedule status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "createDateTime",
										"in": "query",
										"description": "Creation date and time (yyyy-MM-dd'T'HH:mm:ssZ)",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "optimizerStatus",
										"in": "query",
										"description": "Optimizer status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "domainData",
										"in": "query",
										"description": "Domain data (Ex: name:value)",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "eventData",
										"in": "query",
										"description": "Event data (Ex : name:value)",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"type": "array",
											"items": {
												"$ref": "#/definitions/Schedule"
											}
										}
									},
									"400": {
										"description": "Invalid query scheduler details request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"404": {
										"description": "No records found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/schedules/scheduleDetails": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Returns a list of Scheduler details based upon the filter criteria.",
								"operationId": "searchScheduleRequestDetails",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "domain",
										"in": "query",
										"description": "Schedule domain.",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.scheduleId",
										"in": "query",
										"description": "Schedule identifier",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.scheduleName",
										"in": "query",
										"description": "Schedule name",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.userId",
										"in": "query",
										"description": "SCheduler creator User id of ",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.status",
										"in": "query",
										"description": "Schedule status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.createDateTime",
										"in": "query",
										"description": "Creation date and time (<low date>[,<hi date>])",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.optimizerStatus",
										"in": "query",
										"description": "Optimizer status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.approvalUserId",
										"in": "query",
										"description": "Request Approval user id",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.approvalStatus",
										"in": "query",
										"description": "Request Approval status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.approvalType",
										"in": "query",
										"description": "Request Approval type",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "startTime",
										"in": "query",
										"description": "Start time <low>,<high>",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "finishTime",
										"in": "query",
										"description": "Finish time <low>,<high>",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "maxSchedules",
										"in": "query",
										"description": "Maximum number of schedules to return",
										"required": false,
										"type": "integer",
										"format": "int32"
									},
									{
										"name": "lastScheduleId",
										"in": "query",
										"description": "Return schedules > lastScheduleId",
										"required": false,
										"type": "string"
									},
									{
										"name": "dd",
										"in": "query",
										"description": "Domain data name:Value dd=name:value",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "ed",
										"in": "query",
										"description": "Event data name:Value ed=name:value",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"type": "array",
											"items": {
												"$ref": "#/definitions/ScheduleEventMessage"
											}
										}
									},
									"400": {
										"description": "Invalid query scheduler details request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"404": {
										"description": "No records found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/schedules/{scheduleId}": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Retrieves a schedule request for scheduleId",
								"operationId": "getScheduleRequestInfo",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule info being retrieved.",
										"required": true,
										"type": "string"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"$ref": "#/definitions/Schedule"
										}
									},
									"404": {
										"description": "No record found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							},
							"post": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Creates a schedule request for scheduleId",
								"operationId": "createScheduleRequest",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule request being created.",
										"required": true,
										"type": "string"
									},
									{
										"in": "body",
										"name": "body",
										"description": "Data for creating a schedule request for the given schedule id",
										"required": false,
										"schema": {
											"$ref": "#/definitions/Schedule Message"
										}
									}
								],
								"responses": {
									"202": {
										"description": "Schedule request accepted."
									},
									"400": {
										"description": "Invalid schedule create request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"412": {
										"description": "Schedule request already exists for this schedule id.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							},
							"delete": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Deletes a schedule requests for scheduleId",
								"operationId": "deleteScheduleRequest",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule request being deleted.",
										"required": true,
										"type": "string"
									}
								],
								"responses": {
									"204": {
										"description": "Delete successful"
									},
									"404": {
										"description": "No record found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/schedules/{scheduleId}/approvals": {
							"post": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Adds an accept/reject approval status to the schedule request identified by scheduleId",
								"operationId": "approveScheduleRequest",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule request being accepted or rejected.",
										"required": true,
										"type": "string"
									},
									{
										"in": "body",
										"name": "body",
										"description": "Accept or reject approval message",
										"required": false,
										"schema": {
											"$ref": "#/definitions/ApprovalMessage"
										}
									}
								],
								"responses": {
									"200": {
										"description": "OK"
									},
									"400": {
										"description": "Invalid schedule approval/reject request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"404": {
										"description": "No record found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						}
					},
					"definitions": {
						"ApprovalMessage": {
							"type": "object",
							"required": [
								"approvalStatus",
								"approvalType",
								"approvalUserId"
							],
							"properties": {
								"approvalUserId": {
									"type": "string",
									"description": "User Id- ATTUID of the approving user"
								},
								"approvalStatus": {
									"type": "string",
									"description": "Approval status ",
									"enum": [
										"Accepted",
										"Rejected"
									]
								},
								"approvalType": {
									"type": "string",
									"description": "Approval Type",
									"enum": [
										"Tier 2"
									]
								}
							}
						},
						"ApprovalType": {
							"type": "object",
							"properties": {
								"id": {
									"type": "integer",
									"format": "int64"
								},
								"approvalCount": {
									"type": "integer",
									"format": "int32"
								},
								"approvalType": {
									"type": "string"
								},
								"domain": {
									"type": "string"
								},
								"scheduleApprovals": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/ScheduleApproval"
									}
								}
							}
						},
						"Create Domain Message": {
							"type": "object",
							"required": [
								"domain"
							],
							"properties": {
								"domain": {
									"type": "string",
									"description": "Domain name"
								}
							},
							"description": "Event definition for schedule creation"
						},
						"DomainData": {
							"type": "object",
							"properties": {
								"name": {
									"type": "string"
								},
								"value": {
									"type": "string"
								}
							}
						},
						"Event": {
							"type": "object",
							"properties": {
								"eventText": {
									"type": "string"
								},
								"eventTime": {
									"type": "string"
								},
								"recurEndTime": {
									"type": "string"
								},
								"reminder": {
									"type": "integer",
									"format": "int64"
								},
								"status": {
									"type": "string"
								},
								"statusMessage": {
									"type": "string"
								},
								"rrule": {
									"type": "string"
								},
								"timeSensitive": {
									"type": "boolean"
								},
								"eventData": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventData"
									}
								},
								"eventsPending": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventsPending"
									}
								}
							}
						},
						"EventData": {
							"type": "object",
							"properties": {
								"name": {
									"type": "string"
								},
								"value": {
									"type": "string"
								}
							}
						},
						"EventsPending": {
							"type": "object",
							"properties": {
								"id": {
									"type": "string"
								},
								"dispatchTime": {
									"type": "integer",
									"format": "int64"
								},
								"eventTime": {
									"type": "integer",
									"format": "int64"
								},
								"eventsId": {
									"type": "string"
								},
								"status": {
									"type": "string"
								},
								"eventTimeString": {
									"type": "string"
								},
								"dispatchTimeString": {
									"type": "string"
								}
							}
						},
						"Health Check Component": {
							"type": "object",
							"properties": {
								"name": {
									"type": "string",
									"description": "Componnent/interface name",
									"enum": [
										"Database",
										"DMaaPMR"
									]
								},
								"url": {
									"type": "string",
									"description": "URL representing component/interface"
								},
								"status": {
									"type": "string",
									"description": "'OK' or error status message"
								},
								"healthy": {
									"type": "boolean",
									"description": "Component health"
								}
							},
							"description": "Health of a single component of the instance"
						},
						"Health Check Message": {
							"type": "object",
							"properties": {
								"healthy": {
									"type": "boolean",
									"description": "Overall health of instance. false if even one component reports not healthy."
								},
								"buildInfo": {
									"type": "string",
									"description": "Build info (docker image name)"
								},
								"currentTime": {
									"type": "string",
									"description": "Current time on the instance."
								},
								"hostname": {
									"type": "string",
									"description": "Hostname (in k8s = pod name)"
								},
								"components": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/Health Check Component"
									}
								}
							},
							"description": "Returns status of calendar service instance"
						},
						"RequestError": {
							"type": "object",
							"properties": {
								"messageId": {
									"type": "string"
								},
								"text": {
									"type": "string"
								},
								"variables": {
									"type": "array",
									"items": {
										"type": "string"
									}
								}
							}
						},
						"Schedule": {
							"type": "object",
							"properties": {
								"id": {
									"type": "string"
								},
								"createDateTime": {
									"type": "string",
									"description": "Date/time of schedule creation"
								},
								"deleteDateTime": {
									"type": "string",
									"description": "Date/time of schedule deletion"
								},
								"globalRrule": {
									"type": "string",
									"description": "Global recurrence rule. Applies to all events unless a local RRULE is defined"
								},
								"globalRecurEndTime": {
									"type": "string",
									"description": "End time for global recurrance rule"
								},
								"optimizerDateTime": {
									"type": "string"
								},
								"optimizerReturnDateTime": {
									"type": "string"
								},
								"scheduleId": {
									"type": "string",
									"description": "Unique identifier of the schedule (UUID)"
								},
								"scheduleName": {
									"type": "string",
									"description": "User provided name for the schedule."
								},
								"status": {
									"type": "string",
									"description": "Status of the schedule.",
									"enum": [
										"PendingSchedule",
										"ScheduleFailed",
										"OptimizationInProgress",
										"PendingApproval",
										"OptimizationFailed",
										"Accepted",
										"Rejected",
										"Scheduled",
										"PublishingEvents",
										"PublishedEvents",
										"Completed",
										"CompletedWithError",
										"Deleted",
										"Cancelled"
									]
								},
								"userId": {
									"type": "string",
									"description": "ATTUID of the scheduler creator."
								},
								"domainData": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/DomainData"
									}
								},
								"events": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/Event"
									}
								},
								"scheduleApprovals": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/ScheduleApproval"
									}
								},
								"domain": {
									"type": "string"
								}
							}
						},
						"Schedule Event Message": {
							"type": "object",
							"required": [
								"eventJson",
								"eventTime"
							],
							"properties": {
								"eventJson": {
									"type": "object",
									"description": "Application provided JSON object which is pubvlished as eventData in the DMaaP event"
								},
								"eventTime": {
									"type": "string",
									"description": "Date/time of the event. (The first occurance in the case of a recurring event.)"
								},
								"recurEndTime": {
									"type": "string",
									"description": "Recurring events - date/time to end recurring event"
								},
								"reminder": {
									"type": "integer",
									"format": "int64",
									"description": "Reminder time, in seconds. Seconds subtracted from the event time to calculate actual publish time to account for the DMaaP latency."
								},
								"timeSensitive": {
									"type": "boolean",
									"description": "Time sensitive event.If true, Calendar will not publish event and update it to 'Past Due' if the event time has passed. Defaults to false which will not check for 'Past Due' events before publishing."
								},
								"rrule": {
									"type": "string",
									"description": "Event RRULE (RFC 5545) overrides the global RRULE in the schedule, if any"
								},
								"eventData": {
									"type": "array",
									"description": "Event metadata. These attributes may be used in query API and/or referenced in the eventText as ${eventdata.name}",
									"items": {
										"$ref": "#/definitions/EventData"
									}
								}
							},
							"description": "Event definition for schedule creation"
						},
						"Schedule Message": {
							"type": "object",
							"required": [
								"domain",
								"scheduleId",
								"userId"
							],
							"properties": {
								"domain": {
									"type": "string",
									"description": "Domain - Identifies the client application",
									"enum": [
										"ChangeManagement",
										"CLAMP",
										"POLO"
									]
								},
								"scheduleId": {
									"type": "string",
									"description": "Unique identifier of the schedule (UUID)"
								},
								"scheduleName": {
									"type": "string",
									"description": "User provided name of the scheduler, defaults to the scheduleId"
								},
								"userId": {
									"type": "string",
									"description": "Id of the user creating teh schedule"
								},
								"domainData": {
									"type": "array",
									"description": "Domain metadata - list of name/values ",
									"items": {
										"$ref": "#/definitions/DomainData"
									}
								},
								"globalRrule": {
									"type": "string",
									"description": "Global RRULE (RFC 5545) applied to all events in the schedule. Mutually exclusive of Event RRULE"
								},
								"scheduleInfo": {
									"type": "string"
								},
								"events": {
									"type": "array",
									"description": "Events provided by client or generated by optimizer.",
									"items": {
										"$ref": "#/definitions/Schedule Event Message"
									}
								}
							},
							"description": "Request for schedule creation"
						},
						"ScheduleApproval": {
							"type": "object",
							"properties": {
								"id": {
									"type": "integer",
									"format": "int64"
								},
								"approvalDateTime": {
									"type": "integer"
								},
								"status": {
									"type": "string"
								},
								"userId": {
									"type": "string"
								},
								"approvalType": {
									"$ref": "#/definitions/ApprovalType"
								}
							}
						},
						"ScheduleEventMessage": {
							"type": "object",
							"properties": {
								"eventText": {
									"type": "string"
								},
								"eventTime": {
									"type": "string"
								},
								"recurEndTime": {
									"type": "string"
								},
								"reminder": {
									"type": "integer",
									"format": "int64"
								},
								"status": {
									"type": "string"
								},
								"statusMessage": {
									"type": "string"
								},
								"rrule": {
									"type": "string"
								},
								"timeSensitive": {
									"type": "boolean"
								},
								"eventData": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventData"
									}
								},
								"eventsPending": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventsPending"
									}
								},
								"scheduleRequest": {
									"$ref": "#/definitions/Schedule"
								}
							}
						},
						"SchedulerRequestError": {
							"type": "object",
							"properties": {
								"requestError": {
									"$ref": "#/definitions/RequestError"
								}
							}
						}
					}
				},
			},
			"documentation": {
				"release": "Release: V1",
				"readme": "# soajs.test Test Express Service for Patch, Head, and others"
			}
		}
	}
};