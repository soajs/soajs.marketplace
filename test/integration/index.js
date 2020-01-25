
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
        imported(rootPath + "/test/data/soajs_profile.js", rootPath + "/test/data/integration/", (err, msg) => {
	        if (err) {
		        console.log(err);
	        }
	        if (msg){
		        console.log(msg);
	        }
            console.log("Starting Controller and GIT service");
            controller = require("soajs.controller");
            setTimeout(function () {
	            service = helper.requireModule('./index');
                setTimeout(function () {
                    done();
                }, 5000);
            }, 1000);
        });
    });

    it("loading tests", (done) => {
        done();
    });

    it("loading use cases", (done) => {
        done();
    });
});