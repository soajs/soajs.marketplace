/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";
const imported = require("../data/import.js");
let helper = require("../helper.js");

let service, controller;

describe("starting integration tests", () => {
	
	before((done) => {
		let rootPath = process.cwd();
		imported.runPath(rootPath + "/test/data/soajs_profile.js", rootPath + "/test/data/integration/", true, null, (err, msg) => {
			if (err) {
				console.log(err);
			}
			if (msg) {
				console.log(msg);
			}
			console.log("Starting Controller and Marketplace service");
			controller = require("soajs.controller");
			setTimeout(function () {
				service = helper.requireModule('./index');
				setTimeout(function () {
					done();
				}, 5000);
			}, 5000);
		});
	});
	
	it("loading tests", (done) => {
		require("./get/soajs_items.js");
		done();
	});
	
	it("loading use cases", (done) => {
		done();
	});
});