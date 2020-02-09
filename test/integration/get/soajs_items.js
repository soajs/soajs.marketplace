"use strict";
const assert = require('assert');
const requester = require('../requester');
//let core = require('soajs').core;
//let validator = new core.validator.Validator();
//let listUsersSchema = require("../schemas/getUsers.js");

describe("Testing API: GET /soajs/items", () => {

    before(function (done) {
        done();
    });

    afterEach((done) => {
        console.log("=======================================");
        done();
    });

    it("Success - will return soajs items", (done) => {
        let params = {
            qs: {
                "limit": 10,
                "start": 0
            }
        };
        requester('/soajs/items', 'get', params, (error, body) => {
            assert.ok(body);
            assert.ok(body.data.records.length > 0);
            let id_array = [];
            for (let i = 0; i < body.data.records.length; i++) {
                id_array.push(body.data.records[i]._id);
            }
            assert.deepEqual(id_array.includes('5db1f85be9253564357b303e'), true);
            
            //let check = validator.validate(body, listUsersSchema);
            //assert.deepEqual(check.valid, true);
            //assert.deepEqual(check.errors, []);
	        
            done();
        });
    });
    
});