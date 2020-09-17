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


describe("starting integration tests", () => {
	
	let controller, service;
	
	before((done) => {
		let rootPath = process.cwd();
		process.env.SOAJS_IMPORTER_DROPDB = true;
		imported.runPath(rootPath + "/test/data/soajs_profile.js", rootPath + "/test/data/integration/", true, null, (err, msg) => {
			if (err) {
				console.log(err);
			}
			if (msg) {
				console.log(msg);
			}
			console.log("Starting Controller ...");
			controller = require("soajs.controller/_index.js");
			controller.runService(() => {
				console.log("Starting Marketplace ...");
				service = helper.requireModule('./_index.js');
				service.runService(() => {
					setTimeout(function () {
						done();
					}, 5000);
				});
			});
		});
	});
	
	it("loading tests for catalogs", (done) => {
		require("./get/public_items.js");
		require("./get/items.js");
		require("./get/item_type.js");
		require("./get/items_type_all.js");
		require("./get/items_type_name.js");
		require("./get/items_type_names.js");
		require("./get/items_src.js");
		require("./get/items_type.js");
		require("./get/soajs_items.js");
		
		require("./get/item_inspect.js");
		
		require("./put/soajs_item_environments.js");
		require("./put/soajs_item_recipes.js");
		require("./put/soajs_item_acl.js");
		
		require("./put/item_environments.js");
		require("./put/item_recipes.js");
		require("./put/item_acl.js");
		
		require("./put/item_version_configuration.js");
		require("./put/item_branch.js");
		require("./put/item_tag.js");
		
		require("./put/item_maintenance.js");
		require("./put/item_deploy.js");
		require("./put/item_cd.js");
		require("./put/item_deploy_build.js");
		require("./put/item_deploy_configure.js");
		require("./put/item_redeploy.js");
		require("./put/item_deploy.js");

		require("./put/items/item_service_soajs.js");
		
		require("./put/items/item_service.js");
		require("./put/items/item_config.js");
		require("./put/items/item_custom.js");
		require("./put/items/item_resource.js");
		require("./put/items/item_daemon.js");
		require("./put/items/item_static.js");

		require("./delete/item_resource.js");
		require("./delete/items_src.js");
		done();
	});
	
	it("loading tests for recipe catalog", (done) => {
		require("./get/recipe.js");
		require("./get/recipes.js");
		require("./get/recipes_ids.js");
		require("./post/recipe.js");
		require("./put/recipe.js");
		require("./delete/recipe.js");
		done();
	});
	it("loading use cases", (done) => {
		require("./UC1/update_item_acl_restriction.js");
		require("./UC2/item_maintenance.js");
		require("./UC3/item_build.js");
		done();
	});
});