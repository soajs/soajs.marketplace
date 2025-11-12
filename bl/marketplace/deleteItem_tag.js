'use strict';

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const { getGroups } = require('../lib/helpers.js');

let bl;

function local(soajs, inputmaskData, options, cb) {
	if (!inputmaskData) {
		return cb(bl.handleError(soajs, 400, null));
	}
	let modelObj = bl.mp.getModel(soajs, options);
	inputmaskData._groups = getGroups(soajs);
	modelObj.getItem(inputmaskData, (err, response) => {
		if (err) {
			return cb(bl.handleError(soajs, 602, err));
		}
		if (!response) {
			return cb(bl.handleError(soajs, 501, null));
		}
		if (response.locked) {
			return cb(bl.handleError(soajs, 502, null));
		}
		let index;
		for (let i = 0; i < response.versions.length; i++) {
			if (response.versions[i].tags) {
				index = response.versions[i].tags.indexOf(inputmaskData.tag);
				if (index > -1) {
					response.versions[i].tags.splice(index, 1);
					if (response.versions[i].tags.length === 0 && (!response.versions[i].branches || response.versions[i].branches.length === 0)) {
						response.versions.splice(i, 1);
					}
					break;
				}
			} else {
				index = -1;
			}
		}
		if (index < 0) {
			return cb(bl.handleError(soajs, 404, null));
		}
		let opts = {
			versions: response.versions,
			name: response.name,
			type: response.type
		};
		modelObj.deleteItem_version(opts, (err) => {
			bl.mp.closeModel(soajs, modelObj);
			if (err) {
				return cb(bl.handleError(soajs, 602, err));
			}
			return cb(null, true);
		});
	});
}

module.exports = function(_bl) {
	bl = _bl;
	return local;
};
