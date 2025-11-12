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
	let data = inputmaskData.item;
	let opts = {
		name: data.soa.name,
		type: data.soa.type
	};

	if (data.src.provider !== "manual" && !(data.src.tag || data.src.branch)) {
		bl.mp.closeModel(soajs, modelObj);
		return cb(bl.handleError(soajs, 402, null));
	}
	inputmaskData._groups = getGroups(soajs);
	modelObj.getItem(opts, (err, response) => {
		if (err) {
			bl.mp.closeModel(soajs, modelObj);
			return cb(bl.handleError(soajs, 602, err));
		}
		if (response) {
			data.oldCatalog = response;
		}

		let catalogDriver;
		if (data.soa.type === "service" && data.soa.subType === "soajs") {
			catalogDriver = require(`../../driver/${data.soa.subType}/index.js`);
		} else {
			catalogDriver = require(`../../driver/${data.soa.type}/index.js`);
		}
		catalogDriver.checkCanUpdate(data, (err) => {
			if (err) {
				bl.mp.closeModel(soajs, modelObj);
				return cb(bl.handleError(soajs, 401, err));
			}
			catalogDriver.createCatalog(data, (catalog) => {
				opts = {
					item: catalog
				};
				modelObj.addItem(opts, (err, result) => {
					bl.mp.closeModel(soajs, modelObj);
					if (err) {
						return cb(bl.handleError(soajs, 602, err));
					}
					if (!result || result.n === 0) {
						return cb(bl.handleError(soajs, 500, null));
					}
					return cb(null, response ? "Catalog Entry Successfully updated!" : "Catalog Entry Successfully Added!");
				});
			});
		});
	});
}

module.exports = function(_bl) {
	bl = _bl;
	return local;
};
