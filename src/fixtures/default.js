export default [
	{
		"title": "Default tutorial",
		"pages": [
			{
				"url": "/demo/",
				"steps": [
					{
						"type": "click",
						"target": "input[name='name']",
						"description": "Clique no campo"
					},
					{
						"type": "keypress",
						"target": "input[name='name']",
						"description": "Digite algo"
					},
					{
						"type": "click",
						"target": "[name='record']",
						"description": "Agora clica nesse esquema"
					},
					{
						"type": "click",
						"target": ".next-page",
						"description": "Vai pra próxima página"
					}
				]
			},
			{
				"url": "/demo/index-2.html",
				"steps": [
					{
						"type": "click",
						"target": ".walkthrough-steps",
						"description": "Clica aqui pra terminar"
					}
				]
			}
		]
	}
];