"use strict";

let validator = {
	"type": "object",
	"required": ["name", "type", "versions", "configuration"],
	"additionalProperties": false,
	"properties": {
		"name": {
			"type": "string",
		},
		"type": {
			"type": "string",
		},
		"configuration": {
			"type": "object",
			"additionalProperties": false,
			"properties": {
				"subType": {
					"type": "string"
				},
				"port": {
					"type": "integer"
				},
				"group": {
					"required": true,
					"type": "string"
				},
				"swagger": {
					"required": false,
					"type": "boolean"
				},
				"requestTimeout": {
					"required": false,
					"type": "integer"
				},
				"requestTimeoutRenewal": {
					"required": false,
					"type": "integer"
				},
				"maintenance": {
					"required": false,
					"additionalProperties": false,
					"properties": {
						"port": {
							"type": "object",
							"properties": {
								"type": {
									"type": "string",
								},
								"value": {
									"type": "integer",
								},
								"required": ["type"]
							}
						},
						"readiness": {
							"type": "string",
						},
						"commands": {
							"type": "array",
							"items": {
								"type": "object",
								"properties": {
									"label": {
										"type": "string",
									},
									"path": {
										"type": "string",
									},
									"icon": {
										"type": "string",
									}
								},
								"required": ["label", "path", "icon"]
							}
						},
						"required": ["readiness", "port"]
					}
				},
				"required": ["group", "port"]
			},
		},
		"description": {
			"required": true,
			"type": "string"
		},
		"metadata": {
			"type": "object",
			"required": false,
			"additionalProperties": false,
			"properties": {
				"tags": {
					"type": "array",
					"items": {
						"type": "string",
						"uniqueItems": true,
						"minItems": 1
					}
				},
				"program": {
					"type": "array",
					"items": {
						"type": "string",
						"uniqueItems": true,
						"minItems": 1
					}
				},
				"attributes": {
					"type": "object"
				}
			}
		},
		"src": {
			"type": "object",
			"required": false,
			"additionalProperties": false,
			"properties": {
				"provider": {
					"type": "string",
					"default": "manual",
					"enum": ["manual", "github", "bitbucket", "bitbucket_enterprise"]
				},
				"owner": {
					"type": "string"
				},
				"repo": {
					"type": "string"
				},
			}
		},
		"ui": {
			"type": "object",
			"additionalProperties": false,
			"properties": {
				"main": {
					"type": "string",
					"required": true,
					"maxLength": 20,
					"pattern": /^[a-zA-Z0-9_-]+$/
				},
				"sub": {
					"type": "string",
					"required": true,
					"maxLength": 20,
					"pattern": /^[a-zA-Z0-9_-]+$/
				}
			}
		},
		"versions": {
			"type": "array",
			"items": {
				"type": "object",
				"uniqueItems": true,
				"minItems": 1,
				"properties": {
					"version" :{
						"type": "string",
						"required": false
					},
					"extKeyRequired": {
						"type": "boolean",
					},
					"oauth": {
						"type": "boolean",
					},
					"urac": {
						"type": "boolean",
					},
					"urac_Profile": {
						"type": "boolean",
					},
					"urac_Config": {
						"type": "boolean",
					},
					"urac_GroupConfig": {
						"type": "boolean",
					},
					"urac_ACL": {
						"type": "boolean",
					},
					"tenant_Profile": {
						"type": "boolean",
					},
					"provision_ACL": {
						"type": "boolean",
					},
					"requestTimeout": {
						"type": "integer",
					},
					"branches": {
						"type": "array",
						"items": {
							"type": "string",
							"uniqueItems": true,
							"minItems": 1
						}
					},
					"tags": {
						"type": "array",
						"items": {
							"type": "string",
							"uniqueItems": true,
							"minItems": 1
						}
					},
					"swagger": {
						"type": "string",
						"required": false
					},
					"lastSync": {
						"type": "object",
						"properties": {
							"ts": {
								"type": "integer",
							},
							"tag" : {
								"type": "string",
							},
							"branch" : {
								"type": "string",
							}
						},
						"oneOf" : [
							{
								"required" : ["ts", "tag"]
							},
							{
								"required" : ["ts", "branch"]
							}
						]
					},
					"apis": {
						"type": "array",
						"items": {
							"type": "object",
							"uniqueItems": true,
							"minItems": 1,
							"properties": {
								"l": {
									"type": "string",
								},
								"v": {
									"type": "string",
								},
								"m": {
									"type": "string",
								},
								"group": {
									"type": "string",
								}
							},
							"required": ["l", "v", "m", "group"]
						}
					},
					"documentation": {
						"type": "object",
						"required": false,
						"properties": {
							"readme": {
								"type": "string",
								"required": false,
							},
							"release": {
								"type": "string",
								"required": false,
							}
							
						}
					},
				},
				"required": ["version", "lastSync"]
			}
		}
	}
};


module.exports = validator;