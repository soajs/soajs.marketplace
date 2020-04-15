"use strict";


module.exports = {
	"daemon_1": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.daemon",
				"branch": "master"
			},
			"soa": {
				"name": "daemon",
				"group": "daemon",
				"port": 5000,
				"version": "1",
				"description": "description is description",
				"subType": "cron",
				"jobs" : {
					"aggregator" :{}
				},
				"extKeyRequired": true,
				"oauth": false,
				"urac": true,
				"urac_Profile": false,
				"requestTimeout": 30,
				"requestTimeoutRenewal": 5,
				"urac_ACL": false,
				"provision_ACL": false,
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
			"documentation": {
				"release": "Release: V1",
				"readme": "# soajs.daemon daemon Express Service for Patch, Head, and others"
			}
		}
	},
	"daemon_1_2": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.daemon",
				"branch": "dev"
			},
			"soa": {
				"name": "daemon",
				"group": "daemon",
				"port": 5000,
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
				"subType": "cron",
				"jobs" : {
					"aggregator" :{}
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
			"documentation": {
				"release": "Release: V1",
				"readme": "# soajs.daemon daemon Express Service for Patch, Head, and others"
			}
		}
	},
	"daemon_1_3": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.daemon",
				"branch": "stg"
			},
			"soa": {
				"name": "daemon",
				"group": "daemon",
				"port": 5000,
				"version": "2",
				"description": "description is description",
				"subType": "cron",
				"jobs" : {
					"aggregator" :{}
				},
				"extKeyRequired": true,
				"oauth": false,
				"urac": true,
				"urac_Profile": false,
				"requestTimeout": 30,
				"requestTimeoutRenewal": 5,
				"urac_ACL": false,
				"provision_ACL": false,
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
			"documentation": {
				"release": "Release: V1",
				"readme": "# soajs.daemon daemon Express Service for Patch, Head, and others"
			}
		}
	}
};