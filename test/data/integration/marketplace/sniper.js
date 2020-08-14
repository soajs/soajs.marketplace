'use strict';
let lib = {
	"_id": "5f109af873264ee0d410bda3",
	"name": "sniper",
	"description": "sniper service for marketplace",
	"type": "service",
	"configuration": {
		"subType": "guns",
		"port": 4994,
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
				"branch": "master"
			},
			"branches": [
				"master"
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
					l: "get sniper",
					v: "/get",
					m: "get",
					group: "snipers"
				}
			],
			"documentation": {}
		},
		{
			"lastSync": {
				"ts": 1594923768085,
				"branch": "develop"
			},
			"branches": [
				"develop"
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
					l: "get snipers",
					v: "/get",
					m: "get",
					group: "snipers"
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
		repo: "soajs.sniper"
	}
};
module.exports = lib;
