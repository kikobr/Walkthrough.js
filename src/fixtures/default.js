export default [
	{
		"title": "Default tutorial",
		"steps": [
			{
				"url": "/demo/",
				"type": "click",
				"target": "input[name='name']",
				"description": "Clique no campo"
			},
			{
				"url": "/demo/",
				"type": "keypress",
				"target": "input[name='name']",
				"description": "Digite algo"
			},
			{
				"url": "/demo/",
				"type": "click",
				"target": "[name='record']",
				"description": "Agora clica nesse esquema"
			},
			{
				"url": "/demo/",
				"type": "click",
				"target": ".next-page",
				"description": "Vai pra próxima página"
			},
			{
				"url": "/demo/index-2.html",
				"type": "click",
				"target": ".walkthrough-steps",
				"description": "Clica aqui pra terminar"
			}
		]
	}
];