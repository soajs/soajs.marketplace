"use strict";

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const assert = require('assert');
const requester = require('../requester');
const _data = require("./data/recipe.js");

describe("Testing API: PUT /recipe", () => {
	
	before(function (done) {
		done();
	});
	
	afterEach((done) => {
		console.log("=======================================");
		done();
	});
	
	it("Success - update recipe", (done) => {
		let params = {
			body:  {
				catalog : _data[0].catalog
			},
			qs: {
				id: _data[0].id
			}
		};
		requester('/recipe', 'put', params, (error, body) => {
			assert.ifError(error);
			assert.ok(body.data);
			assert.deepStrictEqual(body.data, "Catalog Recipe Successfully updated!");
			done();
		});
	});
});