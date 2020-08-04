"use strict";


module.exports = {
	"static_1": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.static",
				"branch": "master"
			},
			"soa": {
				"name": "static",
				"group": "static",
				"version": "1",
				"description": "description is description",
				"documentation": {
					"readme": "README.md",
					"release": "RELEASE.md"
				},
				"tags": ["tag1"],
				"program": ["program1"],
				"attributes": {
					"attrib": "1"
				},
				"tab": {
					"main" : "mainTab",
					"sub" : "subtab"
				},
			},
			"documentation": {
				"release": "Release: V1",
				"readme": "# soajs.static Express Service for Patch, Head, and others"
			}
		}
	},
	"static_1_2": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.static",
				"branch": "dev"
			},
			"soa": {
				"name": "static",
				"group": "static",
				"version": "2",
				"description": "description is description",
				"documentation": {
					"readme": "README.md",
					"release": "RELEASE.md"
				}
			},
			"documentation": {
				"release": "Release: V2",
				"readme": "# soajs.static static Express Service for Patch, Head, and others"
			}
		}
	},
	"static_1_3": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.static",
				"branch": "stg"
			},
			"soa": {
				"name": "static",
				"group": "static",
				"version": "2",
				"description": "description is description",
				"documentation": {
					"readme": "README.md",
					"release": "RELEASE.md"
				}
			},
			"documentation": {
				"release": "Release: V2",
				"readme": "# soajs.static static Express Service for Patch, Head, and others"
			}
		}
	},
	"static_2": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.hkl",
				"tag": "1"
			},
			"soa": {
				"name": "hkl",
				"group": "hkl",
				"version": "1",
				"description": "description is description",
				"documentation": {
					"readme": "README.md",
					"release": "RELEASE.md"
				},
				"subType": "war",
				"profile": {
					"explosion": true
				},
				"tags": ["tag1"],
				"program": ["program1"],
				"attributes": {
					"attrib": "1"
				},
				"tab": {
					"main" : "mainTab",
					"sub" : "subtab"
				},
			},
			"documentation": {
				"release": "Release: V1",
				"readme": "# soajs.static Express Service for Patch, Head, and others"
			}
		}
	},
	"static_2_2": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.hkl",
				"tag": "2"
			},
			"soa": {
				"name": "hkl",
				"group": "hkl",
				"version": "2",
				"description": "description is description",
				"documentation": {
					"readme": "README.md",
					"release": "RELEASE.md"
				},
				"subType": "war",
				"profile": {
					"explosion": true
				},
			},
			"documentation": {
				"release": "Release: V2",
				"readme": "# soajs.static static Express Service for Patch, Head, and others"
			}
		}
	},
	"static_2_3": {
		"item": {
			"src": {
				"provider": "github",
				"owner": "test",
				"repo": "soajs.hkl",
				"tag": "3"
			},
			"soa": {
				"name": "hkl",
				"group": "hkl",
				"version": "2",
				"description": "description is description",
				"documentation": {
					"readme": "README.md",
					"release": "RELEASE.md"
				},
				"subType": "war",
				"profile": {
					"explosion": true
				},
			},
			"documentation": {
				"release": "Release: V2",
				"readme": "# soajs.static static Express Service for Patch, Head, and others"
			}
		}
	}
};