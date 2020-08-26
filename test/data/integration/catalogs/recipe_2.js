'use strict';

let recipe = {
	_id: "5ea6a8b689c7700e41a6a429",
	name: "Nodejs test recipe",
	type: "service",
	subtype: "nodejs",
	description: "Deploy Node.js service",
	restriction: {
		deployment: [
			"container"
		]
	},
	recipe: {
		deployOptions: {
			image: {
				prefix: "test",
				name: "test",
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
				timeoutSeconds: 2,
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
			},
			cmd: {
				deploy: {
					command: [
						"bash"
					],
					args: [
						"-c",
						"node . -t"
					]
				}
			}
		}
	},
	v: 1,
	ts: 1595250459348
};

module.exports = recipe;