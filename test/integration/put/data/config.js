"use strict";


module.exports = {
	"config_1": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.config",
				"branch": "master"
			},
			"soa": {
				"name": "config",
				"group": "config",
				"version": "1",
				"description": "description is description",
				"documentation": {
					"readme": "README.md",
					"release": "RELEASE.md"
				},
				"tags": ["tag1"],
				"programs": "program1",
				"attributes": {
					"attrib": "1"
				}
			},
			"documentation": {
				"release": "Release: V1",
				"readme": "# soajs.config config Express Service for Patch, Head, and others"
			}
		}
	},
	"config_1_2": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.config",
				"branch": "dev"
			},
			"soa": {
				"name": "config",
				"group": "config",
				"version": "2",
				"description": "description is description",
				"documentation": {
					"readme": "README.md",
					"release": "RELEASE.md"
				},
				"tab": {
					"main" : "maintab",
					"sub" : "subtab"
				},
				"tags": ["tag1"],
				"program": ["program1"],
				"attributes": {
					"attrib": "1"
				},
				"swaggerFilename": "swagger.json",
			},
			"documentation": {
				"release": "Release: V2",
				"readme": "# soajs.config config Express Service for Patch, Head, and others"
			}
		}
	},
	"config_1_3": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.config",
				"branch": "stg"
			},
			"soa": {
				"name": "config",
				"group": "Example",
				"version": "2",
				"description": "description is description",
				"documentation": {
					"readme": "README.md",
					"release": "RELEASE.md"
				},
			},
			"documentation": {
				"release": "Release: V12",
				"readme": "# soajs.config config Express Service for Patch, Head, and others"
			}
		}
	},
	"config_2": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.configuration",
				"tag": "1"
			},
			"soa": {
				"name": "configuration",
				"group": "configuration",
				"version": "1",
				"description": "description is description",
				"documentation": {
					"readme": "README.md",
					"release": "RELEASE.md"
				},
				"tags": ["tag1"],
				"programs": "program1",
				"attributes": {
					"attrib": "1"
				}
			},
			"documentation": {
				"release": "Release: V1",
				"readme": "# soajs.config config Express Service for Patch, Head, and others"
			}
		}
	},
	"config_2_2": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.configuration",
				"tag": "2"
			},
			"soa": {
				"name": "configuration",
				"group": "configuration",
				"version": "2",
				"description": "description is description",
				"documentation": {
					"readme": "README.md",
					"release": "RELEASE.md"
				},
				"tab": {
					"main" : "maintab",
					"sub" : "subtab"
				},
				"tags": ["tag1"],
				"program": ["program1"],
				"attributes": {
					"attrib": "1"
				},
				"swaggerFilename": "swagger.json",
			},
			"documentation": {
				"release": "Release: V2",
				"readme": "# soajs.config config Express Service for Patch, Head, and others"
			}
		}
	},
	"config_2_3": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.configuration",
				"tag": "3"
			},
			"soa": {
				"name": "configuration",
				"group": "Example",
				"version": "2",
				"description": "description is description",
				"documentation": {
					"readme": "README.md",
					"release": "RELEASE.md"
				},
			},
			"documentation": {
				"release": "Release: V12",
				"readme": "# soajs.config config Express Service for Patch, Head, and others"
			}
		}
	}
};