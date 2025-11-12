'use strict';

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

module.exports = {
	"getItems_by_type_subtype": require('./getItems_by_type_subtype.js'),
	"getItems_by_keywords": require('./getItems_by_keywords.js'),
	"getItem_by_source": require('./getItem_by_source.js'),
	"getItem_by_type": require('./getItem_by_type.js'),
	"getItem_by_names": require('./getItem_by_names.js'),
	"updateItem_environments": require('./updateItem_environments.js'),
	"updateItem_recipes": require('./updateItem_recipes.js'),
	"updateItem_acl": require('./updateItem_acl.js'),
	"deleteItem": require('./deleteItem.js'),
	"deleteItem_source": require('./deleteItem_source.js'),
	"update_items_branches": require('./update_items_branches.js'),
	"deleteItem_branch": require('./deleteItem_branch.js'),
	"deleteItem_tag": require('./deleteItem_tag.js'),
	"addItem": require('./addItem.js'),
	"update_item_version_config": require('./update_item_version_config.js'),
	"maintenance": require('./maintenance.js')
};
