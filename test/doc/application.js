let application = {
	
	// the same soa info
	
	"items": [
		{
			"name": "ClusterRole",
			"type": "service | mdaemon | daemon | resource | custom | static | ",
			"subType": "soajs",
			"recipes": [
				{
					"type": "item_soajs | item_native | native",
					"recipe": {
						"apiVersion": "rbac.authorization.k8s.io/v1",
						"kind": "ClusterRole",
						"metadata": {
							"name": "system:aggregated-metrics-reader",
							"labels": {
								"rbac.authorization.k8s.io/aggregate-to-view": "true",
								"rbac.authorization.k8s.io/aggregate-to-edit": "true",
								"rbac.authorization.k8s.io/aggregate-to-admin": "true"
							}
						},
						"rules": [
							{
								"apiGroups": [
									"metrics.k8s.io"
								],
								"resources": [
									"pods",
									"nodes"
								],
								"verbs": [
									"get",
									"list",
									"{{TONY}}",
									"watch"
								]
							}
						]
					}
				}
			]
		},
		{
			"type": "$ref/item",
			"item" :{
				"id": "88888888888"
			},
			"recipes": [
				{
					"type": "item_soajs | item_native | native",
					"recipe": {
						"apiVersion": "rbac.authorization.k8s.io/v1",
						"kind": "ClusterRole",
						"metadata": {
							"name": "system:aggregated-metrics-reader",
							"labels": {
								"rbac.authorization.k8s.io/aggregate-to-view": "true",
								"rbac.authorization.k8s.io/aggregate-to-edit": "true",
								"rbac.authorization.k8s.io/aggregate-to-admin": "true"
							}
						},
						"rules": [
							{
								"apiGroups": [
									"metrics.k8s.io"
								],
								"resources": [
									"pods",
									"nodes"
								],
								"verbs": [
									"get",
									"list",
									"{{TONY}}",
									"watch"
								]
							}
						]
					}
				}
			]
		}
	]
};