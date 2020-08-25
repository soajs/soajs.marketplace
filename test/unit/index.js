/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";
const imported = require("../data/import.js");

describe("Starting Unit test", () => {
	
	before((done) => {
		let rootPath = process.cwd();
		imported.runPath(rootPath + "/test/data/soajs_profile.js", rootPath + "/test/data/unit/", true, null, (err, msg) => {
			if (err) {
				console.log(err);
			}
			if (msg) {
				console.log(msg);
			}
			done();
		});
	});
	
	it("Unit test for BL", (done) => {
		require("./bl/deploy.js");
		require("./bl/marketplace.js");
		require("./bl/recipe.js");

		require("./bl/lib/redeploy.js");
		require("./bl/lib/cd.js");
		require("./bl/lib/deploy.js");
		done();
	});

	it("Unit test for driver", (done) => {
		require("./driver/config/index.js");
		require("./driver/custom/index.js");
		require("./driver/daemon/index.js");
		require("./driver/resource/index.js");
		require("./driver/soajs/index.js");
		require("./driver/service/index.js");
		require("./driver/static/index.js");
		done();
	});

	it("Unit test for lib", (done) => {
		require("./lib/sdk.js");
		done();
	});

	it("Unit test for Model", (done) => {
		require("./model/mongo/marketplace.js");
		require("./model/mongo/recipe.js");
		done();
	});
	it("Unit test for utils", (done) => {
		require("./utils/index.js");
		done();
	});
	
	after((done) => {
		done();
	});
	
});