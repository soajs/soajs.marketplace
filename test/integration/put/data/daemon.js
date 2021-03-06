"use strict";

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

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
				"profile": {
					"test" : "1"
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
				"tags": ["tag1"],
				"program": ["program1"],
				"attributes": {
					"attrib": "1"
				},
				"tab": {
					"main" : "mainTab",
					"sub" : "subtab"
				},
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
				"profile": {
					"test" : "1"
				},
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
	},
	"daemon_2": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.hell",
				"tag": "1"
			},
			"soa": {
				"name": "hell",
				"group": "hell",
				"port": 6001,
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
				"tags": ["tag1"],
				"program": ["program1"],
				"attributes": {
					"attrib": "1"
				},
				"tab": {
					"main" : "mainTab",
					"sub" : "subtab"
				},
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
	"daemon_2_2": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.hell",
				"tag": "2"
			},
			"soa": {
				"name": "hell",
				"group": "hell",
				"port": 6001,
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
	"daemon_2_3": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.hell",
				"tag": "3"
			},
			"soa": {
				"name": "hell",
				"group": "hell",
				"port": 6001,
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