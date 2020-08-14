"use strict";

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const helper = require("../../../helper.js");
const service = helper.requireModule('./driver/service/index.js');
const utils = helper.requireModule('./utils/index.js');
const assert = require('assert');
const sinon = require("sinon");

describe("Unit test for: driver/service/index.js - createCatalog", function () {
	afterEach((done) => {
		sinon.restore();
		done();
	});
	
	it("call createCatalog - success branch", function (done) {
		sinon.stub(utils, 'generateSchemas').callsFake(function fakeFn(data, cb) {
			return cb();
		});
		let data = {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.test",
				"branch": "dev"
			},
			"soa": {
				"name": "micro1",
				"group": "Example",
				"subType": "lion",
				"port": 4991,
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
				"interConnect": [{
					"name": "example2"
				}],
				"tab": {
					"main": "main",
					"sub" : "sub"
				},
				"tags": ["tag1"],
				"program": ["program1"],
				"attributes": {
					"attrib": "1"
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
				},
				"profile": {"info": "stuff"}
			},
			"apiList" :{
				"type": "swagger",
				"schema": {
					"swagger": "2.0",
					"info": {
						"version": "1908.0001",
						"title": "calendar"
					},
					"host": "",
					"basePath": "/calendar",
					"tags": [
						{
							"name": "calendar"
						}
					],
					"paths": {
						"/v1/domain": {
							"post": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Creates a domain",
								"operationId": "createDomain",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"in": "body",
										"name": "body",
										"description": "Domain to be added",
										"required": false,
										"schema": {
											"$ref": "#/definitions/Create Domain Message"
										}
									}
								],
								"responses": {
									"200": {
										"description": "OK"
									},
									"412": {
										"description": "Domain already exists.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/health": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Returns health status of server.",
								"operationId": "healthCheck",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "apiVersion",
										"in": "path",
										"description": "v1|v2",
										"required": true,
										"type": "string",
										"default": "v2"
									},
									{
										"name": "checkInterfaces",
										"in": "query",
										"description": "Check Interfaces",
										"required": false,
										"type": "array",
										"items": {
											"type": "boolean",
											"default": true
										},
										"collectionFormat": "multi"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"$ref": "#/definitions/Health Check Message"
										}
									},
									"400": {
										"description": "Not healthy",
										"schema": {
											"$ref": "#/definitions/Health Check Message"
										}
									}
								}
							}
						},
						"/v1/schedules": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Returns a list of Scheduler Requests based upon the filter criteria.",
								"operationId": "searchScheduleRequests",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "domain",
										"in": "query",
										"description": "Schedule domain.",
										"required": false,
										"type": "string"
									},
									{
										"name": "scheduleId",
										"in": "query",
										"description": "Schedule identifier",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "scheduleName",
										"in": "query",
										"description": "Schedule name",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "userId",
										"in": "query",
										"description": "Schedule User id of creator",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "status",
										"in": "query",
										"description": "Schedule status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "createDateTime",
										"in": "query",
										"description": "Creation date and time (yyyy-MM-dd'T'HH:mm:ssZ)",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "optimizerStatus",
										"in": "query",
										"description": "Optimizer status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "domainData",
										"in": "query",
										"description": "Domain data (Ex: name:value)",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "eventData",
										"in": "query",
										"description": "Event data (Ex : name:value)",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"type": "array",
											"items": {
												"$ref": "#/definitions/Schedule"
											}
										}
									},
									"400": {
										"description": "Invalid query scheduler details request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"404": {
										"description": "No records found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/schedules/scheduleDetails": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Returns a list of Scheduler details based upon the filter criteria.",
								"operationId": "searchScheduleRequestDetails",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "domain",
										"in": "query",
										"description": "Schedule domain.",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.scheduleId",
										"in": "query",
										"description": "Schedule identifier",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.scheduleName",
										"in": "query",
										"description": "Schedule name",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.userId",
										"in": "query",
										"description": "SCheduler creator User id of ",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.status",
										"in": "query",
										"description": "Schedule status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.createDateTime",
										"in": "query",
										"description": "Creation date and time (<low date>[,<hi date>])",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.optimizerStatus",
										"in": "query",
										"description": "Optimizer status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.approvalUserId",
										"in": "query",
										"description": "Request Approval user id",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.approvalStatus",
										"in": "query",
										"description": "Request Approval status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.approvalType",
										"in": "query",
										"description": "Request Approval type",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "startTime",
										"in": "query",
										"description": "Start time <low>,<high>",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "finishTime",
										"in": "query",
										"description": "Finish time <low>,<high>",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "maxSchedules",
										"in": "query",
										"description": "Maximum number of schedules to return",
										"required": false,
										"type": "integer",
										"format": "int32"
									},
									{
										"name": "lastScheduleId",
										"in": "query",
										"description": "Return schedules > lastScheduleId",
										"required": false,
										"type": "string"
									},
									{
										"name": "dd",
										"in": "query",
										"description": "Domain data name:Value dd=name:value",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "ed",
										"in": "query",
										"description": "Event data name:Value ed=name:value",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"type": "array",
											"items": {
												"$ref": "#/definitions/ScheduleEventMessage"
											}
										}
									},
									"400": {
										"description": "Invalid query scheduler details request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"404": {
										"description": "No records found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/schedules/{scheduleId}": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Retrieves a schedule request for scheduleId",
								"operationId": "getScheduleRequestInfo",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule info being retrieved.",
										"required": true,
										"type": "string"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"$ref": "#/definitions/Schedule"
										}
									},
									"404": {
										"description": "No record found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							},
							"post": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Creates a schedule request for scheduleId",
								"operationId": "createScheduleRequest",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule request being created.",
										"required": true,
										"type": "string"
									},
									{
										"in": "body",
										"name": "body",
										"description": "Data for creating a schedule request for the given schedule id",
										"required": false,
										"schema": {
											"$ref": "#/definitions/Schedule Message"
										}
									}
								],
								"responses": {
									"202": {
										"description": "Schedule request accepted."
									},
									"400": {
										"description": "Invalid schedule create request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"412": {
										"description": "Schedule request already exists for this schedule id.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							},
							"delete": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Deletes a schedule requests for scheduleId",
								"operationId": "deleteScheduleRequest",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule request being deleted.",
										"required": true,
										"type": "string"
									}
								],
								"responses": {
									"204": {
										"description": "Delete successful"
									},
									"404": {
										"description": "No record found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/schedules/{scheduleId}/approvals": {
							"post": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Adds an accept/reject approval status to the schedule request identified by scheduleId",
								"operationId": "approveScheduleRequest",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule request being accepted or rejected.",
										"required": true,
										"type": "string"
									},
									{
										"in": "body",
										"name": "body",
										"description": "Accept or reject approval message",
										"required": false,
										"schema": {
											"$ref": "#/definitions/ApprovalMessage"
										}
									}
								],
								"responses": {
									"200": {
										"description": "OK"
									},
									"400": {
										"description": "Invalid schedule approval/reject request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"404": {
										"description": "No record found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						}
					},
					"definitions": {
						"ApprovalMessage": {
							"type": "object",
							"required": [
								"approvalStatus",
								"approvalType",
								"approvalUserId"
							],
							"properties": {
								"approvalUserId": {
									"type": "string",
									"description": "User Id- ATTUID of the approving user"
								},
								"approvalStatus": {
									"type": "string",
									"description": "Approval status ",
									"enum": [
										"Accepted",
										"Rejected"
									]
								},
								"approvalType": {
									"type": "string",
									"description": "Approval Type",
									"enum": [
										"Tier 2"
									]
								}
							}
						},
						"ApprovalType": {
							"type": "object",
							"properties": {
								"id": {
									"type": "integer",
									"format": "int64"
								},
								"approvalCount": {
									"type": "integer",
									"format": "int32"
								},
								"approvalType": {
									"type": "string"
								},
								"domain": {
									"type": "string"
								},
								"scheduleApprovals": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/ScheduleApproval"
									}
								}
							}
						},
						"Create Domain Message": {
							"type": "object",
							"required": [
								"domain"
							],
							"properties": {
								"domain": {
									"type": "string",
									"description": "Domain name"
								}
							},
							"description": "Event definition for schedule creation"
						},
						"DomainData": {
							"type": "object",
							"properties": {
								"name": {
									"type": "string"
								},
								"value": {
									"type": "string"
								}
							}
						},
						"Event": {
							"type": "object",
							"properties": {
								"eventText": {
									"type": "string"
								},
								"eventTime": {
									"type": "string"
								},
								"recurEndTime": {
									"type": "string"
								},
								"reminder": {
									"type": "integer",
									"format": "int64"
								},
								"status": {
									"type": "string"
								},
								"statusMessage": {
									"type": "string"
								},
								"rrule": {
									"type": "string"
								},
								"timeSensitive": {
									"type": "boolean"
								},
								"eventData": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventData"
									}
								},
								"eventsPending": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventsPending"
									}
								}
							}
						},
						"EventData": {
							"type": "object",
							"properties": {
								"name": {
									"type": "string"
								},
								"value": {
									"type": "string"
								}
							}
						},
						"EventsPending": {
							"type": "object",
							"properties": {
								"id": {
									"type": "string"
								},
								"dispatchTime": {
									"type": "integer",
									"format": "int64"
								},
								"eventTime": {
									"type": "integer",
									"format": "int64"
								},
								"eventsId": {
									"type": "string"
								},
								"status": {
									"type": "string"
								},
								"eventTimeString": {
									"type": "string"
								},
								"dispatchTimeString": {
									"type": "string"
								}
							}
						},
						"Health Check Component": {
							"type": "object",
							"properties": {
								"name": {
									"type": "string",
									"description": "Componnent/interface name",
									"enum": [
										"Database",
										"DMaaPMR"
									]
								},
								"url": {
									"type": "string",
									"description": "URL representing component/interface"
								},
								"status": {
									"type": "string",
									"description": "'OK' or error status message"
								},
								"healthy": {
									"type": "boolean",
									"description": "Component health"
								}
							},
							"description": "Health of a single component of the instance"
						},
						"Health Check Message": {
							"type": "object",
							"properties": {
								"healthy": {
									"type": "boolean",
									"description": "Overall health of instance. false if even one component reports not healthy."
								},
								"buildInfo": {
									"type": "string",
									"description": "Build info (docker image name)"
								},
								"currentTime": {
									"type": "string",
									"description": "Current time on the instance."
								},
								"hostname": {
									"type": "string",
									"description": "Hostname (in k8s = pod name)"
								},
								"components": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/Health Check Component"
									}
								}
							},
							"description": "Returns status of calendar service instance"
						},
						"RequestError": {
							"type": "object",
							"properties": {
								"messageId": {
									"type": "string"
								},
								"text": {
									"type": "string"
								},
								"variables": {
									"type": "array",
									"items": {
										"type": "string"
									}
								}
							}
						},
						"Schedule": {
							"type": "object",
							"properties": {
								"id": {
									"type": "string"
								},
								"createDateTime": {
									"type": "string",
									"description": "Date/time of schedule creation"
								},
								"deleteDateTime": {
									"type": "string",
									"description": "Date/time of schedule deletion"
								},
								"globalRrule": {
									"type": "string",
									"description": "Global recurrence rule. Applies to all events unless a local RRULE is defined"
								},
								"globalRecurEndTime": {
									"type": "string",
									"description": "End time for global recurrance rule"
								},
								"optimizerDateTime": {
									"type": "string"
								},
								"optimizerReturnDateTime": {
									"type": "string"
								},
								"scheduleId": {
									"type": "string",
									"description": "Unique identifier of the schedule (UUID)"
								},
								"scheduleName": {
									"type": "string",
									"description": "User provided name for the schedule."
								},
								"status": {
									"type": "string",
									"description": "Status of the schedule.",
									"enum": [
										"PendingSchedule",
										"ScheduleFailed",
										"OptimizationInProgress",
										"PendingApproval",
										"OptimizationFailed",
										"Accepted",
										"Rejected",
										"Scheduled",
										"PublishingEvents",
										"PublishedEvents",
										"Completed",
										"CompletedWithError",
										"Deleted",
										"Cancelled"
									]
								},
								"userId": {
									"type": "string",
									"description": "ATTUID of the scheduler creator."
								},
								"domainData": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/DomainData"
									}
								},
								"events": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/Event"
									}
								},
								"scheduleApprovals": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/ScheduleApproval"
									}
								},
								"domain": {
									"type": "string"
								}
							}
						},
						"Schedule Event Message": {
							"type": "object",
							"required": [
								"eventJson",
								"eventTime"
							],
							"properties": {
								"eventJson": {
									"type": "object",
									"description": "Application provided JSON object which is pubvlished as eventData in the DMaaP event"
								},
								"eventTime": {
									"type": "string",
									"description": "Date/time of the event. (The first occurance in the case of a recurring event.)"
								},
								"recurEndTime": {
									"type": "string",
									"description": "Recurring events - date/time to end recurring event"
								},
								"reminder": {
									"type": "integer",
									"format": "int64",
									"description": "Reminder time, in seconds. Seconds subtracted from the event time to calculate actual publish time to account for the DMaaP latency."
								},
								"timeSensitive": {
									"type": "boolean",
									"description": "Time sensitive event.If true, Calendar will not publish event and update it to 'Past Due' if the event time has passed. Defaults to false which will not check for 'Past Due' events before publishing."
								},
								"rrule": {
									"type": "string",
									"description": "Event RRULE (RFC 5545) overrides the global RRULE in the schedule, if any"
								},
								"eventData": {
									"type": "array",
									"description": "Event metadata. These attributes may be used in query API and/or referenced in the eventText as ${eventdata.name}",
									"items": {
										"$ref": "#/definitions/EventData"
									}
								}
							},
							"description": "Event definition for schedule creation"
						},
						"Schedule Message": {
							"type": "object",
							"required": [
								"domain",
								"scheduleId",
								"userId"
							],
							"properties": {
								"domain": {
									"type": "string",
									"description": "Domain - Identifies the client application",
									"enum": [
										"ChangeManagement",
										"CLAMP",
										"POLO"
									]
								},
								"scheduleId": {
									"type": "string",
									"description": "Unique identifier of the schedule (UUID)"
								},
								"scheduleName": {
									"type": "string",
									"description": "User provided name of the scheduler, defaults to the scheduleId"
								},
								"userId": {
									"type": "string",
									"description": "Id of the user creating teh schedule"
								},
								"domainData": {
									"type": "array",
									"description": "Domain metadata - list of name/values ",
									"items": {
										"$ref": "#/definitions/DomainData"
									}
								},
								"globalRrule": {
									"type": "string",
									"description": "Global RRULE (RFC 5545) applied to all events in the schedule. Mutually exclusive of Event RRULE"
								},
								"scheduleInfo": {
									"type": "string"
								},
								"events": {
									"type": "array",
									"description": "Events provided by client or generated by optimizer.",
									"items": {
										"$ref": "#/definitions/Schedule Event Message"
									}
								}
							},
							"description": "Request for schedule creation"
						},
						"ScheduleApproval": {
							"type": "object",
							"properties": {
								"id": {
									"type": "integer",
									"format": "int64"
								},
								"approvalDateTime": {
									"type": "integer"
								},
								"status": {
									"type": "string"
								},
								"userId": {
									"type": "string"
								},
								"approvalType": {
									"$ref": "#/definitions/ApprovalType"
								}
							}
						},
						"ScheduleEventMessage": {
							"type": "object",
							"properties": {
								"eventText": {
									"type": "string"
								},
								"eventTime": {
									"type": "string"
								},
								"recurEndTime": {
									"type": "string"
								},
								"reminder": {
									"type": "integer",
									"format": "int64"
								},
								"status": {
									"type": "string"
								},
								"statusMessage": {
									"type": "string"
								},
								"rrule": {
									"type": "string"
								},
								"timeSensitive": {
									"type": "boolean"
								},
								"eventData": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventData"
									}
								},
								"eventsPending": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventsPending"
									}
								},
								"scheduleRequest": {
									"$ref": "#/definitions/Schedule"
								}
							}
						},
						"SchedulerRequestError": {
							"type": "object",
							"properties": {
								"requestError": {
									"$ref": "#/definitions/RequestError"
								}
							}
						}
					}
				},
			},
			"documentation": {
				"release": "Release: V1",
				"readme": "# soajs.test Test Express Service for Patch, Head, and others"
			}
		};
		service.createCatalog(data, (response) => {
			assert.ok(response);
			done();
		});
	});
	
	it("call createCatalog - success old catalog different version branch", function (done) {
		sinon.stub(utils, 'generateSchemas').callsFake(function fakeFn(data, cb) {
			return cb();
		});
		let data = {
			"oldCatalog": {
				type: "micro1",
				name: "marketplace",
				configuration: {
					subType: "lion",
					group: "Example",
					port:4991,
					requestTimeout:30,
					requestTimeoutRenewal: 5
				},
				versions: [
					{
						version: "1",
						"branches": ["dev", "master"],
						extKeyRequired: true,
						urac: true,
						urac_Profile: false,
						urac_ACL: false,
						urac_Config: false,
						urac_GroupConfig: false,
						tenant_Profile: false,
						provision_ACL: false,
						oauth: true,
						interConnect: [
							{
								name: "dashboard",
								version: "1"
							},
							{
								name: "infra",
								version: "1"
							},
							{
								name: "repository",
								version: "1"
							},
							{
								name: "console",
								version: "1"
							},
							{
								name: "multitenant",
								version: "1"
							}
						],
						maintenance: {
							readiness: "/heartbeat",
							port: {
								type: "maintenance"
							},
							commands: [
								{
									label: "Reload Registry",
									path: "/reloadRegistry",
									icon: "fas fa-undo"
								},
								{
									label: "Resource Info",
									path: "/resourceInfo",
									icon: "fas fa-info"
								}
							]
						},
						apis: [
							{
								l: "This API lists the items matching certain keywords from soajs catalog only.",
								v: "/soajs/items",
								m: "get",
								group: "SOAJS"
							}
						]
					}
				],
				description: "loliod",
			},
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.test",
				"branch": "dev"
			},
			"soa": {
				"name": "micro1",
				"group": "Example",
				"subType": "lion",
				"port": 4991,
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
				"interConnect": [{
					"name": "example2"
				}],
				"tab": {
					"main": "main",
					"sub" : "sub"
				},
				"tags": ["tag1"],
				"program": ["program1"],
				"attributes": {
					"attrib": "1"
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
				},
				"profile": {"info": "stuff"}
			},
			"apiList" :{
				"type": "swagger",
				"schema": {
					"swagger": "2.0",
					"info": {
						"version": "1908.0001",
						"title": "calendar"
					},
					"host": "",
					"basePath": "/calendar",
					"tags": [
						{
							"name": "calendar"
						}
					],
					"paths": {
						"/v1/domain": {
							"post": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Creates a domain",
								"operationId": "createDomain",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"in": "body",
										"name": "body",
										"description": "Domain to be added",
										"required": false,
										"schema": {
											"$ref": "#/definitions/Create Domain Message"
										}
									}
								],
								"responses": {
									"200": {
										"description": "OK"
									},
									"412": {
										"description": "Domain already exists.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/health": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Returns health status of server.",
								"operationId": "healthCheck",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "apiVersion",
										"in": "path",
										"description": "v1|v2",
										"required": true,
										"type": "string",
										"default": "v2"
									},
									{
										"name": "checkInterfaces",
										"in": "query",
										"description": "Check Interfaces",
										"required": false,
										"type": "array",
										"items": {
											"type": "boolean",
											"default": true
										},
										"collectionFormat": "multi"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"$ref": "#/definitions/Health Check Message"
										}
									},
									"400": {
										"description": "Not healthy",
										"schema": {
											"$ref": "#/definitions/Health Check Message"
										}
									}
								}
							}
						},
						"/v1/schedules": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Returns a list of Scheduler Requests based upon the filter criteria.",
								"operationId": "searchScheduleRequests",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "domain",
										"in": "query",
										"description": "Schedule domain.",
										"required": false,
										"type": "string"
									},
									{
										"name": "scheduleId",
										"in": "query",
										"description": "Schedule identifier",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "scheduleName",
										"in": "query",
										"description": "Schedule name",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "userId",
										"in": "query",
										"description": "Schedule User id of creator",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "status",
										"in": "query",
										"description": "Schedule status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "createDateTime",
										"in": "query",
										"description": "Creation date and time (yyyy-MM-dd'T'HH:mm:ssZ)",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "optimizerStatus",
										"in": "query",
										"description": "Optimizer status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "domainData",
										"in": "query",
										"description": "Domain data (Ex: name:value)",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "eventData",
										"in": "query",
										"description": "Event data (Ex : name:value)",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"type": "array",
											"items": {
												"$ref": "#/definitions/Schedule"
											}
										}
									},
									"400": {
										"description": "Invalid query scheduler details request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"404": {
										"description": "No records found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/schedules/scheduleDetails": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Returns a list of Scheduler details based upon the filter criteria.",
								"operationId": "searchScheduleRequestDetails",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "domain",
										"in": "query",
										"description": "Schedule domain.",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.scheduleId",
										"in": "query",
										"description": "Schedule identifier",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.scheduleName",
										"in": "query",
										"description": "Schedule name",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.userId",
										"in": "query",
										"description": "SCheduler creator User id of ",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.status",
										"in": "query",
										"description": "Schedule status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.createDateTime",
										"in": "query",
										"description": "Creation date and time (<low date>[,<hi date>])",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.optimizerStatus",
										"in": "query",
										"description": "Optimizer status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.approvalUserId",
										"in": "query",
										"description": "Request Approval user id",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.approvalStatus",
										"in": "query",
										"description": "Request Approval status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.approvalType",
										"in": "query",
										"description": "Request Approval type",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "startTime",
										"in": "query",
										"description": "Start time <low>,<high>",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "finishTime",
										"in": "query",
										"description": "Finish time <low>,<high>",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "maxSchedules",
										"in": "query",
										"description": "Maximum number of schedules to return",
										"required": false,
										"type": "integer",
										"format": "int32"
									},
									{
										"name": "lastScheduleId",
										"in": "query",
										"description": "Return schedules > lastScheduleId",
										"required": false,
										"type": "string"
									},
									{
										"name": "dd",
										"in": "query",
										"description": "Domain data name:Value dd=name:value",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "ed",
										"in": "query",
										"description": "Event data name:Value ed=name:value",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"type": "array",
											"items": {
												"$ref": "#/definitions/ScheduleEventMessage"
											}
										}
									},
									"400": {
										"description": "Invalid query scheduler details request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"404": {
										"description": "No records found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/schedules/{scheduleId}": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Retrieves a schedule request for scheduleId",
								"operationId": "getScheduleRequestInfo",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule info being retrieved.",
										"required": true,
										"type": "string"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"$ref": "#/definitions/Schedule"
										}
									},
									"404": {
										"description": "No record found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							},
							"post": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Creates a schedule request for scheduleId",
								"operationId": "createScheduleRequest",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule request being created.",
										"required": true,
										"type": "string"
									},
									{
										"in": "body",
										"name": "body",
										"description": "Data for creating a schedule request for the given schedule id",
										"required": false,
										"schema": {
											"$ref": "#/definitions/Schedule Message"
										}
									}
								],
								"responses": {
									"202": {
										"description": "Schedule request accepted."
									},
									"400": {
										"description": "Invalid schedule create request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"412": {
										"description": "Schedule request already exists for this schedule id.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							},
							"delete": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Deletes a schedule requests for scheduleId",
								"operationId": "deleteScheduleRequest",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule request being deleted.",
										"required": true,
										"type": "string"
									}
								],
								"responses": {
									"204": {
										"description": "Delete successful"
									},
									"404": {
										"description": "No record found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/schedules/{scheduleId}/approvals": {
							"post": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Adds an accept/reject approval status to the schedule request identified by scheduleId",
								"operationId": "approveScheduleRequest",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule request being accepted or rejected.",
										"required": true,
										"type": "string"
									},
									{
										"in": "body",
										"name": "body",
										"description": "Accept or reject approval message",
										"required": false,
										"schema": {
											"$ref": "#/definitions/ApprovalMessage"
										}
									}
								],
								"responses": {
									"200": {
										"description": "OK"
									},
									"400": {
										"description": "Invalid schedule approval/reject request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"404": {
										"description": "No record found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						}
					},
					"definitions": {
						"ApprovalMessage": {
							"type": "object",
							"required": [
								"approvalStatus",
								"approvalType",
								"approvalUserId"
							],
							"properties": {
								"approvalUserId": {
									"type": "string",
									"description": "User Id- ATTUID of the approving user"
								},
								"approvalStatus": {
									"type": "string",
									"description": "Approval status ",
									"enum": [
										"Accepted",
										"Rejected"
									]
								},
								"approvalType": {
									"type": "string",
									"description": "Approval Type",
									"enum": [
										"Tier 2"
									]
								}
							}
						},
						"ApprovalType": {
							"type": "object",
							"properties": {
								"id": {
									"type": "integer",
									"format": "int64"
								},
								"approvalCount": {
									"type": "integer",
									"format": "int32"
								},
								"approvalType": {
									"type": "string"
								},
								"domain": {
									"type": "string"
								},
								"scheduleApprovals": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/ScheduleApproval"
									}
								}
							}
						},
						"Create Domain Message": {
							"type": "object",
							"required": [
								"domain"
							],
							"properties": {
								"domain": {
									"type": "string",
									"description": "Domain name"
								}
							},
							"description": "Event definition for schedule creation"
						},
						"DomainData": {
							"type": "object",
							"properties": {
								"name": {
									"type": "string"
								},
								"value": {
									"type": "string"
								}
							}
						},
						"Event": {
							"type": "object",
							"properties": {
								"eventText": {
									"type": "string"
								},
								"eventTime": {
									"type": "string"
								},
								"recurEndTime": {
									"type": "string"
								},
								"reminder": {
									"type": "integer",
									"format": "int64"
								},
								"status": {
									"type": "string"
								},
								"statusMessage": {
									"type": "string"
								},
								"rrule": {
									"type": "string"
								},
								"timeSensitive": {
									"type": "boolean"
								},
								"eventData": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventData"
									}
								},
								"eventsPending": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventsPending"
									}
								}
							}
						},
						"EventData": {
							"type": "object",
							"properties": {
								"name": {
									"type": "string"
								},
								"value": {
									"type": "string"
								}
							}
						},
						"EventsPending": {
							"type": "object",
							"properties": {
								"id": {
									"type": "string"
								},
								"dispatchTime": {
									"type": "integer",
									"format": "int64"
								},
								"eventTime": {
									"type": "integer",
									"format": "int64"
								},
								"eventsId": {
									"type": "string"
								},
								"status": {
									"type": "string"
								},
								"eventTimeString": {
									"type": "string"
								},
								"dispatchTimeString": {
									"type": "string"
								}
							}
						},
						"Health Check Component": {
							"type": "object",
							"properties": {
								"name": {
									"type": "string",
									"description": "Componnent/interface name",
									"enum": [
										"Database",
										"DMaaPMR"
									]
								},
								"url": {
									"type": "string",
									"description": "URL representing component/interface"
								},
								"status": {
									"type": "string",
									"description": "'OK' or error status message"
								},
								"healthy": {
									"type": "boolean",
									"description": "Component health"
								}
							},
							"description": "Health of a single component of the instance"
						},
						"Health Check Message": {
							"type": "object",
							"properties": {
								"healthy": {
									"type": "boolean",
									"description": "Overall health of instance. false if even one component reports not healthy."
								},
								"buildInfo": {
									"type": "string",
									"description": "Build info (docker image name)"
								},
								"currentTime": {
									"type": "string",
									"description": "Current time on the instance."
								},
								"hostname": {
									"type": "string",
									"description": "Hostname (in k8s = pod name)"
								},
								"components": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/Health Check Component"
									}
								}
							},
							"description": "Returns status of calendar service instance"
						},
						"RequestError": {
							"type": "object",
							"properties": {
								"messageId": {
									"type": "string"
								},
								"text": {
									"type": "string"
								},
								"variables": {
									"type": "array",
									"items": {
										"type": "string"
									}
								}
							}
						},
						"Schedule": {
							"type": "object",
							"properties": {
								"id": {
									"type": "string"
								},
								"createDateTime": {
									"type": "string",
									"description": "Date/time of schedule creation"
								},
								"deleteDateTime": {
									"type": "string",
									"description": "Date/time of schedule deletion"
								},
								"globalRrule": {
									"type": "string",
									"description": "Global recurrence rule. Applies to all events unless a local RRULE is defined"
								},
								"globalRecurEndTime": {
									"type": "string",
									"description": "End time for global recurrance rule"
								},
								"optimizerDateTime": {
									"type": "string"
								},
								"optimizerReturnDateTime": {
									"type": "string"
								},
								"scheduleId": {
									"type": "string",
									"description": "Unique identifier of the schedule (UUID)"
								},
								"scheduleName": {
									"type": "string",
									"description": "User provided name for the schedule."
								},
								"status": {
									"type": "string",
									"description": "Status of the schedule.",
									"enum": [
										"PendingSchedule",
										"ScheduleFailed",
										"OptimizationInProgress",
										"PendingApproval",
										"OptimizationFailed",
										"Accepted",
										"Rejected",
										"Scheduled",
										"PublishingEvents",
										"PublishedEvents",
										"Completed",
										"CompletedWithError",
										"Deleted",
										"Cancelled"
									]
								},
								"userId": {
									"type": "string",
									"description": "ATTUID of the scheduler creator."
								},
								"domainData": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/DomainData"
									}
								},
								"events": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/Event"
									}
								},
								"scheduleApprovals": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/ScheduleApproval"
									}
								},
								"domain": {
									"type": "string"
								}
							}
						},
						"Schedule Event Message": {
							"type": "object",
							"required": [
								"eventJson",
								"eventTime"
							],
							"properties": {
								"eventJson": {
									"type": "object",
									"description": "Application provided JSON object which is pubvlished as eventData in the DMaaP event"
								},
								"eventTime": {
									"type": "string",
									"description": "Date/time of the event. (The first occurance in the case of a recurring event.)"
								},
								"recurEndTime": {
									"type": "string",
									"description": "Recurring events - date/time to end recurring event"
								},
								"reminder": {
									"type": "integer",
									"format": "int64",
									"description": "Reminder time, in seconds. Seconds subtracted from the event time to calculate actual publish time to account for the DMaaP latency."
								},
								"timeSensitive": {
									"type": "boolean",
									"description": "Time sensitive event.If true, Calendar will not publish event and update it to 'Past Due' if the event time has passed. Defaults to false which will not check for 'Past Due' events before publishing."
								},
								"rrule": {
									"type": "string",
									"description": "Event RRULE (RFC 5545) overrides the global RRULE in the schedule, if any"
								},
								"eventData": {
									"type": "array",
									"description": "Event metadata. These attributes may be used in query API and/or referenced in the eventText as ${eventdata.name}",
									"items": {
										"$ref": "#/definitions/EventData"
									}
								}
							},
							"description": "Event definition for schedule creation"
						},
						"Schedule Message": {
							"type": "object",
							"required": [
								"domain",
								"scheduleId",
								"userId"
							],
							"properties": {
								"domain": {
									"type": "string",
									"description": "Domain - Identifies the client application",
									"enum": [
										"ChangeManagement",
										"CLAMP",
										"POLO"
									]
								},
								"scheduleId": {
									"type": "string",
									"description": "Unique identifier of the schedule (UUID)"
								},
								"scheduleName": {
									"type": "string",
									"description": "User provided name of the scheduler, defaults to the scheduleId"
								},
								"userId": {
									"type": "string",
									"description": "Id of the user creating teh schedule"
								},
								"domainData": {
									"type": "array",
									"description": "Domain metadata - list of name/values ",
									"items": {
										"$ref": "#/definitions/DomainData"
									}
								},
								"globalRrule": {
									"type": "string",
									"description": "Global RRULE (RFC 5545) applied to all events in the schedule. Mutually exclusive of Event RRULE"
								},
								"scheduleInfo": {
									"type": "string"
								},
								"events": {
									"type": "array",
									"description": "Events provided by client or generated by optimizer.",
									"items": {
										"$ref": "#/definitions/Schedule Event Message"
									}
								}
							},
							"description": "Request for schedule creation"
						},
						"ScheduleApproval": {
							"type": "object",
							"properties": {
								"id": {
									"type": "integer",
									"format": "int64"
								},
								"approvalDateTime": {
									"type": "integer"
								},
								"status": {
									"type": "string"
								},
								"userId": {
									"type": "string"
								},
								"approvalType": {
									"$ref": "#/definitions/ApprovalType"
								}
							}
						},
						"ScheduleEventMessage": {
							"type": "object",
							"properties": {
								"eventText": {
									"type": "string"
								},
								"eventTime": {
									"type": "string"
								},
								"recurEndTime": {
									"type": "string"
								},
								"reminder": {
									"type": "integer",
									"format": "int64"
								},
								"status": {
									"type": "string"
								},
								"statusMessage": {
									"type": "string"
								},
								"rrule": {
									"type": "string"
								},
								"timeSensitive": {
									"type": "boolean"
								},
								"eventData": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventData"
									}
								},
								"eventsPending": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventsPending"
									}
								},
								"scheduleRequest": {
									"$ref": "#/definitions/Schedule"
								}
							}
						},
						"SchedulerRequestError": {
							"type": "object",
							"properties": {
								"requestError": {
									"$ref": "#/definitions/RequestError"
								}
							}
						}
					}
				},
			},
			"documentation": {
				"release": "Release: V1",
				"readme": "# soajs.test Test Express Service for Patch, Head, and others"
			}
		};
		service.createCatalog(data, (response) => {
			assert.ok(response);
			done();
		});
	});
	
	it("call createCatalog - success update catalog version branch", function (done) {
		sinon.stub(utils, 'generateSchemas').callsFake(function fakeFn(data, cb) {
			return cb();
		});
		let data = {
			"oldCatalog": {
				type: "micro1",
				name: "marketplace",
				configuration: {
					subType: "lion",
					group: "Example",
					port:4991,
					requestTimeout:30,
					requestTimeoutRenewal: 5
				},
				versions: [
					{
						version: "1",
						extKeyRequired: true,
						urac: true,
						urac_Profile: false,
						urac_ACL: false,
						urac_Config: false,
						urac_GroupConfig: false,
						tenant_Profile: false,
						provision_ACL: false,
						oauth: true,
						interConnect: [
							{
								name: "dashboard",
								version: "1"
							},
							{
								name: "infra",
								version: "1"
							},
							{
								name: "repository",
								version: "1"
							},
							{
								name: "console",
								version: "1"
							},
							{
								name: "multitenant",
								version: "1"
							}
						],
						maintenance: {
							readiness: "/heartbeat",
							port: {
								type: "maintenance"
							},
							commands: [
								{
									label: "Reload Registry",
									path: "/reloadRegistry",
									icon: "fas fa-undo"
								},
								{
									label: "Resource Info",
									path: "/resourceInfo",
									icon: "fas fa-info"
								}
							]
						},
						apis: [
							{
								l: "This API lists the items matching certain keywords from soajs catalog only.",
								v: "/soajs/items",
								m: "get",
								group: "SOAJS"
							}
						]
					}
				],
				description: "loliod",
			},
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.test",
				"branch": "dev"
			},
			"soa": {
				"name": "micro1",
				"group": "Example",
				"subType": "lion",
				"port": 4991,
				"version": "1",
				"description": "description is description",
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
				"tab": {
					"main": "main",
					"sub" : "sub"
				},
				"tags": ["tag1"],
				"program": ["program1"],
				"attributes": {
					"attrib": "1"
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
				},
				"profile": {"info": "stuff"}
			},
			"apiList" :{
				"type": "swagger",
				"schema": {
					"swagger": "2.0",
					"info": {
						"version": "1908.0001",
						"title": "calendar"
					},
					"host": "",
					"basePath": "/calendar",
					"tags": [
						{
							"name": "calendar"
						}
					],
					"paths": {
						"/v1/domain": {
							"post": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Creates a domain",
								"operationId": "createDomain",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"in": "body",
										"name": "body",
										"description": "Domain to be added",
										"required": false,
										"schema": {
											"$ref": "#/definitions/Create Domain Message"
										}
									}
								],
								"responses": {
									"200": {
										"description": "OK"
									},
									"412": {
										"description": "Domain already exists.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/health": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Returns health status of server.",
								"operationId": "healthCheck",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "apiVersion",
										"in": "path",
										"description": "v1|v2",
										"required": true,
										"type": "string",
										"default": "v2"
									},
									{
										"name": "checkInterfaces",
										"in": "query",
										"description": "Check Interfaces",
										"required": false,
										"type": "array",
										"items": {
											"type": "boolean",
											"default": true
										},
										"collectionFormat": "multi"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"$ref": "#/definitions/Health Check Message"
										}
									},
									"400": {
										"description": "Not healthy",
										"schema": {
											"$ref": "#/definitions/Health Check Message"
										}
									}
								}
							}
						},
						"/v1/schedules": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Returns a list of Scheduler Requests based upon the filter criteria.",
								"operationId": "searchScheduleRequests",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "domain",
										"in": "query",
										"description": "Schedule domain.",
										"required": false,
										"type": "string"
									},
									{
										"name": "scheduleId",
										"in": "query",
										"description": "Schedule identifier",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "scheduleName",
										"in": "query",
										"description": "Schedule name",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "userId",
										"in": "query",
										"description": "Schedule User id of creator",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "status",
										"in": "query",
										"description": "Schedule status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "createDateTime",
										"in": "query",
										"description": "Creation date and time (yyyy-MM-dd'T'HH:mm:ssZ)",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "optimizerStatus",
										"in": "query",
										"description": "Optimizer status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "domainData",
										"in": "query",
										"description": "Domain data (Ex: name:value)",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "eventData",
										"in": "query",
										"description": "Event data (Ex : name:value)",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"type": "array",
											"items": {
												"$ref": "#/definitions/Schedule"
											}
										}
									},
									"400": {
										"description": "Invalid query scheduler details request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"404": {
										"description": "No records found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/schedules/scheduleDetails": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Returns a list of Scheduler details based upon the filter criteria.",
								"operationId": "searchScheduleRequestDetails",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "domain",
										"in": "query",
										"description": "Schedule domain.",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.scheduleId",
										"in": "query",
										"description": "Schedule identifier",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.scheduleName",
										"in": "query",
										"description": "Schedule name",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.userId",
										"in": "query",
										"description": "SCheduler creator User id of ",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.status",
										"in": "query",
										"description": "Schedule status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.createDateTime",
										"in": "query",
										"description": "Creation date and time (<low date>[,<hi date>])",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.optimizerStatus",
										"in": "query",
										"description": "Optimizer status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.approvalUserId",
										"in": "query",
										"description": "Request Approval user id",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.approvalStatus",
										"in": "query",
										"description": "Request Approval status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.approvalType",
										"in": "query",
										"description": "Request Approval type",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "startTime",
										"in": "query",
										"description": "Start time <low>,<high>",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "finishTime",
										"in": "query",
										"description": "Finish time <low>,<high>",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "maxSchedules",
										"in": "query",
										"description": "Maximum number of schedules to return",
										"required": false,
										"type": "integer",
										"format": "int32"
									},
									{
										"name": "lastScheduleId",
										"in": "query",
										"description": "Return schedules > lastScheduleId",
										"required": false,
										"type": "string"
									},
									{
										"name": "dd",
										"in": "query",
										"description": "Domain data name:Value dd=name:value",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "ed",
										"in": "query",
										"description": "Event data name:Value ed=name:value",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"type": "array",
											"items": {
												"$ref": "#/definitions/ScheduleEventMessage"
											}
										}
									},
									"400": {
										"description": "Invalid query scheduler details request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"404": {
										"description": "No records found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/schedules/{scheduleId}": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Retrieves a schedule request for scheduleId",
								"operationId": "getScheduleRequestInfo",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule info being retrieved.",
										"required": true,
										"type": "string"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"$ref": "#/definitions/Schedule"
										}
									},
									"404": {
										"description": "No record found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							},
							"post": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Creates a schedule request for scheduleId",
								"operationId": "createScheduleRequest",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule request being created.",
										"required": true,
										"type": "string"
									},
									{
										"in": "body",
										"name": "body",
										"description": "Data for creating a schedule request for the given schedule id",
										"required": false,
										"schema": {
											"$ref": "#/definitions/Schedule Message"
										}
									}
								],
								"responses": {
									"202": {
										"description": "Schedule request accepted."
									},
									"400": {
										"description": "Invalid schedule create request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"412": {
										"description": "Schedule request already exists for this schedule id.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							},
							"delete": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Deletes a schedule requests for scheduleId",
								"operationId": "deleteScheduleRequest",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule request being deleted.",
										"required": true,
										"type": "string"
									}
								],
								"responses": {
									"204": {
										"description": "Delete successful"
									},
									"404": {
										"description": "No record found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/schedules/{scheduleId}/approvals": {
							"post": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Adds an accept/reject approval status to the schedule request identified by scheduleId",
								"operationId": "approveScheduleRequest",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule request being accepted or rejected.",
										"required": true,
										"type": "string"
									},
									{
										"in": "body",
										"name": "body",
										"description": "Accept or reject approval message",
										"required": false,
										"schema": {
											"$ref": "#/definitions/ApprovalMessage"
										}
									}
								],
								"responses": {
									"200": {
										"description": "OK"
									},
									"400": {
										"description": "Invalid schedule approval/reject request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"404": {
										"description": "No record found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						}
					},
					"definitions": {
						"ApprovalMessage": {
							"type": "object",
							"required": [
								"approvalStatus",
								"approvalType",
								"approvalUserId"
							],
							"properties": {
								"approvalUserId": {
									"type": "string",
									"description": "User Id- ATTUID of the approving user"
								},
								"approvalStatus": {
									"type": "string",
									"description": "Approval status ",
									"enum": [
										"Accepted",
										"Rejected"
									]
								},
								"approvalType": {
									"type": "string",
									"description": "Approval Type",
									"enum": [
										"Tier 2"
									]
								}
							}
						},
						"ApprovalType": {
							"type": "object",
							"properties": {
								"id": {
									"type": "integer",
									"format": "int64"
								},
								"approvalCount": {
									"type": "integer",
									"format": "int32"
								},
								"approvalType": {
									"type": "string"
								},
								"domain": {
									"type": "string"
								},
								"scheduleApprovals": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/ScheduleApproval"
									}
								}
							}
						},
						"Create Domain Message": {
							"type": "object",
							"required": [
								"domain"
							],
							"properties": {
								"domain": {
									"type": "string",
									"description": "Domain name"
								}
							},
							"description": "Event definition for schedule creation"
						},
						"DomainData": {
							"type": "object",
							"properties": {
								"name": {
									"type": "string"
								},
								"value": {
									"type": "string"
								}
							}
						},
						"Event": {
							"type": "object",
							"properties": {
								"eventText": {
									"type": "string"
								},
								"eventTime": {
									"type": "string"
								},
								"recurEndTime": {
									"type": "string"
								},
								"reminder": {
									"type": "integer",
									"format": "int64"
								},
								"status": {
									"type": "string"
								},
								"statusMessage": {
									"type": "string"
								},
								"rrule": {
									"type": "string"
								},
								"timeSensitive": {
									"type": "boolean"
								},
								"eventData": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventData"
									}
								},
								"eventsPending": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventsPending"
									}
								}
							}
						},
						"EventData": {
							"type": "object",
							"properties": {
								"name": {
									"type": "string"
								},
								"value": {
									"type": "string"
								}
							}
						},
						"EventsPending": {
							"type": "object",
							"properties": {
								"id": {
									"type": "string"
								},
								"dispatchTime": {
									"type": "integer",
									"format": "int64"
								},
								"eventTime": {
									"type": "integer",
									"format": "int64"
								},
								"eventsId": {
									"type": "string"
								},
								"status": {
									"type": "string"
								},
								"eventTimeString": {
									"type": "string"
								},
								"dispatchTimeString": {
									"type": "string"
								}
							}
						},
						"Health Check Component": {
							"type": "object",
							"properties": {
								"name": {
									"type": "string",
									"description": "Componnent/interface name",
									"enum": [
										"Database",
										"DMaaPMR"
									]
								},
								"url": {
									"type": "string",
									"description": "URL representing component/interface"
								},
								"status": {
									"type": "string",
									"description": "'OK' or error status message"
								},
								"healthy": {
									"type": "boolean",
									"description": "Component health"
								}
							},
							"description": "Health of a single component of the instance"
						},
						"Health Check Message": {
							"type": "object",
							"properties": {
								"healthy": {
									"type": "boolean",
									"description": "Overall health of instance. false if even one component reports not healthy."
								},
								"buildInfo": {
									"type": "string",
									"description": "Build info (docker image name)"
								},
								"currentTime": {
									"type": "string",
									"description": "Current time on the instance."
								},
								"hostname": {
									"type": "string",
									"description": "Hostname (in k8s = pod name)"
								},
								"components": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/Health Check Component"
									}
								}
							},
							"description": "Returns status of calendar service instance"
						},
						"RequestError": {
							"type": "object",
							"properties": {
								"messageId": {
									"type": "string"
								},
								"text": {
									"type": "string"
								},
								"variables": {
									"type": "array",
									"items": {
										"type": "string"
									}
								}
							}
						},
						"Schedule": {
							"type": "object",
							"properties": {
								"id": {
									"type": "string"
								},
								"createDateTime": {
									"type": "string",
									"description": "Date/time of schedule creation"
								},
								"deleteDateTime": {
									"type": "string",
									"description": "Date/time of schedule deletion"
								},
								"globalRrule": {
									"type": "string",
									"description": "Global recurrence rule. Applies to all events unless a local RRULE is defined"
								},
								"globalRecurEndTime": {
									"type": "string",
									"description": "End time for global recurrance rule"
								},
								"optimizerDateTime": {
									"type": "string"
								},
								"optimizerReturnDateTime": {
									"type": "string"
								},
								"scheduleId": {
									"type": "string",
									"description": "Unique identifier of the schedule (UUID)"
								},
								"scheduleName": {
									"type": "string",
									"description": "User provided name for the schedule."
								},
								"status": {
									"type": "string",
									"description": "Status of the schedule.",
									"enum": [
										"PendingSchedule",
										"ScheduleFailed",
										"OptimizationInProgress",
										"PendingApproval",
										"OptimizationFailed",
										"Accepted",
										"Rejected",
										"Scheduled",
										"PublishingEvents",
										"PublishedEvents",
										"Completed",
										"CompletedWithError",
										"Deleted",
										"Cancelled"
									]
								},
								"userId": {
									"type": "string",
									"description": "ATTUID of the scheduler creator."
								},
								"domainData": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/DomainData"
									}
								},
								"events": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/Event"
									}
								},
								"scheduleApprovals": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/ScheduleApproval"
									}
								},
								"domain": {
									"type": "string"
								}
							}
						},
						"Schedule Event Message": {
							"type": "object",
							"required": [
								"eventJson",
								"eventTime"
							],
							"properties": {
								"eventJson": {
									"type": "object",
									"description": "Application provided JSON object which is pubvlished as eventData in the DMaaP event"
								},
								"eventTime": {
									"type": "string",
									"description": "Date/time of the event. (The first occurance in the case of a recurring event.)"
								},
								"recurEndTime": {
									"type": "string",
									"description": "Recurring events - date/time to end recurring event"
								},
								"reminder": {
									"type": "integer",
									"format": "int64",
									"description": "Reminder time, in seconds. Seconds subtracted from the event time to calculate actual publish time to account for the DMaaP latency."
								},
								"timeSensitive": {
									"type": "boolean",
									"description": "Time sensitive event.If true, Calendar will not publish event and update it to 'Past Due' if the event time has passed. Defaults to false which will not check for 'Past Due' events before publishing."
								},
								"rrule": {
									"type": "string",
									"description": "Event RRULE (RFC 5545) overrides the global RRULE in the schedule, if any"
								},
								"eventData": {
									"type": "array",
									"description": "Event metadata. These attributes may be used in query API and/or referenced in the eventText as ${eventdata.name}",
									"items": {
										"$ref": "#/definitions/EventData"
									}
								}
							},
							"description": "Event definition for schedule creation"
						},
						"Schedule Message": {
							"type": "object",
							"required": [
								"domain",
								"scheduleId",
								"userId"
							],
							"properties": {
								"domain": {
									"type": "string",
									"description": "Domain - Identifies the client application",
									"enum": [
										"ChangeManagement",
										"CLAMP",
										"POLO"
									]
								},
								"scheduleId": {
									"type": "string",
									"description": "Unique identifier of the schedule (UUID)"
								},
								"scheduleName": {
									"type": "string",
									"description": "User provided name of the scheduler, defaults to the scheduleId"
								},
								"userId": {
									"type": "string",
									"description": "Id of the user creating teh schedule"
								},
								"domainData": {
									"type": "array",
									"description": "Domain metadata - list of name/values ",
									"items": {
										"$ref": "#/definitions/DomainData"
									}
								},
								"globalRrule": {
									"type": "string",
									"description": "Global RRULE (RFC 5545) applied to all events in the schedule. Mutually exclusive of Event RRULE"
								},
								"scheduleInfo": {
									"type": "string"
								},
								"events": {
									"type": "array",
									"description": "Events provided by client or generated by optimizer.",
									"items": {
										"$ref": "#/definitions/Schedule Event Message"
									}
								}
							},
							"description": "Request for schedule creation"
						},
						"ScheduleApproval": {
							"type": "object",
							"properties": {
								"id": {
									"type": "integer",
									"format": "int64"
								},
								"approvalDateTime": {
									"type": "integer"
								},
								"status": {
									"type": "string"
								},
								"userId": {
									"type": "string"
								},
								"approvalType": {
									"$ref": "#/definitions/ApprovalType"
								}
							}
						},
						"ScheduleEventMessage": {
							"type": "object",
							"properties": {
								"eventText": {
									"type": "string"
								},
								"eventTime": {
									"type": "string"
								},
								"recurEndTime": {
									"type": "string"
								},
								"reminder": {
									"type": "integer",
									"format": "int64"
								},
								"status": {
									"type": "string"
								},
								"statusMessage": {
									"type": "string"
								},
								"rrule": {
									"type": "string"
								},
								"timeSensitive": {
									"type": "boolean"
								},
								"eventData": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventData"
									}
								},
								"eventsPending": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventsPending"
									}
								},
								"scheduleRequest": {
									"$ref": "#/definitions/Schedule"
								}
							}
						},
						"SchedulerRequestError": {
							"type": "object",
							"properties": {
								"requestError": {
									"$ref": "#/definitions/RequestError"
								}
							}
						}
					}
				},
			},
			"documentation": {
				"release": "Release: V1",
				"readme": "# soajs.test Test Express Service for Patch, Head, and others"
			}
		};
		service.createCatalog(data, (response) => {
			assert.ok(response);
			done();
		});
	});
	
	it("call createCatalog - success tag", function (done) {
		sinon.stub(utils, 'generateSchemas').callsFake(function fakeFn(data, cb) {
			return cb();
		});
		let data = {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.test",
				"tag": "1"
			},
			"soa": {
				"name": "micro1",
				"group": "Example",
				"subType": "lion",
				"port": 4991,
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
				"interConnect": [{
					"name": "example2"
				}],
				"tab": {
					"main": "main",
					"sub" : "sub"
				},
				"tags": ["tag1"],
				"program": ["program1"],
				"attributes": {
					"attrib": "1"
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
				},
				"profile": {"info": "stuff"}
			},
			"apiList" :{
				"type": "swagger",
				"schema": {
					"swagger": "2.0",
					"info": {
						"version": "1908.0001",
						"title": "calendar"
					},
					"host": "",
					"basePath": "/calendar",
					"tags": [
						{
							"name": "calendar"
						}
					],
					"paths": {
						"/v1/domain": {
							"post": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Creates a domain",
								"operationId": "createDomain",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"in": "body",
										"name": "body",
										"description": "Domain to be added",
										"required": false,
										"schema": {
											"$ref": "#/definitions/Create Domain Message"
										}
									}
								],
								"responses": {
									"200": {
										"description": "OK"
									},
									"412": {
										"description": "Domain already exists.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/health": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Returns health status of server.",
								"operationId": "healthCheck",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "apiVersion",
										"in": "path",
										"description": "v1|v2",
										"required": true,
										"type": "string",
										"default": "v2"
									},
									{
										"name": "checkInterfaces",
										"in": "query",
										"description": "Check Interfaces",
										"required": false,
										"type": "array",
										"items": {
											"type": "boolean",
											"default": true
										},
										"collectionFormat": "multi"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"$ref": "#/definitions/Health Check Message"
										}
									},
									"400": {
										"description": "Not healthy",
										"schema": {
											"$ref": "#/definitions/Health Check Message"
										}
									}
								}
							}
						},
						"/v1/schedules": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Returns a list of Scheduler Requests based upon the filter criteria.",
								"operationId": "searchScheduleRequests",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "domain",
										"in": "query",
										"description": "Schedule domain.",
										"required": false,
										"type": "string"
									},
									{
										"name": "scheduleId",
										"in": "query",
										"description": "Schedule identifier",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "scheduleName",
										"in": "query",
										"description": "Schedule name",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "userId",
										"in": "query",
										"description": "Schedule User id of creator",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "status",
										"in": "query",
										"description": "Schedule status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "createDateTime",
										"in": "query",
										"description": "Creation date and time (yyyy-MM-dd'T'HH:mm:ssZ)",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "optimizerStatus",
										"in": "query",
										"description": "Optimizer status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "domainData",
										"in": "query",
										"description": "Domain data (Ex: name:value)",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "eventData",
										"in": "query",
										"description": "Event data (Ex : name:value)",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"type": "array",
											"items": {
												"$ref": "#/definitions/Schedule"
											}
										}
									},
									"400": {
										"description": "Invalid query scheduler details request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"404": {
										"description": "No records found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/schedules/scheduleDetails": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Returns a list of Scheduler details based upon the filter criteria.",
								"operationId": "searchScheduleRequestDetails",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "domain",
										"in": "query",
										"description": "Schedule domain.",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.scheduleId",
										"in": "query",
										"description": "Schedule identifier",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.scheduleName",
										"in": "query",
										"description": "Schedule name",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.userId",
										"in": "query",
										"description": "SCheduler creator User id of ",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.status",
										"in": "query",
										"description": "Schedule status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.createDateTime",
										"in": "query",
										"description": "Creation date and time (<low date>[,<hi date>])",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.optimizerStatus",
										"in": "query",
										"description": "Optimizer status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.approvalUserId",
										"in": "query",
										"description": "Request Approval user id",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.approvalStatus",
										"in": "query",
										"description": "Request Approval status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.approvalType",
										"in": "query",
										"description": "Request Approval type",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "startTime",
										"in": "query",
										"description": "Start time <low>,<high>",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "finishTime",
										"in": "query",
										"description": "Finish time <low>,<high>",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "maxSchedules",
										"in": "query",
										"description": "Maximum number of schedules to return",
										"required": false,
										"type": "integer",
										"format": "int32"
									},
									{
										"name": "lastScheduleId",
										"in": "query",
										"description": "Return schedules > lastScheduleId",
										"required": false,
										"type": "string"
									},
									{
										"name": "dd",
										"in": "query",
										"description": "Domain data name:Value dd=name:value",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "ed",
										"in": "query",
										"description": "Event data name:Value ed=name:value",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"type": "array",
											"items": {
												"$ref": "#/definitions/ScheduleEventMessage"
											}
										}
									},
									"400": {
										"description": "Invalid query scheduler details request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"404": {
										"description": "No records found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/schedules/{scheduleId}": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Retrieves a schedule request for scheduleId",
								"operationId": "getScheduleRequestInfo",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule info being retrieved.",
										"required": true,
										"type": "string"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"$ref": "#/definitions/Schedule"
										}
									},
									"404": {
										"description": "No record found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							},
							"post": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Creates a schedule request for scheduleId",
								"operationId": "createScheduleRequest",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule request being created.",
										"required": true,
										"type": "string"
									},
									{
										"in": "body",
										"name": "body",
										"description": "Data for creating a schedule request for the given schedule id",
										"required": false,
										"schema": {
											"$ref": "#/definitions/Schedule Message"
										}
									}
								],
								"responses": {
									"202": {
										"description": "Schedule request accepted."
									},
									"400": {
										"description": "Invalid schedule create request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"412": {
										"description": "Schedule request already exists for this schedule id.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							},
							"delete": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Deletes a schedule requests for scheduleId",
								"operationId": "deleteScheduleRequest",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule request being deleted.",
										"required": true,
										"type": "string"
									}
								],
								"responses": {
									"204": {
										"description": "Delete successful"
									},
									"404": {
										"description": "No record found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/schedules/{scheduleId}/approvals": {
							"post": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Adds an accept/reject approval status to the schedule request identified by scheduleId",
								"operationId": "approveScheduleRequest",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule request being accepted or rejected.",
										"required": true,
										"type": "string"
									},
									{
										"in": "body",
										"name": "body",
										"description": "Accept or reject approval message",
										"required": false,
										"schema": {
											"$ref": "#/definitions/ApprovalMessage"
										}
									}
								],
								"responses": {
									"200": {
										"description": "OK"
									},
									"400": {
										"description": "Invalid schedule approval/reject request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"404": {
										"description": "No record found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						}
					},
					"definitions": {
						"ApprovalMessage": {
							"type": "object",
							"required": [
								"approvalStatus",
								"approvalType",
								"approvalUserId"
							],
							"properties": {
								"approvalUserId": {
									"type": "string",
									"description": "User Id- ATTUID of the approving user"
								},
								"approvalStatus": {
									"type": "string",
									"description": "Approval status ",
									"enum": [
										"Accepted",
										"Rejected"
									]
								},
								"approvalType": {
									"type": "string",
									"description": "Approval Type",
									"enum": [
										"Tier 2"
									]
								}
							}
						},
						"ApprovalType": {
							"type": "object",
							"properties": {
								"id": {
									"type": "integer",
									"format": "int64"
								},
								"approvalCount": {
									"type": "integer",
									"format": "int32"
								},
								"approvalType": {
									"type": "string"
								},
								"domain": {
									"type": "string"
								},
								"scheduleApprovals": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/ScheduleApproval"
									}
								}
							}
						},
						"Create Domain Message": {
							"type": "object",
							"required": [
								"domain"
							],
							"properties": {
								"domain": {
									"type": "string",
									"description": "Domain name"
								}
							},
							"description": "Event definition for schedule creation"
						},
						"DomainData": {
							"type": "object",
							"properties": {
								"name": {
									"type": "string"
								},
								"value": {
									"type": "string"
								}
							}
						},
						"Event": {
							"type": "object",
							"properties": {
								"eventText": {
									"type": "string"
								},
								"eventTime": {
									"type": "string"
								},
								"recurEndTime": {
									"type": "string"
								},
								"reminder": {
									"type": "integer",
									"format": "int64"
								},
								"status": {
									"type": "string"
								},
								"statusMessage": {
									"type": "string"
								},
								"rrule": {
									"type": "string"
								},
								"timeSensitive": {
									"type": "boolean"
								},
								"eventData": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventData"
									}
								},
								"eventsPending": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventsPending"
									}
								}
							}
						},
						"EventData": {
							"type": "object",
							"properties": {
								"name": {
									"type": "string"
								},
								"value": {
									"type": "string"
								}
							}
						},
						"EventsPending": {
							"type": "object",
							"properties": {
								"id": {
									"type": "string"
								},
								"dispatchTime": {
									"type": "integer",
									"format": "int64"
								},
								"eventTime": {
									"type": "integer",
									"format": "int64"
								},
								"eventsId": {
									"type": "string"
								},
								"status": {
									"type": "string"
								},
								"eventTimeString": {
									"type": "string"
								},
								"dispatchTimeString": {
									"type": "string"
								}
							}
						},
						"Health Check Component": {
							"type": "object",
							"properties": {
								"name": {
									"type": "string",
									"description": "Componnent/interface name",
									"enum": [
										"Database",
										"DMaaPMR"
									]
								},
								"url": {
									"type": "string",
									"description": "URL representing component/interface"
								},
								"status": {
									"type": "string",
									"description": "'OK' or error status message"
								},
								"healthy": {
									"type": "boolean",
									"description": "Component health"
								}
							},
							"description": "Health of a single component of the instance"
						},
						"Health Check Message": {
							"type": "object",
							"properties": {
								"healthy": {
									"type": "boolean",
									"description": "Overall health of instance. false if even one component reports not healthy."
								},
								"buildInfo": {
									"type": "string",
									"description": "Build info (docker image name)"
								},
								"currentTime": {
									"type": "string",
									"description": "Current time on the instance."
								},
								"hostname": {
									"type": "string",
									"description": "Hostname (in k8s = pod name)"
								},
								"components": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/Health Check Component"
									}
								}
							},
							"description": "Returns status of calendar service instance"
						},
						"RequestError": {
							"type": "object",
							"properties": {
								"messageId": {
									"type": "string"
								},
								"text": {
									"type": "string"
								},
								"variables": {
									"type": "array",
									"items": {
										"type": "string"
									}
								}
							}
						},
						"Schedule": {
							"type": "object",
							"properties": {
								"id": {
									"type": "string"
								},
								"createDateTime": {
									"type": "string",
									"description": "Date/time of schedule creation"
								},
								"deleteDateTime": {
									"type": "string",
									"description": "Date/time of schedule deletion"
								},
								"globalRrule": {
									"type": "string",
									"description": "Global recurrence rule. Applies to all events unless a local RRULE is defined"
								},
								"globalRecurEndTime": {
									"type": "string",
									"description": "End time for global recurrance rule"
								},
								"optimizerDateTime": {
									"type": "string"
								},
								"optimizerReturnDateTime": {
									"type": "string"
								},
								"scheduleId": {
									"type": "string",
									"description": "Unique identifier of the schedule (UUID)"
								},
								"scheduleName": {
									"type": "string",
									"description": "User provided name for the schedule."
								},
								"status": {
									"type": "string",
									"description": "Status of the schedule.",
									"enum": [
										"PendingSchedule",
										"ScheduleFailed",
										"OptimizationInProgress",
										"PendingApproval",
										"OptimizationFailed",
										"Accepted",
										"Rejected",
										"Scheduled",
										"PublishingEvents",
										"PublishedEvents",
										"Completed",
										"CompletedWithError",
										"Deleted",
										"Cancelled"
									]
								},
								"userId": {
									"type": "string",
									"description": "ATTUID of the scheduler creator."
								},
								"domainData": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/DomainData"
									}
								},
								"events": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/Event"
									}
								},
								"scheduleApprovals": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/ScheduleApproval"
									}
								},
								"domain": {
									"type": "string"
								}
							}
						},
						"Schedule Event Message": {
							"type": "object",
							"required": [
								"eventJson",
								"eventTime"
							],
							"properties": {
								"eventJson": {
									"type": "object",
									"description": "Application provided JSON object which is pubvlished as eventData in the DMaaP event"
								},
								"eventTime": {
									"type": "string",
									"description": "Date/time of the event. (The first occurance in the case of a recurring event.)"
								},
								"recurEndTime": {
									"type": "string",
									"description": "Recurring events - date/time to end recurring event"
								},
								"reminder": {
									"type": "integer",
									"format": "int64",
									"description": "Reminder time, in seconds. Seconds subtracted from the event time to calculate actual publish time to account for the DMaaP latency."
								},
								"timeSensitive": {
									"type": "boolean",
									"description": "Time sensitive event.If true, Calendar will not publish event and update it to 'Past Due' if the event time has passed. Defaults to false which will not check for 'Past Due' events before publishing."
								},
								"rrule": {
									"type": "string",
									"description": "Event RRULE (RFC 5545) overrides the global RRULE in the schedule, if any"
								},
								"eventData": {
									"type": "array",
									"description": "Event metadata. These attributes may be used in query API and/or referenced in the eventText as ${eventdata.name}",
									"items": {
										"$ref": "#/definitions/EventData"
									}
								}
							},
							"description": "Event definition for schedule creation"
						},
						"Schedule Message": {
							"type": "object",
							"required": [
								"domain",
								"scheduleId",
								"userId"
							],
							"properties": {
								"domain": {
									"type": "string",
									"description": "Domain - Identifies the client application",
									"enum": [
										"ChangeManagement",
										"CLAMP",
										"POLO"
									]
								},
								"scheduleId": {
									"type": "string",
									"description": "Unique identifier of the schedule (UUID)"
								},
								"scheduleName": {
									"type": "string",
									"description": "User provided name of the scheduler, defaults to the scheduleId"
								},
								"userId": {
									"type": "string",
									"description": "Id of the user creating teh schedule"
								},
								"domainData": {
									"type": "array",
									"description": "Domain metadata - list of name/values ",
									"items": {
										"$ref": "#/definitions/DomainData"
									}
								},
								"globalRrule": {
									"type": "string",
									"description": "Global RRULE (RFC 5545) applied to all events in the schedule. Mutually exclusive of Event RRULE"
								},
								"scheduleInfo": {
									"type": "string"
								},
								"events": {
									"type": "array",
									"description": "Events provided by client or generated by optimizer.",
									"items": {
										"$ref": "#/definitions/Schedule Event Message"
									}
								}
							},
							"description": "Request for schedule creation"
						},
						"ScheduleApproval": {
							"type": "object",
							"properties": {
								"id": {
									"type": "integer",
									"format": "int64"
								},
								"approvalDateTime": {
									"type": "integer"
								},
								"status": {
									"type": "string"
								},
								"userId": {
									"type": "string"
								},
								"approvalType": {
									"$ref": "#/definitions/ApprovalType"
								}
							}
						},
						"ScheduleEventMessage": {
							"type": "object",
							"properties": {
								"eventText": {
									"type": "string"
								},
								"eventTime": {
									"type": "string"
								},
								"recurEndTime": {
									"type": "string"
								},
								"reminder": {
									"type": "integer",
									"format": "int64"
								},
								"status": {
									"type": "string"
								},
								"statusMessage": {
									"type": "string"
								},
								"rrule": {
									"type": "string"
								},
								"timeSensitive": {
									"type": "boolean"
								},
								"eventData": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventData"
									}
								},
								"eventsPending": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventsPending"
									}
								},
								"scheduleRequest": {
									"$ref": "#/definitions/Schedule"
								}
							}
						},
						"SchedulerRequestError": {
							"type": "object",
							"properties": {
								"requestError": {
									"$ref": "#/definitions/RequestError"
								}
							}
						}
					}
				},
			},
			"documentation": {
				"release": "Release: V1",
				"readme": "# soajs.test Test Express Service for Patch, Head, and others"
			}
		};
		service.createCatalog(data, (response) => {
			assert.ok(response);
			done();
		});
	});
	
	it("call createCatalog - success update catalog version tag", function (done) {
		sinon.stub(utils, 'generateSchemas').callsFake(function fakeFn(data, cb) {
			return cb();
		});
		let data = {
			"oldCatalog": {
				type: "micro1",
				name: "marketplace",
				configuration: {
					subType: "lion",
					group: "Example",
					port:4991,
					requestTimeout:30,
					requestTimeoutRenewal: 5
				},
				versions: [
					{
						version: "1",
						extKeyRequired: true,
						urac: true,
						urac_Profile: false,
						urac_ACL: false,
						urac_Config: false,
						urac_GroupConfig: false,
						tenant_Profile: false,
						provision_ACL: false,
						oauth: true,
						interConnect: [
							{
								name: "dashboard",
								version: "1"
							},
							{
								name: "infra",
								version: "1"
							},
							{
								name: "repository",
								version: "1"
							},
							{
								name: "console",
								version: "1"
							},
							{
								name: "multitenant",
								version: "1"
							}
						],
						maintenance: {
							readiness: "/heartbeat",
							port: {
								type: "maintenance"
							},
							commands: [
								{
									label: "Reload Registry",
									path: "/reloadRegistry",
									icon: "fas fa-undo"
								},
								{
									label: "Resource Info",
									path: "/resourceInfo",
									icon: "fas fa-info"
								}
							]
						},
						apis: [
							{
								l: "This API lists the items matching certain keywords from soajs catalog only.",
								v: "/soajs/items",
								m: "get",
								group: "SOAJS"
							}
						]
					}
				],
				description: "loliod",
			},
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.test",
				"tag": "1"
			},
			"soa": {
				"name": "micro1",
				"group": "Example",
				"subType": "lion",
				"port": 4991,
				"version": "1",
				"description": "description is description",
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
				"tab": {
					"main": "main",
					"sub" : "sub"
				},
				"tags": ["tag1"],
				"program": ["program1"],
				"attributes": {
					"attrib": "1"
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
				},
				"profile": {"info": "stuff"}
			},
			"apiList" :{
				"type": "swagger",
				"schema": {
					"swagger": "2.0",
					"info": {
						"version": "1908.0001",
						"title": "calendar"
					},
					"host": "",
					"basePath": "/calendar",
					"tags": [
						{
							"name": "calendar"
						}
					],
					"paths": {
						"/v1/domain": {
							"post": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Creates a domain",
								"operationId": "createDomain",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"in": "body",
										"name": "body",
										"description": "Domain to be added",
										"required": false,
										"schema": {
											"$ref": "#/definitions/Create Domain Message"
										}
									}
								],
								"responses": {
									"200": {
										"description": "OK"
									},
									"412": {
										"description": "Domain already exists.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/health": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Returns health status of server.",
								"operationId": "healthCheck",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "apiVersion",
										"in": "path",
										"description": "v1|v2",
										"required": true,
										"type": "string",
										"default": "v2"
									},
									{
										"name": "checkInterfaces",
										"in": "query",
										"description": "Check Interfaces",
										"required": false,
										"type": "array",
										"items": {
											"type": "boolean",
											"default": true
										},
										"collectionFormat": "multi"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"$ref": "#/definitions/Health Check Message"
										}
									},
									"400": {
										"description": "Not healthy",
										"schema": {
											"$ref": "#/definitions/Health Check Message"
										}
									}
								}
							}
						},
						"/v1/schedules": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Returns a list of Scheduler Requests based upon the filter criteria.",
								"operationId": "searchScheduleRequests",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "domain",
										"in": "query",
										"description": "Schedule domain.",
										"required": false,
										"type": "string"
									},
									{
										"name": "scheduleId",
										"in": "query",
										"description": "Schedule identifier",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "scheduleName",
										"in": "query",
										"description": "Schedule name",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "userId",
										"in": "query",
										"description": "Schedule User id of creator",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "status",
										"in": "query",
										"description": "Schedule status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "createDateTime",
										"in": "query",
										"description": "Creation date and time (yyyy-MM-dd'T'HH:mm:ssZ)",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "optimizerStatus",
										"in": "query",
										"description": "Optimizer status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "domainData",
										"in": "query",
										"description": "Domain data (Ex: name:value)",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "eventData",
										"in": "query",
										"description": "Event data (Ex : name:value)",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"type": "array",
											"items": {
												"$ref": "#/definitions/Schedule"
											}
										}
									},
									"400": {
										"description": "Invalid query scheduler details request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"404": {
										"description": "No records found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/schedules/scheduleDetails": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Returns a list of Scheduler details based upon the filter criteria.",
								"operationId": "searchScheduleRequestDetails",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "domain",
										"in": "query",
										"description": "Schedule domain.",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.scheduleId",
										"in": "query",
										"description": "Schedule identifier",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.scheduleName",
										"in": "query",
										"description": "Schedule name",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.userId",
										"in": "query",
										"description": "SCheduler creator User id of ",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.status",
										"in": "query",
										"description": "Schedule status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.createDateTime",
										"in": "query",
										"description": "Creation date and time (<low date>[,<hi date>])",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.optimizerStatus",
										"in": "query",
										"description": "Optimizer status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.approvalUserId",
										"in": "query",
										"description": "Request Approval user id",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.approvalStatus",
										"in": "query",
										"description": "Request Approval status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.approvalType",
										"in": "query",
										"description": "Request Approval type",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "startTime",
										"in": "query",
										"description": "Start time <low>,<high>",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "finishTime",
										"in": "query",
										"description": "Finish time <low>,<high>",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "maxSchedules",
										"in": "query",
										"description": "Maximum number of schedules to return",
										"required": false,
										"type": "integer",
										"format": "int32"
									},
									{
										"name": "lastScheduleId",
										"in": "query",
										"description": "Return schedules > lastScheduleId",
										"required": false,
										"type": "string"
									},
									{
										"name": "dd",
										"in": "query",
										"description": "Domain data name:Value dd=name:value",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "ed",
										"in": "query",
										"description": "Event data name:Value ed=name:value",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"type": "array",
											"items": {
												"$ref": "#/definitions/ScheduleEventMessage"
											}
										}
									},
									"400": {
										"description": "Invalid query scheduler details request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"404": {
										"description": "No records found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/schedules/{scheduleId}": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Retrieves a schedule request for scheduleId",
								"operationId": "getScheduleRequestInfo",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule info being retrieved.",
										"required": true,
										"type": "string"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"$ref": "#/definitions/Schedule"
										}
									},
									"404": {
										"description": "No record found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							},
							"post": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Creates a schedule request for scheduleId",
								"operationId": "createScheduleRequest",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule request being created.",
										"required": true,
										"type": "string"
									},
									{
										"in": "body",
										"name": "body",
										"description": "Data for creating a schedule request for the given schedule id",
										"required": false,
										"schema": {
											"$ref": "#/definitions/Schedule Message"
										}
									}
								],
								"responses": {
									"202": {
										"description": "Schedule request accepted."
									},
									"400": {
										"description": "Invalid schedule create request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"412": {
										"description": "Schedule request already exists for this schedule id.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							},
							"delete": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Deletes a schedule requests for scheduleId",
								"operationId": "deleteScheduleRequest",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule request being deleted.",
										"required": true,
										"type": "string"
									}
								],
								"responses": {
									"204": {
										"description": "Delete successful"
									},
									"404": {
										"description": "No record found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/schedules/{scheduleId}/approvals": {
							"post": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Adds an accept/reject approval status to the schedule request identified by scheduleId",
								"operationId": "approveScheduleRequest",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule request being accepted or rejected.",
										"required": true,
										"type": "string"
									},
									{
										"in": "body",
										"name": "body",
										"description": "Accept or reject approval message",
										"required": false,
										"schema": {
											"$ref": "#/definitions/ApprovalMessage"
										}
									}
								],
								"responses": {
									"200": {
										"description": "OK"
									},
									"400": {
										"description": "Invalid schedule approval/reject request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"404": {
										"description": "No record found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						}
					},
					"definitions": {
						"ApprovalMessage": {
							"type": "object",
							"required": [
								"approvalStatus",
								"approvalType",
								"approvalUserId"
							],
							"properties": {
								"approvalUserId": {
									"type": "string",
									"description": "User Id- ATTUID of the approving user"
								},
								"approvalStatus": {
									"type": "string",
									"description": "Approval status ",
									"enum": [
										"Accepted",
										"Rejected"
									]
								},
								"approvalType": {
									"type": "string",
									"description": "Approval Type",
									"enum": [
										"Tier 2"
									]
								}
							}
						},
						"ApprovalType": {
							"type": "object",
							"properties": {
								"id": {
									"type": "integer",
									"format": "int64"
								},
								"approvalCount": {
									"type": "integer",
									"format": "int32"
								},
								"approvalType": {
									"type": "string"
								},
								"domain": {
									"type": "string"
								},
								"scheduleApprovals": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/ScheduleApproval"
									}
								}
							}
						},
						"Create Domain Message": {
							"type": "object",
							"required": [
								"domain"
							],
							"properties": {
								"domain": {
									"type": "string",
									"description": "Domain name"
								}
							},
							"description": "Event definition for schedule creation"
						},
						"DomainData": {
							"type": "object",
							"properties": {
								"name": {
									"type": "string"
								},
								"value": {
									"type": "string"
								}
							}
						},
						"Event": {
							"type": "object",
							"properties": {
								"eventText": {
									"type": "string"
								},
								"eventTime": {
									"type": "string"
								},
								"recurEndTime": {
									"type": "string"
								},
								"reminder": {
									"type": "integer",
									"format": "int64"
								},
								"status": {
									"type": "string"
								},
								"statusMessage": {
									"type": "string"
								},
								"rrule": {
									"type": "string"
								},
								"timeSensitive": {
									"type": "boolean"
								},
								"eventData": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventData"
									}
								},
								"eventsPending": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventsPending"
									}
								}
							}
						},
						"EventData": {
							"type": "object",
							"properties": {
								"name": {
									"type": "string"
								},
								"value": {
									"type": "string"
								}
							}
						},
						"EventsPending": {
							"type": "object",
							"properties": {
								"id": {
									"type": "string"
								},
								"dispatchTime": {
									"type": "integer",
									"format": "int64"
								},
								"eventTime": {
									"type": "integer",
									"format": "int64"
								},
								"eventsId": {
									"type": "string"
								},
								"status": {
									"type": "string"
								},
								"eventTimeString": {
									"type": "string"
								},
								"dispatchTimeString": {
									"type": "string"
								}
							}
						},
						"Health Check Component": {
							"type": "object",
							"properties": {
								"name": {
									"type": "string",
									"description": "Componnent/interface name",
									"enum": [
										"Database",
										"DMaaPMR"
									]
								},
								"url": {
									"type": "string",
									"description": "URL representing component/interface"
								},
								"status": {
									"type": "string",
									"description": "'OK' or error status message"
								},
								"healthy": {
									"type": "boolean",
									"description": "Component health"
								}
							},
							"description": "Health of a single component of the instance"
						},
						"Health Check Message": {
							"type": "object",
							"properties": {
								"healthy": {
									"type": "boolean",
									"description": "Overall health of instance. false if even one component reports not healthy."
								},
								"buildInfo": {
									"type": "string",
									"description": "Build info (docker image name)"
								},
								"currentTime": {
									"type": "string",
									"description": "Current time on the instance."
								},
								"hostname": {
									"type": "string",
									"description": "Hostname (in k8s = pod name)"
								},
								"components": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/Health Check Component"
									}
								}
							},
							"description": "Returns status of calendar service instance"
						},
						"RequestError": {
							"type": "object",
							"properties": {
								"messageId": {
									"type": "string"
								},
								"text": {
									"type": "string"
								},
								"variables": {
									"type": "array",
									"items": {
										"type": "string"
									}
								}
							}
						},
						"Schedule": {
							"type": "object",
							"properties": {
								"id": {
									"type": "string"
								},
								"createDateTime": {
									"type": "string",
									"description": "Date/time of schedule creation"
								},
								"deleteDateTime": {
									"type": "string",
									"description": "Date/time of schedule deletion"
								},
								"globalRrule": {
									"type": "string",
									"description": "Global recurrence rule. Applies to all events unless a local RRULE is defined"
								},
								"globalRecurEndTime": {
									"type": "string",
									"description": "End time for global recurrance rule"
								},
								"optimizerDateTime": {
									"type": "string"
								},
								"optimizerReturnDateTime": {
									"type": "string"
								},
								"scheduleId": {
									"type": "string",
									"description": "Unique identifier of the schedule (UUID)"
								},
								"scheduleName": {
									"type": "string",
									"description": "User provided name for the schedule."
								},
								"status": {
									"type": "string",
									"description": "Status of the schedule.",
									"enum": [
										"PendingSchedule",
										"ScheduleFailed",
										"OptimizationInProgress",
										"PendingApproval",
										"OptimizationFailed",
										"Accepted",
										"Rejected",
										"Scheduled",
										"PublishingEvents",
										"PublishedEvents",
										"Completed",
										"CompletedWithError",
										"Deleted",
										"Cancelled"
									]
								},
								"userId": {
									"type": "string",
									"description": "ATTUID of the scheduler creator."
								},
								"domainData": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/DomainData"
									}
								},
								"events": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/Event"
									}
								},
								"scheduleApprovals": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/ScheduleApproval"
									}
								},
								"domain": {
									"type": "string"
								}
							}
						},
						"Schedule Event Message": {
							"type": "object",
							"required": [
								"eventJson",
								"eventTime"
							],
							"properties": {
								"eventJson": {
									"type": "object",
									"description": "Application provided JSON object which is pubvlished as eventData in the DMaaP event"
								},
								"eventTime": {
									"type": "string",
									"description": "Date/time of the event. (The first occurance in the case of a recurring event.)"
								},
								"recurEndTime": {
									"type": "string",
									"description": "Recurring events - date/time to end recurring event"
								},
								"reminder": {
									"type": "integer",
									"format": "int64",
									"description": "Reminder time, in seconds. Seconds subtracted from the event time to calculate actual publish time to account for the DMaaP latency."
								},
								"timeSensitive": {
									"type": "boolean",
									"description": "Time sensitive event.If true, Calendar will not publish event and update it to 'Past Due' if the event time has passed. Defaults to false which will not check for 'Past Due' events before publishing."
								},
								"rrule": {
									"type": "string",
									"description": "Event RRULE (RFC 5545) overrides the global RRULE in the schedule, if any"
								},
								"eventData": {
									"type": "array",
									"description": "Event metadata. These attributes may be used in query API and/or referenced in the eventText as ${eventdata.name}",
									"items": {
										"$ref": "#/definitions/EventData"
									}
								}
							},
							"description": "Event definition for schedule creation"
						},
						"Schedule Message": {
							"type": "object",
							"required": [
								"domain",
								"scheduleId",
								"userId"
							],
							"properties": {
								"domain": {
									"type": "string",
									"description": "Domain - Identifies the client application",
									"enum": [
										"ChangeManagement",
										"CLAMP",
										"POLO"
									]
								},
								"scheduleId": {
									"type": "string",
									"description": "Unique identifier of the schedule (UUID)"
								},
								"scheduleName": {
									"type": "string",
									"description": "User provided name of the scheduler, defaults to the scheduleId"
								},
								"userId": {
									"type": "string",
									"description": "Id of the user creating teh schedule"
								},
								"domainData": {
									"type": "array",
									"description": "Domain metadata - list of name/values ",
									"items": {
										"$ref": "#/definitions/DomainData"
									}
								},
								"globalRrule": {
									"type": "string",
									"description": "Global RRULE (RFC 5545) applied to all events in the schedule. Mutually exclusive of Event RRULE"
								},
								"scheduleInfo": {
									"type": "string"
								},
								"events": {
									"type": "array",
									"description": "Events provided by client or generated by optimizer.",
									"items": {
										"$ref": "#/definitions/Schedule Event Message"
									}
								}
							},
							"description": "Request for schedule creation"
						},
						"ScheduleApproval": {
							"type": "object",
							"properties": {
								"id": {
									"type": "integer",
									"format": "int64"
								},
								"approvalDateTime": {
									"type": "integer"
								},
								"status": {
									"type": "string"
								},
								"userId": {
									"type": "string"
								},
								"approvalType": {
									"$ref": "#/definitions/ApprovalType"
								}
							}
						},
						"ScheduleEventMessage": {
							"type": "object",
							"properties": {
								"eventText": {
									"type": "string"
								},
								"eventTime": {
									"type": "string"
								},
								"recurEndTime": {
									"type": "string"
								},
								"reminder": {
									"type": "integer",
									"format": "int64"
								},
								"status": {
									"type": "string"
								},
								"statusMessage": {
									"type": "string"
								},
								"rrule": {
									"type": "string"
								},
								"timeSensitive": {
									"type": "boolean"
								},
								"eventData": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventData"
									}
								},
								"eventsPending": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventsPending"
									}
								},
								"scheduleRequest": {
									"$ref": "#/definitions/Schedule"
								}
							}
						},
						"SchedulerRequestError": {
							"type": "object",
							"properties": {
								"requestError": {
									"$ref": "#/definitions/RequestError"
								}
							}
						}
					}
				},
			},
			"documentation": {
				"release": "Release: V1",
				"readme": "# soajs.test Test Express Service for Patch, Head, and others"
			}
		};
		service.createCatalog(data, (response) => {
			assert.ok(response);
			done();
		});
	});
	
	it("call createCatalog - success old catalog different version tag", function (done) {
		sinon.stub(utils, 'generateSchemas').callsFake(function fakeFn(data, cb) {
			return cb();
		});
		let data = {
			"oldCatalog": {
				type: "micro1",
				name: "marketplace",
				configuration: {
					subType: "lion",
					group: "Example",
					port:4991,
					requestTimeout:30,
					requestTimeoutRenewal: 5
				},
				versions: [
					{
						version: "1",
						extKeyRequired: true,
						urac: true,
						urac_Profile: false,
						urac_ACL: false,
						urac_Config: false,
						urac_GroupConfig: false,
						tenant_Profile: false,
						provision_ACL: false,
						oauth: true,
						interConnect: [
							{
								name: "dashboard",
								version: "1"
							},
							{
								name: "infra",
								version: "1"
							},
							{
								name: "repository",
								version: "1"
							},
							{
								name: "console",
								version: "1"
							},
							{
								name: "multitenant",
								version: "1"
							}
						],
						maintenance: {
							readiness: "/heartbeat",
							port: {
								type: "maintenance"
							},
							commands: [
								{
									label: "Reload Registry",
									path: "/reloadRegistry",
									icon: "fas fa-undo"
								},
								{
									label: "Resource Info",
									path: "/resourceInfo",
									icon: "fas fa-info"
								}
							]
						},
						"tags": ["1", "1.5"],
						apis: [
							{
								l: "This API lists the items matching certain keywords from soajs catalog only.",
								v: "/soajs/items",
								m: "get",
								group: "SOAJS"
							}
						]
					}
				],
				description: "loliod",
			},
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.test",
				"tag": "1"
			},
			"soa": {
				"name": "micro1",
				"group": "Example",
				"subType": "lion",
				"port": 4991,
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
				"interConnect": [{
					"name": "example2"
				}],
				"tab": {
					"main": "main",
					"sub" : "sub"
				},
				"tags": ["tag1"],
				"program": ["program1"],
				"attributes": {
					"attrib": "1"
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
				},
				"profile": {"info": "stuff"}
			},
			"apiList" :{
				"type": "swagger",
				"schema": {
					"swagger": "2.0",
					"info": {
						"version": "1908.0001",
						"title": "calendar"
					},
					"host": "",
					"basePath": "/calendar",
					"tags": [
						{
							"name": "calendar"
						}
					],
					"paths": {
						"/v1/domain": {
							"post": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Creates a domain",
								"operationId": "createDomain",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"in": "body",
										"name": "body",
										"description": "Domain to be added",
										"required": false,
										"schema": {
											"$ref": "#/definitions/Create Domain Message"
										}
									}
								],
								"responses": {
									"200": {
										"description": "OK"
									},
									"412": {
										"description": "Domain already exists.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/health": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Returns health status of server.",
								"operationId": "healthCheck",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "apiVersion",
										"in": "path",
										"description": "v1|v2",
										"required": true,
										"type": "string",
										"default": "v2"
									},
									{
										"name": "checkInterfaces",
										"in": "query",
										"description": "Check Interfaces",
										"required": false,
										"type": "array",
										"items": {
											"type": "boolean",
											"default": true
										},
										"collectionFormat": "multi"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"$ref": "#/definitions/Health Check Message"
										}
									},
									"400": {
										"description": "Not healthy",
										"schema": {
											"$ref": "#/definitions/Health Check Message"
										}
									}
								}
							}
						},
						"/v1/schedules": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Returns a list of Scheduler Requests based upon the filter criteria.",
								"operationId": "searchScheduleRequests",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "domain",
										"in": "query",
										"description": "Schedule domain.",
										"required": false,
										"type": "string"
									},
									{
										"name": "scheduleId",
										"in": "query",
										"description": "Schedule identifier",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "scheduleName",
										"in": "query",
										"description": "Schedule name",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "userId",
										"in": "query",
										"description": "Schedule User id of creator",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "status",
										"in": "query",
										"description": "Schedule status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "createDateTime",
										"in": "query",
										"description": "Creation date and time (yyyy-MM-dd'T'HH:mm:ssZ)",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "optimizerStatus",
										"in": "query",
										"description": "Optimizer status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "domainData",
										"in": "query",
										"description": "Domain data (Ex: name:value)",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "eventData",
										"in": "query",
										"description": "Event data (Ex : name:value)",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"type": "array",
											"items": {
												"$ref": "#/definitions/Schedule"
											}
										}
									},
									"400": {
										"description": "Invalid query scheduler details request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"404": {
										"description": "No records found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/schedules/scheduleDetails": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Returns a list of Scheduler details based upon the filter criteria.",
								"operationId": "searchScheduleRequestDetails",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "domain",
										"in": "query",
										"description": "Schedule domain.",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.scheduleId",
										"in": "query",
										"description": "Schedule identifier",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.scheduleName",
										"in": "query",
										"description": "Schedule name",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.userId",
										"in": "query",
										"description": "SCheduler creator User id of ",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.status",
										"in": "query",
										"description": "Schedule status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.createDateTime",
										"in": "query",
										"description": "Creation date and time (<low date>[,<hi date>])",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.optimizerStatus",
										"in": "query",
										"description": "Optimizer status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.approvalUserId",
										"in": "query",
										"description": "Request Approval user id",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.approvalStatus",
										"in": "query",
										"description": "Request Approval status",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "request.approvalType",
										"in": "query",
										"description": "Request Approval type",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "startTime",
										"in": "query",
										"description": "Start time <low>,<high>",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "finishTime",
										"in": "query",
										"description": "Finish time <low>,<high>",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "maxSchedules",
										"in": "query",
										"description": "Maximum number of schedules to return",
										"required": false,
										"type": "integer",
										"format": "int32"
									},
									{
										"name": "lastScheduleId",
										"in": "query",
										"description": "Return schedules > lastScheduleId",
										"required": false,
										"type": "string"
									},
									{
										"name": "dd",
										"in": "query",
										"description": "Domain data name:Value dd=name:value",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									},
									{
										"name": "ed",
										"in": "query",
										"description": "Event data name:Value ed=name:value",
										"required": false,
										"type": "array",
										"items": {
											"type": "string"
										},
										"collectionFormat": "multi"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"type": "array",
											"items": {
												"$ref": "#/definitions/ScheduleEventMessage"
											}
										}
									},
									"400": {
										"description": "Invalid query scheduler details request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"404": {
										"description": "No records found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/schedules/{scheduleId}": {
							"get": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Retrieves a schedule request for scheduleId",
								"operationId": "getScheduleRequestInfo",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule info being retrieved.",
										"required": true,
										"type": "string"
									}
								],
								"responses": {
									"200": {
										"description": "OK",
										"schema": {
											"$ref": "#/definitions/Schedule"
										}
									},
									"404": {
										"description": "No record found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							},
							"post": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Creates a schedule request for scheduleId",
								"operationId": "createScheduleRequest",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule request being created.",
										"required": true,
										"type": "string"
									},
									{
										"in": "body",
										"name": "body",
										"description": "Data for creating a schedule request for the given schedule id",
										"required": false,
										"schema": {
											"$ref": "#/definitions/Schedule Message"
										}
									}
								],
								"responses": {
									"202": {
										"description": "Schedule request accepted."
									},
									"400": {
										"description": "Invalid schedule create request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"412": {
										"description": "Schedule request already exists for this schedule id.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							},
							"delete": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Deletes a schedule requests for scheduleId",
								"operationId": "deleteScheduleRequest",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule request being deleted.",
										"required": true,
										"type": "string"
									}
								],
								"responses": {
									"204": {
										"description": "Delete successful"
									},
									"404": {
										"description": "No record found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						},
						"/v1/schedules/{scheduleId}/approvals": {
							"post": {
								"tags": [
									"calendar"
								],
								"summary": "",
								"description": "Adds an accept/reject approval status to the schedule request identified by scheduleId",
								"operationId": "approveScheduleRequest",
								"produces": [
									"application/json"
								],
								"parameters": [
									{
										"name": "scheduleId",
										"in": "path",
										"description": "Schedule id to uniquely identify the schedule request being accepted or rejected.",
										"required": true,
										"type": "string"
									},
									{
										"in": "body",
										"name": "body",
										"description": "Accept or reject approval message",
										"required": false,
										"schema": {
											"$ref": "#/definitions/ApprovalMessage"
										}
									}
								],
								"responses": {
									"200": {
										"description": "OK"
									},
									"400": {
										"description": "Invalid schedule approval/reject request.",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									},
									"404": {
										"description": "No record found"
									},
									"500": {
										"description": "Unexpected Runtime error",
										"schema": {
											"$ref": "#/definitions/SchedulerRequestError"
										}
									}
								}
							}
						}
					},
					"definitions": {
						"ApprovalMessage": {
							"type": "object",
							"required": [
								"approvalStatus",
								"approvalType",
								"approvalUserId"
							],
							"properties": {
								"approvalUserId": {
									"type": "string",
									"description": "User Id- ATTUID of the approving user"
								},
								"approvalStatus": {
									"type": "string",
									"description": "Approval status ",
									"enum": [
										"Accepted",
										"Rejected"
									]
								},
								"approvalType": {
									"type": "string",
									"description": "Approval Type",
									"enum": [
										"Tier 2"
									]
								}
							}
						},
						"ApprovalType": {
							"type": "object",
							"properties": {
								"id": {
									"type": "integer",
									"format": "int64"
								},
								"approvalCount": {
									"type": "integer",
									"format": "int32"
								},
								"approvalType": {
									"type": "string"
								},
								"domain": {
									"type": "string"
								},
								"scheduleApprovals": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/ScheduleApproval"
									}
								}
							}
						},
						"Create Domain Message": {
							"type": "object",
							"required": [
								"domain"
							],
							"properties": {
								"domain": {
									"type": "string",
									"description": "Domain name"
								}
							},
							"description": "Event definition for schedule creation"
						},
						"DomainData": {
							"type": "object",
							"properties": {
								"name": {
									"type": "string"
								},
								"value": {
									"type": "string"
								}
							}
						},
						"Event": {
							"type": "object",
							"properties": {
								"eventText": {
									"type": "string"
								},
								"eventTime": {
									"type": "string"
								},
								"recurEndTime": {
									"type": "string"
								},
								"reminder": {
									"type": "integer",
									"format": "int64"
								},
								"status": {
									"type": "string"
								},
								"statusMessage": {
									"type": "string"
								},
								"rrule": {
									"type": "string"
								},
								"timeSensitive": {
									"type": "boolean"
								},
								"eventData": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventData"
									}
								},
								"eventsPending": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventsPending"
									}
								}
							}
						},
						"EventData": {
							"type": "object",
							"properties": {
								"name": {
									"type": "string"
								},
								"value": {
									"type": "string"
								}
							}
						},
						"EventsPending": {
							"type": "object",
							"properties": {
								"id": {
									"type": "string"
								},
								"dispatchTime": {
									"type": "integer",
									"format": "int64"
								},
								"eventTime": {
									"type": "integer",
									"format": "int64"
								},
								"eventsId": {
									"type": "string"
								},
								"status": {
									"type": "string"
								},
								"eventTimeString": {
									"type": "string"
								},
								"dispatchTimeString": {
									"type": "string"
								}
							}
						},
						"Health Check Component": {
							"type": "object",
							"properties": {
								"name": {
									"type": "string",
									"description": "Componnent/interface name",
									"enum": [
										"Database",
										"DMaaPMR"
									]
								},
								"url": {
									"type": "string",
									"description": "URL representing component/interface"
								},
								"status": {
									"type": "string",
									"description": "'OK' or error status message"
								},
								"healthy": {
									"type": "boolean",
									"description": "Component health"
								}
							},
							"description": "Health of a single component of the instance"
						},
						"Health Check Message": {
							"type": "object",
							"properties": {
								"healthy": {
									"type": "boolean",
									"description": "Overall health of instance. false if even one component reports not healthy."
								},
								"buildInfo": {
									"type": "string",
									"description": "Build info (docker image name)"
								},
								"currentTime": {
									"type": "string",
									"description": "Current time on the instance."
								},
								"hostname": {
									"type": "string",
									"description": "Hostname (in k8s = pod name)"
								},
								"components": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/Health Check Component"
									}
								}
							},
							"description": "Returns status of calendar service instance"
						},
						"RequestError": {
							"type": "object",
							"properties": {
								"messageId": {
									"type": "string"
								},
								"text": {
									"type": "string"
								},
								"variables": {
									"type": "array",
									"items": {
										"type": "string"
									}
								}
							}
						},
						"Schedule": {
							"type": "object",
							"properties": {
								"id": {
									"type": "string"
								},
								"createDateTime": {
									"type": "string",
									"description": "Date/time of schedule creation"
								},
								"deleteDateTime": {
									"type": "string",
									"description": "Date/time of schedule deletion"
								},
								"globalRrule": {
									"type": "string",
									"description": "Global recurrence rule. Applies to all events unless a local RRULE is defined"
								},
								"globalRecurEndTime": {
									"type": "string",
									"description": "End time for global recurrance rule"
								},
								"optimizerDateTime": {
									"type": "string"
								},
								"optimizerReturnDateTime": {
									"type": "string"
								},
								"scheduleId": {
									"type": "string",
									"description": "Unique identifier of the schedule (UUID)"
								},
								"scheduleName": {
									"type": "string",
									"description": "User provided name for the schedule."
								},
								"status": {
									"type": "string",
									"description": "Status of the schedule.",
									"enum": [
										"PendingSchedule",
										"ScheduleFailed",
										"OptimizationInProgress",
										"PendingApproval",
										"OptimizationFailed",
										"Accepted",
										"Rejected",
										"Scheduled",
										"PublishingEvents",
										"PublishedEvents",
										"Completed",
										"CompletedWithError",
										"Deleted",
										"Cancelled"
									]
								},
								"userId": {
									"type": "string",
									"description": "ATTUID of the scheduler creator."
								},
								"domainData": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/DomainData"
									}
								},
								"events": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/Event"
									}
								},
								"scheduleApprovals": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/ScheduleApproval"
									}
								},
								"domain": {
									"type": "string"
								}
							}
						},
						"Schedule Event Message": {
							"type": "object",
							"required": [
								"eventJson",
								"eventTime"
							],
							"properties": {
								"eventJson": {
									"type": "object",
									"description": "Application provided JSON object which is pubvlished as eventData in the DMaaP event"
								},
								"eventTime": {
									"type": "string",
									"description": "Date/time of the event. (The first occurance in the case of a recurring event.)"
								},
								"recurEndTime": {
									"type": "string",
									"description": "Recurring events - date/time to end recurring event"
								},
								"reminder": {
									"type": "integer",
									"format": "int64",
									"description": "Reminder time, in seconds. Seconds subtracted from the event time to calculate actual publish time to account for the DMaaP latency."
								},
								"timeSensitive": {
									"type": "boolean",
									"description": "Time sensitive event.If true, Calendar will not publish event and update it to 'Past Due' if the event time has passed. Defaults to false which will not check for 'Past Due' events before publishing."
								},
								"rrule": {
									"type": "string",
									"description": "Event RRULE (RFC 5545) overrides the global RRULE in the schedule, if any"
								},
								"eventData": {
									"type": "array",
									"description": "Event metadata. These attributes may be used in query API and/or referenced in the eventText as ${eventdata.name}",
									"items": {
										"$ref": "#/definitions/EventData"
									}
								}
							},
							"description": "Event definition for schedule creation"
						},
						"Schedule Message": {
							"type": "object",
							"required": [
								"domain",
								"scheduleId",
								"userId"
							],
							"properties": {
								"domain": {
									"type": "string",
									"description": "Domain - Identifies the client application",
									"enum": [
										"ChangeManagement",
										"CLAMP",
										"POLO"
									]
								},
								"scheduleId": {
									"type": "string",
									"description": "Unique identifier of the schedule (UUID)"
								},
								"scheduleName": {
									"type": "string",
									"description": "User provided name of the scheduler, defaults to the scheduleId"
								},
								"userId": {
									"type": "string",
									"description": "Id of the user creating teh schedule"
								},
								"domainData": {
									"type": "array",
									"description": "Domain metadata - list of name/values ",
									"items": {
										"$ref": "#/definitions/DomainData"
									}
								},
								"globalRrule": {
									"type": "string",
									"description": "Global RRULE (RFC 5545) applied to all events in the schedule. Mutually exclusive of Event RRULE"
								},
								"scheduleInfo": {
									"type": "string"
								},
								"events": {
									"type": "array",
									"description": "Events provided by client or generated by optimizer.",
									"items": {
										"$ref": "#/definitions/Schedule Event Message"
									}
								}
							},
							"description": "Request for schedule creation"
						},
						"ScheduleApproval": {
							"type": "object",
							"properties": {
								"id": {
									"type": "integer",
									"format": "int64"
								},
								"approvalDateTime": {
									"type": "integer"
								},
								"status": {
									"type": "string"
								},
								"userId": {
									"type": "string"
								},
								"approvalType": {
									"$ref": "#/definitions/ApprovalType"
								}
							}
						},
						"ScheduleEventMessage": {
							"type": "object",
							"properties": {
								"eventText": {
									"type": "string"
								},
								"eventTime": {
									"type": "string"
								},
								"recurEndTime": {
									"type": "string"
								},
								"reminder": {
									"type": "integer",
									"format": "int64"
								},
								"status": {
									"type": "string"
								},
								"statusMessage": {
									"type": "string"
								},
								"rrule": {
									"type": "string"
								},
								"timeSensitive": {
									"type": "boolean"
								},
								"eventData": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventData"
									}
								},
								"eventsPending": {
									"type": "array",
									"items": {
										"$ref": "#/definitions/EventsPending"
									}
								},
								"scheduleRequest": {
									"$ref": "#/definitions/Schedule"
								}
							}
						},
						"SchedulerRequestError": {
							"type": "object",
							"properties": {
								"requestError": {
									"$ref": "#/definitions/RequestError"
								}
							}
						}
					}
				},
			},
			"documentation": {
				"release": "Release: V1",
				"readme": "# soajs.test Test Express Service for Patch, Head, and others"
			}
		};
		service.createCatalog(data, (response) => {
			assert.ok(response);
			done();
		});
	});
	
	it("call createCatalog - success apiList schema", function (done) {
		sinon.stub(utils, 'generateSchemas').callsFake(function fakeFn(data, cb) {
			return cb();
		});
		let data = {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.test",
				"branch": "dev"
			},
			"soa": {
				"name": "micro1",
				"group": "Example",
				"subType": "lion",
				"port": 4991,
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
				"interConnect": [{
					"name": "example2"
				}],
				"tab": {
					"main": "main",
					"sub" : "sub"
				},
				"tags": ["tag1"],
				"program": ["program1"],
				"attributes": {
					"attrib": "1"
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
				},
				"profile": {"info": "stuff"}
			},
			"apiList" :{
				"type": "schema",
				"schema": {
				
				},
			},
			"documentation": {
				"release": "Release: V1",
				"readme": "# soajs.test Test Express Service for Patch, Head, and others"
			}
		};
		service.createCatalog(data, (response) => {
			assert.ok(response);
			done();
		});
	});
	
	it("call checkCanUpdate - success false", function (done) {
		let data = {
			"oldCatalog": {
				"src": {
					"provider": "github",
					"owner": "test",
					"repo": "soajs.test",
					"tag": "1"
				},
			},
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.test",
				"tag": "1"
			}
		};
		service.checkCanUpdate(data, (res) => {
			assert.ok(!res);
			done();
		});
	});
	
	it("call checkCanUpdate - success true", function (done) {
		let data = {
			"oldCatalog": {
				"src": {
					"provider": "github",
					"owner": "test",
					"repo": "soajs.test",
					"tag": "1"
				},
			},
			"src": {
				"provider": "github",
				"owner": "notfound",
				"repo": "soajs.test",
				"tag": "1"
			}
		};
		service.checkCanUpdate(data, (res) => {
			assert.ok(res);
			done();
		});
	});
	
	it("call checkCanUpdate - success true", function (done) {
		let data = {
			"oldCatalog": {
				"src": {
					"provider": "github",
					"owner": "test",
					"repo": "soajs.test",
					"tag": "1"
				},
			},
			"src": {
				"provider": "bitbucket",
				"owner": "notfound",
				"repo": "soajs.test",
				"tag": "1"
			}
		};
		service.checkCanUpdate(data, (res) => {
			assert.ok(res);
			done();
		});
	});
});