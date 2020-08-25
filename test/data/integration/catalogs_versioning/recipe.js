'use strict';

let recipe_ver = {
	_id: "5f44de4b2d965eb8a10de30c",
	description: "Deploy Node.js service",
	name: "Controller",
	recipe: {
		deployOptions: {
			image: {
				prefix: "soajsorg",
				name: "gateway",
				tag: "latest",
				pullPolicy: "Always",
				repositoryType: "public",
				override: true,
				shell: "shell/bin/bash",
				binary: true
			},
			sourceCode: {},
			readinessProbe: {
				exec: {
					command: [
						"ls"
					]
				},
				initialDelaySeconds: 5,
				timeoutSeconds: 4,
				periodSeconds: 5,
				successThreshold: 1,
				failureThreshold: 4
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
				maxAttempts: 5
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
		},
		buildOptions: {
			env: {
				SOAJS_ENV: {
					type: "computed",
					value: "$SOAJS_ENV"
				},
				SOAJS_DEPLOY_HA: {
					type: "computed",
					value: "$SOAJS_DEPLOY_HA"
				},
				SOAJS_PROFILE: {
					type: "static",
					value: "/opt/soajs/profile/soajsprofile"
				},
				SOAJS_MONGO_CON_KEEPALIVE: {
					type: "static",
					value: "true"
				},
				SOAJS_EXTKEY: {
					type: "computed",
					value: "$SOAJS_EXTKEY"
				}
			},
			cmd: {
				deploy: {
					command: [
						"bash"
					],
					args: [
						"-c",
						"node ."
					]
				}
			}
		}
	},
	restriction: {
		deployment: [
			"container"
		]
	},
	subtype: "nodejs",
	ts: 1598348875902,
	type: "service",
	v: 1,
	refId: "5ef5a98e707a10af2f5d84c8"
};

module.exports = recipe_ver;