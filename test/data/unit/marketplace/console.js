'use strict';
let lib = {
	"_id": "5efdb1ffd7fe1767a37ba771",
	"type": "service",
	"name": "console",
	"configuration": {
		"subType": "soajs",
		"group": "Console",
		"port": 4009,
		"requestTimeout":30,
		"requestTimeoutRenewal": 5
	},
	"versions": [
		{
			"version": "1",
			"extKeyRequired": true,
			"urac": true,
			"urac_Profile": false,
			"urac_ACL": false,
			"urac_Config": false,
			"urac_GroupConfig": false,
			"tenant_Profile": false,
			"provision_ACL": false,
			"oauth": true,
			"interConnect": [
				{
					"name": "infra",
					"version": "1"
				}
			],
			"maintenance": {
				"readiness": "/heartbeat",
				"port": {
					"type": "maintenance"
				},
				"commands": [
					{
						"label": "Reload Registry",
						"path": "/reloadRegistry",
						"icon": "fas fa-undo"
					},
					{
						"label": "Resource Info",
						"path": "/resourceInfo",
						"icon": "fas fa-info"
					}
				]
			},
			"apis": [
				{
					"l": "This API returns all the ledger entries with the ability to filter entries by env, type and section",
					"v": "/ledger",
					"m": "get",
					"group": "Ledger"
				},
				{
					"l": "This API returns the environment(s).",
					"v": "/environment",
					"m": "get",
					"group": "Environment"
				},
				{
					"l": "This API returns the environment settings.",
					"v": "/environment/settings",
					"m": "get",
					"group": "Environment"
				},
				{
					"l": "This API returns the release information.",
					"v": "/release",
					"m": "get",
					"group": "Settings"
				},
				{
					"l": "This API gets a registry",
					"v": "/registry",
					"m": "get",
					"group": "Registry"
				},
				{
					"l": "This API gets the throttling configuration",
					"v": "/registry/throttling",
					"m": "get",
					"group": "Registry"
				},
				{
					"l": "This API gets all custom registry",
					"v": "/registry/custom",
					"m": "get",
					"group": "Registry"
				},
				{
					"l": "This API gets all resource configuration",
					"v": "/registry/resource",
					"m": "get",
					"group": "Registry"
				},
				{
					"l": "This API gets a registry deployer information",
					"v": "/registry/deployer",
					"m": "get",
					"group": "Registry"
				},
				{
					"l": "This API deletes an environment",
					"v": "/environment",
					"m": "delete",
					"group": "Environment"
				},
				{
					"l": "This API deletes the environment acl",
					"v": "/environment/acl",
					"m": "delete",
					"group": "Environment"
				},
				{
					"l": "This API deletes a custom DB",
					"v": "/registry/db/custom",
					"m": "delete",
					"group": "Registry"
				},
				{
					"l": "This API deletes the session DB",
					"v": "/registry/db/session",
					"m": "delete",
					"group": "Registry"
				},
				{
					"l": "This API deletes a custom registry",
					"v": "/registry/custom",
					"m": "delete",
					"group": "Registry"
				},
				{
					"l": "This API deletes the custom registry acl",
					"v": "/registry/custom/acl",
					"m": "delete",
					"group": "Account"
				},
				{
					"l": "This API deletes a resource configuration",
					"v": "/registry/resource",
					"m": "delete",
					"group": "Registry"
				},
				{
					"l": "This API deletes the resource configuration acl",
					"v": "/registry/resource/acl",
					"m": "delete",
					"group": "Account"
				},
				{
					"l": "This API adds an entry to the ledger of a specific type",
					"v": "/ledger",
					"m": "post",
					"group": "Ledger"
				},
				{
					"l": "This API adds an environment",
					"v": "/environment",
					"m": "post",
					"group": "Environment"
				},
				{
					"l": "This API adds a custom DB",
					"v": "/registry/db/custom",
					"m": "post",
					"group": "Registry"
				},
				{
					"l": "This API adds a custom registry",
					"v": "/registry/custom",
					"m": "post",
					"group": "Registry"
				},
				{
					"l": "This API adds a resource",
					"v": "/registry/resource",
					"m": "post",
					"group": "Registry"
				},
				{
					"l": "This API updates the environment acl",
					"v": "/environment/acl",
					"m": "put",
					"group": "Environment"
				},
				{
					"l": "This API updates the environment information",
					"v": "/environment",
					"m": "put",
					"group": "Environment"
				},
				{
					"l": "This API updates the registry db prefix",
					"v": "/registry/db/prefix",
					"m": "put",
					"group": "Registry"
				},
				{
					"l": "This API updates the registry db session",
					"v": "/registry/db/session",
					"m": "put",
					"group": "Registry"
				},
				{
					"l": "This API updates a registry",
					"v": "/registry",
					"m": "put",
					"group": "Registry"
				},
				{
					"l": "This API updates throttling",
					"v": "/registry/throttling",
					"m": "put",
					"group": "Registry"
				},
				{
					"l": "This API updates a custom registry",
					"v": "/registry/custom",
					"m": "put",
					"group": "Registry"
				},
				{
					"l": "This API updates the custom registry acl",
					"v": "/registry/custom/acl",
					"m": "put",
					"group": "Account"
				},
				{
					"l": "This API updates a resource configuration",
					"v": "/registry/resource",
					"m": "put",
					"group": "Registry"
				},
				{
					"l": "This API updates the resource configuration acl",
					"v": "/registry/resource/acl",
					"m": "put",
					"group": "Account"
				}
			]
		}
	],
	"description": "This service takes care of updates and upgrades as well as everything related to registry"
};
module.exports = lib;
