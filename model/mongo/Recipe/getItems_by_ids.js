/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

const colName = "catalogs";
const async = require('async');

module.exports = (Recipe) => {
	Recipe.prototype.getItems_by_ids = function (data, cb) {
		let __self = this;
		if (!data || !data.ids || data.ids.length === 0) {
			let error = new Error("Recipe: ids is required.");
			return cb(error, null);
		}
		let condition = {};

		let _ids = [];
		async.each(data.ids, function (id, callback) {
			__self.validateId(id, (err, _id) => {
				if (err) {
					return callback(err);
				}
				_ids.push(_id);
				return callback();
			});
		}, function (error) {
			if (error) {
				return cb(error);
			}
			condition = {_id: {$in: _ids}};
			__self.mongoCore.find(colName, condition, {"sort": {"name": 1}}, (err, items) => {
				if (err) {
					return cb(err);
				}
				return cb(null, items);
			});
		});
	};
};
