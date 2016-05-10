# Walkthrough.js
A javascript only plugin to create guided tours and walkthroughs inside your web application.

## Get started
Include script
```html
<script type="text/javascript" src="dist/walkthrough.min.js"></script>
```

Instantiate WalkthroughManager with some Walkthrough objects
```javascript
var walkthroughManager = new WalkthroughManager({
    "walkthroughs": [
        {
        	"name": "first-walkthrough",
        	"label": "The very first walkthrough of my life",
        	"steps": [
        	    {
        	        "url": "/index.html",
        			"type": "click",
        			"target": ".div .walkthrough-1",
        			"description": "Click here",
        			"options": { "color": "red" }
        	    }
            ]
        }
	]
});

And start the Walkthrough you want
walkthroughManager.start('first-walkthrough');
```
___

## API
Walkthrough.js is really easy to use and versatile. It is compound of some basic Objects that you can customize:

### WalkthroughManager
This is the main class you'll instantiate to control the plugin. The manager is what holds all of the walkthroughs registered and controls them. It accepts an object with the following properties:
```javascript
new WalkthroughManager({
    renderTo: String 'body', // renders a list of the available walkthroughs inside given selector
    log: Boolean false, // wheter the plugin will log activities to the console
    className: String 'walkthrough-current', // the class name that will be set to the next step's element in the current walkthrough.
    localStorageKey: String 'walkthrough-current', // the key that will be used to store the current walkthrough (the one that's being played) in localStorage.
    walkthroughs: Array [], // a list of Walkthrough Objects to be loaded
    onStepElementEnter: Function function(Node el, Object step){
        // this callback is called when the next step is available, it contains step element's dom node and
        // the step itself as an Object
    },
    onStepElementLeave: Function function(Node el, Object step){
        // this callback is called when the current step is done, it contains step element's dom node and
        // the step itself as an Object
    },
    onFinish: Function function(String walkthroughName){
        // this callback gets called when a walkthrough gets finished (all steps done)
    },
});
```
#### WalkthroughManager Methods
```javascript
// Start a walkthrough by it's name or passing direct as an Object.
walkthroughManager.start(String || Object walkthrough);
```

```javascript
// Loads a new set of walkthroughs to the manager.
walkthroughManager.load(Array walkthroughs);
```
___

### Walkthrough
This is the main object of the plugin. Each history or sequence of steps you want your users to complete is considered a walkthrough here. To create a walkthrough, we need to define it's properties and steps. A Walkthrough Object may have the following properties:

```javascript
walkthrough = {
    name: String "walkthrough-name", // unique name for the walkthrough. this will be used to call walkthroughManager.start(walkthroughName)
	label: String "The very first walkthrough of my life", // a title to be used when rendering
	autoreset: Boolean false, // wheter the walkthrough must restart steps if it's completed and navigated away
	steps: Array [], // a list of steps to be performed inside the walkthrough
};
```

### Step
Each walkthrough is compound by one or more steps. Each step describes where it should happen, what's the event expected and on which element.

```javascript
step = {
    url: String "/index.html", // the page where the step may appear. you can pass a * "/subdirectory/*" to match all subsequent segments
    type: String "click", // what event is needed for the step to be done
    target: String ".div .walkthrough-1", // a UNIQUE selector of the element that will receive the event described.
    description: String "Click here", // a simple text to describe it, passed to onStepElementEnter / onStepElementLeave.
    options: Object {}, // a set of custom options passed to onStepElementEnter / onStepElementLeave.
    done: Boolean false, // wheter the step is done or not
}
```
___

### Bônus: integrating Bootstrap tooltips:
```javascript
var walkthroughManager = new WalkthroughManager({
	"renderTo": false,
	"walkthroughs": [
		{
			"name": "first-walk",
			"label": "Create first walk",
			"steps": [
				{
					"url": "/index.html",
					"type": "click",
					"target": ".test-1",
					"description": "Click here",
					"options": { "placement": "right" }
				},
				{
					"url": "/index-2.html",
					"type": "click",
					"target": ".test-2",
					"description": "Now click here",
					"options": { "placement": "top" }
				}
			]
		},
	],
	onStepElementEnter: function(el, step){
		$(el).tooltip({
			placement: step.options.placement,
			trigger: 'manual',
			title: step.description
		}).tooltip('show');
	},
	onStepElementLeave: function(el, step){
		$(el).tooltip('destroy');
	},
	onFinish: function(walkthroughName){
		console.log('Walkthrough finished: ', walkthroughName);
	}
});
```

___


### Contribute
Did you like it? Help me build it and make it yours, too. :)
To run the project on development, install gulp globally, navigate to project folder and run ``` gulp watch ```.

### Beware the beta
This is still a beta, and no support is intended yet. Use it at your own risk.
