/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

'use strict';

let utils = {
	"mapAPis": function (yamlJson, cb) {
		let apiPath = yamlJson.paths;
		let definitions = yamlJson.definitions;
		let globalParams = yamlJson.parameters;
		let commonFields = {};
		let soajsRoute;
		//extract common fields
		if (definitions && (Object.keys(definitions).length > 0 || Object.keys(globalParams).length > 0)) {
			for (let onecommonInput in definitions) {
				if (onecommonInput && definitions[onecommonInput]) {
					commonFields[onecommonInput] = {
						"validation": definitions[onecommonInput]
					};
				}
				
			}
			for (let onecommonInput in globalParams) {
				if (onecommonInput && globalParams[onecommonInput]) {
					let oneInput = globalParams[onecommonInput];
					let tempInput = utils.cloneObj(oneInput);
					let sourcePrefix = tempInput.in;
					let required = tempInput.required;
					let name = tempInput.name;
					if (sourcePrefix === 'path') {
						sourcePrefix = "params";
					}
					if (sourcePrefix === 'header') {
						sourcePrefix = "headers";
					}
					if (sourcePrefix === 'formData') {
						sourcePrefix = "body";
					}
					let inputObj = {
						"required": tempInput.required,
						"source": [sourcePrefix + "." + tempInput.name],
						"validation": {}
					};
					delete tempInput.required;
					delete tempInput.in;
					delete tempInput.name;
					delete tempInput.description;
					delete tempInput.collectionFormat; //todo: need to provide support for this later on
					let common = onecommonInput;
					commonFields[onecommonInput] = {
						"required": required,
						"source": [sourcePrefix + "." + name],
						"validation": {}
					};
					utils.extractValidation(commonFields, oneInput, tempInput, inputObj, common);
				}
			}
			utils.populateCommonFields(commonFields);
		}
		
		//extract the methods
		let all_methods = [];
		let all_errors = {};
		let globalResponses = yamlJson.responses;
		let responses = {};
		
		for (let oneResponse in globalResponses) {
			if (oneResponse && globalParams[oneResponse]) {
				responses[oneResponse.toLowerCase()] = {
					"description": globalResponses[oneResponse].description
				};
			}
		}
		for (let route in apiPath) {
			if (route && apiPath[route]) {
				let methods = Object.keys(apiPath[route]);
				for(let i = 0; i < methods.length; i++) {
					if (methods[i] && all_methods.indexOf(methods[i].toLowerCase()) === -1) {
						all_methods.push(methods[i].toLowerCase());
					}
					
					//collect the error codes while at it
					if (apiPath[route][methods[i]].responses && Object.keys(apiPath[route][methods[i]].responses).length > 0) {
						for (let errorCode in apiPath[route][methods[i]].responses) {
							if (errorCode && apiPath[route][methods[i]].responses[errorCode]) {
								let code = parseInt(errorCode, 10);
								if (!isNaN(code) && code !== 200 && apiPath[route][methods[i]].responses[errorCode].description) {
									all_errors[code] = apiPath[route][methods[i]].responses[errorCode].description;
								} else {
									if (!isNaN(code) && code !== 200) {
										all_errors[code] = responses[apiPath[route][methods[i]].responses[errorCode].$ref.split("/")[2].toLowerCase()].description;
									}
								}
							}
						}
					}
				}
			}
		}
		
		//map the methods
		let all_apis = {};
		all_methods.forEach(function (oneMethod) {
			all_apis[oneMethod] = {};
		});
		utils.injectCommonFields(commonFields, globalParams, all_apis);
		//loop in apis again and map the api routes
		for (let route in apiPath) {
			if (route && apiPath[route]) {
				let methods = Object.keys(apiPath[route]);
				for(let i = 0; i < methods.length; i++) {
					if (apiPath[route][methods[i]]) {
						
						soajsRoute = route.replace(/\{/g, ":").replace(/\}/g, "");
						
						let mwFile = soajsRoute.replace(/\\/g, "_").replace(/:/g, "_").replace(/\//g, "_").replace(/[_]{2,}/g, "_");
						mwFile = mwFile.toLowerCase();
						if (mwFile[0] === "_") {
							mwFile = mwFile.substring(1);
						}
						mwFile += "_" + methods[i].toLowerCase() + ".js";
						
						all_apis[methods[i].toLowerCase()][soajsRoute] = {
							"_apiInfo": {
								"l": apiPath[route][methods[i]].summary || "__empty__",
								"group": (apiPath[route][methods[i]].tags) ? apiPath[route][methods[i]].tags[0] : "__empty__"
							},
							"mw": '%dirname% + "/lib/mw/' + mwFile + '"',
							"imfv": {
								"custom": {},
								"commonFields": []
							}
						};
					}
					
					//map the parameters
					if (apiPath[route][methods[i]].parameters && apiPath[route][methods[i]].parameters.length > 0) {
						for (let input in apiPath[route][methods[i]].parameters) {
							if (input && apiPath[route][methods[i]].parameters[input]) {
								let oneInput = apiPath[route][methods[i]].parameters[input];
								if (oneInput.$ref) {
									let oneInputName = oneInput.$ref.split("/");
									oneInputName = oneInputName[oneInputName.length - 1];
									if (commonFields[oneInputName] && commonFields[oneInputName].source) {
										all_apis[methods[i].toLowerCase()][soajsRoute].imfv.commonFields.push(oneInputName);
									}
								} else if (oneInput.schema && oneInput.schema.$ref) {
									let oneInputName = oneInput.schema.$ref.split("/");
									oneInputName = oneInputName[oneInputName.length - 1];
									if (commonFields[oneInputName] && commonFields[oneInputName].source) {
										all_apis[methods[i].toLowerCase()][soajsRoute].imfv.commonFields.push(oneInputName);
									}
								} else if (oneInput.schema && oneInput.schema.items && oneInput.schema.items.$ref && oneInput.schema.type === "array") {
									let oneInputName = oneInput.schema.items.$ref.split("/");
									oneInputName = oneInputName[oneInputName.length - 1];
									if (commonFields[oneInputName] && commonFields[oneInputName].source) {
										all_apis[methods[i].toLowerCase()][soajsRoute].imfv.commonFields.push({
											"type": "array",
											"items": oneInputName
										});
									}
								} else if (Object.keys(oneInput).length > 2) {
									let tempInput = utils.cloneObj(oneInput);
									let sourcePrefix = tempInput.in;
									if (sourcePrefix === 'path') {
										sourcePrefix = "params";
									}
									if (sourcePrefix === 'header') {
										sourcePrefix = "headers";
									}
									if (sourcePrefix === 'formData') {
										sourcePrefix = "body";
									}
									let inputObj = {
										"required": tempInput.required,
										"source": [sourcePrefix + "." + tempInput.name],
										"validation": {}
									};
									delete tempInput.required;
									delete tempInput.in;
									delete tempInput.name;
									delete tempInput.description;
									delete tempInput.collectionFormat; //todo: need to provide support for this later on
									
									utils.extractValidation(commonFields, oneInput, tempInput, inputObj);
									all_apis[methods[i].toLowerCase()][soajsRoute].imfv.custom[oneInput.name] = inputObj;
								}
							}
						}
						
						if (all_apis[methods[i].toLowerCase()][soajsRoute].imfv.commonFields.length === 0) {
							delete all_apis[methods[i].toLowerCase()][soajsRoute].imfv.commonFields;
						}
						if (Object.keys(all_apis[methods[i].toLowerCase()][soajsRoute].imfv.custom).length === 0) {
							delete all_apis[methods[i].toLowerCase()][soajsRoute].imfv.custom;
						}
					}
				}
			}
		}
		
		return cb({"schema": all_apis, "errors": all_errors});
	},
	"cloneObj": function (obj) {
		if (typeof obj !== "object" || obj === null) {
			return obj;
		}
		
		if (obj instanceof Date) {
			return new Date(obj.getTime());
		}
		
		if (obj instanceof RegExp) {
			return new RegExp(obj);
		}
		
		if (obj instanceof Array && Object.keys(obj).every(function (k) {
			return !isNaN(k);
		})) {
			return obj.slice(0);
		}
		let _obj = {};
		for (let attr in obj) {
			if (Object.hasOwnProperty.call(obj, attr)) {
				_obj[attr] = utils.cloneObj(obj[attr]);
			}
		}
		return _obj;
	},
	"validateJSON": function (yamlJson) {
		if (!yamlJson.paths || Object.keys(yamlJson.paths).length === 0) {
			throw new Error("JSON file is missing api schema");
		}
		
		//loop in path
		for (let onePath in yamlJson.paths) {
			//loop in methods
			if (onePath && yamlJson.paths[onePath]) {
				for (let oneMethod in yamlJson.paths[onePath]) {
					if (oneMethod && yamlJson.paths[onePath][oneMethod]) {
						if (!yamlJson.paths[onePath][oneMethod].summary || yamlJson.paths[onePath][oneMethod].summary === "") {
							if (yamlJson.paths[onePath][oneMethod].description && yamlJson.paths[onePath][oneMethod].description !== "") {
								yamlJson.paths[onePath][oneMethod].summary = yamlJson.paths[onePath][oneMethod].description;
							} else {
								yamlJson.paths[onePath][oneMethod].summary = "No summary [please add one]";
							}
						}
					}
				}
			}
		}
	},
	"generateFiles": function (fileObj, cb) {
		//loop on all files and write them
		let data = JSON.stringify(utils.cloneObj(fileObj.data), null, 2);
		//if tokens, replace all occurences with corresponding values
		if (fileObj.tokens) {
			for (let i in fileObj.tokens) {
				if (i && fileObj.tokens[i]) {
					let regexp = new RegExp("%" + i + "%", "g");
					data = data.replace(regexp, fileObj.tokens[i]);
				}
			}
		}
		data = data.replace(/("group": "__empty__")/g, '"group": ""');
		data = data.replace(/("prefix": "(\s?|\s+),)/g, '"prefix": "",');
		data = data.replace(/("l": "__empty__")/g, '"l": ""');
		
		data = JSON.parse(data);
		if (data) {
			for (let key in data) {
				if (key && data[key]) {
					for (let subKey in data[key]) {
						if (subKey && data[key][subKey] && data[key][subKey].mv) {
							data[key][subKey].mv = data.replace(/\\"/g, '"').replace(/["]+/g, '"').replace(/"__dirname/g, '__dirname');
						}
					}
				}
			}
		}
		return cb(null, data);
	},
	"extractAPIsList": function (schema) {
		let protocols = ['post', 'get', 'put', 'del', 'delete', 'patch', 'options'];
		let excluded = ['commonFields', 'parameters'];
		let apiList = [];
		let newStyleApi = false;
		for (let route in schema) {
			if (route && Object.hasOwnProperty.call(schema, route)) {
				if (excluded.indexOf(route) !== -1) {
					continue;
				}
				
				if (protocols.indexOf(route) !== -1) {
					newStyleApi = true;
					continue;
				}
				if (schema[route]._apiInfo) {
					let oneApi = {
						'l': schema[route]._apiInfo.l,
						'v': route
					};
					
					if (schema[route]._apiInfo.group) {
						oneApi.group = schema[route]._apiInfo.group;
					}
					
					if (schema[route]._apiInfo.groupMain) {
						oneApi.groupMain = schema[route]._apiInfo.groupMain;
					}
					apiList.push(oneApi);
				}
			}
		}
		
		if (newStyleApi) {
			for (let protocol in schema) {
				if (protocol && schema[protocol]) {
					if (excluded.indexOf(protocol) !== -1) {
						continue;
					}
					
					for (let route in schema[protocol]) {
						if (route && schema[protocol][route]) {
							let oneApi = {
								'l': schema[protocol][route]._apiInfo.l,
								'v': route,
								'm': protocol
							};
							
							if (schema[protocol][route]._apiInfo.group) {
								oneApi.group = schema[protocol][route]._apiInfo.group;
							}
							
							if (schema[protocol][route]._apiInfo.groupMain) {
								oneApi.groupMain = schema[protocol][route]._apiInfo.groupMain;
							}
							apiList.push(oneApi);
						}
					}
				}
			}
		}
		return apiList;
	},
	"extractValidation": function (commonFields, oneInput, tempInput, inputObj, common) {
		//if param schema is in common field ( used for objects only ) 
		if (oneInput.schema && oneInput.schema.$ref) {
			inputObj.validation = utils.getIMFVfromCommonFields(commonFields, oneInput.schema.$ref);
			if (common) {
				commonFields[common].validation = inputObj.validation;
			}
		}
		//if param is a combination of array and common field
		else if (oneInput.schema && oneInput.schema.type === 'array' && oneInput.schema.items.$ref) {
			inputObj.validation = {
				"type": "array",
				"items": utils.getIMFVfromCommonFields(commonFields, oneInput.schema.items.$ref)
			};
			if (common) {
				commonFields[common].validation = inputObj.validation;
			}
		} else if (oneInput.schema && oneInput.schema.properties && oneInput.schema.properties.items && oneInput.schema.properties.items.type === 'array' && oneInput.schema.properties.items.items.$ref) {
			inputObj.validation = {
				"type": "array",
				"items": utils.getIMFVfromCommonFields(commonFields, oneInput.schema.properties.items.items.$ref)
			};
			if (common) {
				commonFields[common].validation = inputObj.validation;
			}
		}
		//if param is not a common field
		else {
			inputObj.validation = tempInput;
			if (common) {
				commonFields[common].validation = inputObj.validation;
			}
		}
	},
	"getIMFVfromCommonFields": function (commonFields, source) {
		let commonFieldInputName = source.split("/");
		commonFieldInputName = commonFieldInputName[commonFieldInputName.length - 1];
		return commonFields[commonFieldInputName].validation;
	},
	"populateCommonFields": function (commonFields) {
		//loop in all common fields
		for (let oneCommonField in commonFields) {
			if (oneCommonField && commonFields[oneCommonField]) {
				recursiveMapping(commonFields[oneCommonField].validation);
			}
		}
		
		//loop through one common field recursively constructing and populating all its children imfv
		function recursiveMapping(source) {
			if (source.type === 'array') {
				if (source.items.$ref || source.items.type === 'object') {
					source.items = mapSimpleField(source.items);
				} else if (source.items.type === 'object') {
					recursiveMapping(source.items);
				} else {
					mapSimpleField(source);
				}
			} else if (source.type === 'object') {
				for (let property in source.properties) {
					if (property && source.properties[property] && source.properties[property].$ref) {
						source.properties[property] = mapSimpleField(source.properties[property]);
					} else if (source.properties[property].type === 'object' || source.properties[property].type === 'array') {
						recursiveMapping(source.properties[property]);
					}
				}
			} else if (source.schema) {
				if (source.schema.type === 'object') {
					for (let property in source.schema.properties) {
						if (property && source.schema.properties[property] && source.schema.properties[property].$ref) {
							source.schema.properties[property] = mapSimpleField(source.schema.properties[property]);
						}
					}
				}
			} else {
				//map simple inputs if any
				source = mapSimpleField(source);
			}
		}
		
		//if this input is a ref, get the ref and replace it.
		function mapSimpleField(oneField) {
			if (oneField.$ref) {
				return utils.cloneObj(utils.getIMFVfromCommonFields(commonFields, oneField.$ref));
			} else {
				return oneField;
			}
		}
	},
	"injectCommonFields": function (commonFields, globalParams, all_apis) {
		let generatedObject = {};
		for (let i in globalParams) {
			if (i && globalParams[i] && commonFields[i]) {
				generatedObject[i] = commonFields[i];
			}
		}
		if (generatedObject && Object.keys(generatedObject).length > 0) {
			all_apis.commonFields = generatedObject;
		}
	}
};


module.exports = utils;