module.exports = {
	"source": ['body.catalog'],
	"required": true,
	"validation": {
		"type": "object",
		"additionalProperties": false,
		"properties": {
			"name": {"type": "string"},
			"locked": {"type": "boolean"},
			"active": {"type": "boolean"},
			"type": {"type": "string"},
			"subtype": {"type": "string"},
			"description": {"type": "string"},
			"restriction": {
				"type": "object",
				"properties": {
					"deployment": {"type": "array"},
					"driver": {"type": "array"},
					"infra": {"type": "array"}
				}
			},
			"recipe": {
				"type": "object",
				"additionalProperties": false,
				"properties": {
					"deployOptions": {
						"type": "object",
						"properties": {
							"namespace": {
								"type": "string"
							},
							"image": {
								"type": "object",
								"properties": {
									"prefix": {"type": "string"},
									"name": {"type": "string"},
									"tag": {"type": "string"},
									"override": {"type": "boolean"},
									"binary": {"type": "boolean"},
									"repositoryType": {
										"type": "string",
										"enum": ["private", "public"]
									},
									"pullPolicy": {"type": "string"},
									"shell": {"type": "string"},
								},
								"required": ["name", "tag"]
							},
							"sourceCode": {
								"type": "object",
								"properties": {
									"configuration": {
										"type": "object",
										"properties": {
											"label": {"type": "string"}
										},
										"required": ["label"]
									}
								}
							},
							"readinessProbe": {
								"type": ["object", "null"]
								//NOTE: removed validation for readinessProbe to allow free schema
							},
							"liveinessProbe": {
								"type": ["object", "null"]
								//NOTE: removed validation for readinessProbe to allow free schema
							},
							"ports": {
								"type": "array",
								"items": {
									"type": "object",
									"additionalProperties": false,
									"properties": {
										"name": {"type": "string"},
										"isPublished": {"type": "boolean"},
										"port": {"type": "number"},
										"target": {"type": "number"},
										"published": {"type": "number"},
										"preserveClientIP": {"type": "boolean"}
									},
									"required": ["name", "target"]
								}
							},
							"voluming": {
								"type": "array",
								"items": {
									"type": "object",
									"properties": {
										"docker": {
											"type": "object",
											"properties": {
												"volume": {
													"type": "object"
												}
											},
											"required": ["volume"]
										},
										"kubernetes": {
											"type": "object",
											"properties": {
												"volume": {
													"type": "object"
													
												},
												"volumeMount": {
													"type": "object"
												}
											},
											"required": ["volume", "volumeMount"]
										}
									}
								}
							},
							"labels": {
								"type": "object"
							},
							"execCommands": {
								"type": "object"
							},
							"serviceAccount": {
								"type": "object"
							},
							"securityContext": {
								"type": "object",
								"additionalProperties": false,
								"properties": {
									"pod": {
										"type": "object"
									},
									"container": {
										"type": "object"
									}
								}
							}
						}
					},
					"buildOptions": {
						"type": "object",
						"additionalProperties": false,
						"properties": {
							"settings": {
								"type": "object"
							},
							"env": {
								"type": "object",
								"additionalProperties": {
									"type": "object",
									"properties": {
										"type": {
											"type": "string",
											"enum": ["static", "userInput", "computed", "secret"]
										},
										"label": {"type": "string"},
										"fieldMsg": {"type": "string"},
										"default": {"type": "string"},
										"secret": {"type": "string"},
										"key": {"type": "string"}
									},
									"required": ["type"]
								}
							},
							"cmd": {
								"type": "object",
								"additionalProperties": false,
								"properties": {
									"deploy": {
										"type": "object",
										"additionalProperties": false,
										"properties": {
											"command": {"type": "array"},
											"args": {"type": "array"}
										},
										"required": ["command", "args"]
									}
								},
								"required": ["deploy"]
							}
						}
					}
				},
				"required": ["deployOptions"]
			}
		},
		"required": ["name", "type", "description", "recipe"]
	}
};