/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

'use strict';

module.exports = {
	type: 'service',
	prerequisites: {
		cpu: '',
		memory: ''
	},
	"serviceVersion": 1,
	"serviceName": "marketplace",
	"serviceGroup": "SOAJS Core Services",
	"servicePort": 4007,
	"requestTimeout": 30,
	"requestTimeoutRenewal": 5,
	"oauth": true,
	"extKeyRequired": true,
	
	
	"errors": {
		400: "Business logic required data are missing",
		
		601: "Model not found",
		602: "Model error: ",
		
	},
	"schema": {
		
		"commonFields": {
			"keywords": {
				"source": ['query.keywords', 'body.keywords'],
				"required": true,
				"validation": {"type": "string"}
			},
			"start": {
				"required": false,
				"source": ["query.start", "body.start"],
				"default": 0,
				"validation": {
					"type": "integer",
					"min": 0
				}
			},
			"limit": {
				"required": false,
				"source": ["query.limit", "body.limit"],
				"default": 100,
				"validation": {
					"type": "integer",
					"max": 2000
				}
			}
		},
		
		"get": {
			'/soajs/items': {
				"_apiInfo": {
					"l": "List items matching certain keywords from soajs only",
					"group": "soajs",
					"groupMain": true
				},
				"commonFields": ["start", "limit"]
			},
			'/items': {
				"_apiInfo": {
					"l": "List items matching certain keywords with option to set from what type and subtype",
					"group": "soajs",
					"groupMain": true
				},
				"commonFields": ["start", "limit", "keywords"],
				"type": {
					"source": ['query.token'],
					"required": false,
					"validation": {"type": "string"}
				},
				"subtype": {
					"source": ['query.subtype'],
					"required": false,
					"validation": {"type": "string"}
				}
			}
		}
		
	}
};