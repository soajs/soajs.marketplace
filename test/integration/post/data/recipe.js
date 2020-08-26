"use strict";

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */


module.exports = [
	{
		"catalog": {
			"name": "test recipe",
			"type": "api",
			"subtype": "test",
			"description": "description recipe",
			"recipe": {
				"deployOptions": {
					"image": {
						"prefix": "soajsorg",
						"name": "image",
						"tag": "latest",
						"pullPolicy": "Always",
						"repositoryType": "public",
						"override": false,
						"binary": false
					},
					"sourceCode": {
						"configuration": {
							"label": "test",
							"catalog": "",
							"version": "",
							"branch": "",
							"required": false
						}
					},
					"readinessProbe": {
						"httpGet": {
							"path": "/heartbeat",
							"port": "maintenance"
						},
						"initialDelaySeconds": 1,
						"timeoutSeconds": 2,
						"periodSeconds": 2,
						"successThreshold": 3,
						"failureThreshold": 0
					},
					"livenessProbe": {
						"httpGet": {"path": "", "port": ""},
						"initialDelaySeconds": 0,
						"timeoutSeconds": 0,
						"periodSeconds": 0,
						"successThreshold": 0,
						"failureThreshold": 0
					},
					"ports": [{
						"name": "http",
						"target": 80,
						"isPublished": true,
						"published": 31001,
						"preserveClientIP": true
					}],
					"voluming": [{
						"docker": {},
						"kubernetes": {
							"volume": {"name": "soajsprofile", "secret": {"secretName": "soajsprofile"}},
							"volumeMount": {"mountPath": "/opt/soajs/profile/", "name": "soajsprofile"}
						}
					}],
					"restartPolicy": {"condition": "", "maxAttempts": 5},
					"container": {"network": "", "workingDir": ""},
					"labels": {"test": "label"},
					"execCommands": {"list": "ls -la"}
				},
				"buildOptions": {
					"env": {
						"secret_key": {
							"type": "secret",
							"secret": "secret",
							"key": "key"},
						"user_input": {
							"type": "userInput",
							"label": "label",
							"default": "value",
							"fieldMsg": "message"
						}
					},
					"cmd":
						{
							"deploy":
								{
									"command": ["bash"],
									"args": ["-c", "node ."]
								}
						}
				}
			}
		}
	}
];