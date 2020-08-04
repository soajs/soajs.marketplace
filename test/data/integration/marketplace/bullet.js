'use strict';
let lib = {
	"_id": "5f109af873264ee0d410bda2",
	"name": "bullet",
	"description": "bullet service for marketplace",
	"type": "service",
	"configuration": {
		"subType": "guns",
		"port": 4993,
		"group": "Guns",
		"requestTimeout": 30,
		"requestTimeoutRenewal": 5,
		"maintenance": {
			"port": {
				"type": "maintenance"
			},
			"readiness": "/heartbeat"
		}
	},
	"versions": [
		{
			"lastSync": {
				"ts": 1594923768084,
				"tag": "1"
			},
			"tags": [
				"1"
			],
			"version": "1",
			"extKeyRequired": true,
			"oauth": true,
			"provision_ACL": false,
			"tenant_Profile": false,
			"urac": false,
			"urac_ACL": false,
			"urac_Config": false,
			"urac_GroupConfig": false,
			"urac_Profile": false,
			"apis": [
				{
					l: "get bullets",
					v: "/get",
					m: "get",
					group: "bullets"
				}
			],
			"documentation": {}
		},
		{
			"lastSync": {
				"ts": 1594923768085,
				"tag": "2"
			},
			"tags": [
				"2"
			],
			"version": "2",
			"extKeyRequired": true,
			"oauth": true,
			"provision_ACL": false,
			"tenant_Profile": false,
			"urac": false,
			"urac_ACL": false,
			"urac_Config": false,
			"urac_GroupConfig": false,
			"urac_Profile": false,
			"apis": [
				{
					l: "get bullets",
					v: "/get",
					m: "get",
					group: "bullets"
				}
			],
			"documentation": {}
		}
	],
	"metadata": {
		"tags": ["guns"],
		"program": ["marketplace"]
	},
	"ui": {
		"main": "Gateway",
		"sub": ""
	},
	"src": {
		provider: "github",
		owner: "RaghebAD",
		repo: "soajs.bullet"
	}
};
module.exports = lib;
