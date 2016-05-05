/*
*	TODO: Instead of using this.getStep() everytime and do recalculations everytime,
*	try to store currentStep as a class property, for fast retrieval. 
*
*	TODO: Inside onStepElementEnter, if the element was removed by
*	frontend, try to wait until element is available to trigger it on.
**/

export default class Walkthrough {
	constructor() {
	}

	load (walkthroughManager, walkthrough) {

		/*
		*	If this.walkthroughManager is present, it means this class is already instantiated 
		*	inside walkthroughManager... So, before loading the new walkthrough object, we need to
		*	clear it, fire off events on inputs and remove it from localstorage.
		**/
		if(this.walkthroughManager){
			// remove from current walkthrough from LS
			this.removeLS();
			// reset elements
			let currentStep = this.getStep();
			if(currentStep){
				let	currentStepElement = document.querySelector(currentStep.target);
				this.walkthroughManager.onStepElementLeave(currentStepElement, currentStep);
			}
			console.log('[Walkthrough.js:Walkthrough] Walkthrough reloaded');
		}

		this.walkthroughManager = walkthroughManager;
		this.title = walkthrough.title;
		this.steps = walkthrough.steps;
		this.options = walkthrough.options;

		/*
		* 	If there are steps before the current one in the walkthrough object, it means the user 
		*	already did the previous steps OR the user simply jumped in the middle of the walkthrough.
		*	In either cases, we must assume previous steps as done, every single one of them.
		**/
		let prevStep = this.getStep('prev'),
			currentStep = this.getStep();
		if(prevStep){
			for(let step of this.steps){
				if(step == currentStep) { break; }
				step.done = true;
			}
		}

		// add to localStorage
		this.saveLS();

		if(currentStep) {
			console.log('[Walkthrough.js:Walkthrough] The current step is', currentStep);
			let currentStepElement = document.querySelector(currentStep.target);
			this.onStepElementEnter();
			currentStepElement.setAttribute('data-walkthrough-step-target', currentStep.target);
		}
	}

	saveLS () {
		if(!window.localStorage) return;
		window.localStorage.setItem(this.walkthroughManager.localStorageKey, JSON.stringify({
			title: this.title,
			steps: this.steps,
			options: this.options,
		}));
	}

	removeLS () {
		if(!window.localStorage) return;
		window.localStorage.removeItem(this.walkthroughManager.localStorageKey);
	}

	// methods

	getStep (position = 'current') {
		let currentStep = null,
			prevStep = null,
			nextStep = null,
			step = null;

		for (let [index, step] of this.steps.entries()){
			let isCurrentUrl;
			// if step.url contains a '*' , it means it'll be available to any routes
			// after it. So, in these cases, use a match at the beginning of the url
			if(step.url.match(/\*/g)){
				let regex = new RegExp("^" + step.url.replace('*', '').replace(/\/$/, ''));
				isCurrentUrl = window.location.pathname.replace(/\/$/, '').match(regex);
			} else {
				// comparing the two urls is safer without final '/' 
				isCurrentUrl = step.url.replace(/\/$/, '') == window.location.pathname.replace(/\/$/, '');
			}

			if(isCurrentUrl && !step.done) {
				prevStep = this.steps[index-1] || false;
				currentStep = step;
				nextStep = this.steps[index+1] || false;
				break;
			}
		}
		if(position == 'prev') step = prevStep;
		else if(position == 'current') step = currentStep;
		else if(position == 'next') step = nextStep;
		return step;
	}

	onStepElementEnter (step = null) {
		let currentStep = step || this.getStep();
		if(!currentStep) return;
		let	currentStepElement = document.querySelector(currentStep.target);
		this.walkthroughManager.onStepElementEnter(currentStepElement, currentStep);
	}

	onStepElementLeave (step = null) {
		let currentStep = step || this.getStep();
		if(!currentStep) return;
		let currentStepElement = document.querySelector(currentStep.target);
		this.walkthroughManager.onStepElementLeave(currentStepElement, currentStep);
	}

	triggerEvent (evt) {
		let currentStep = this.getStep();
		if(!currentStep) return false;

		let currentStepElement = document.querySelector(currentStep.target);

		/*
		*	Here, we are setting and getting data-attributes because it's the most reliable way
		*	to identify if the evt.target fired really matches currentStep.target's selector.
		*
		*	Also, if the frontend is using a framework that re-renders dom tree and eliminates
		*	evt.target element, we will still be able to identify the clicked element selector
		*	and check if it matches our currentStep.target. It will allow us to move forward to
		*	the next step, even if the element was removed in the frontend.
		**/

		if(	
			evt.type == currentStep.type &&
			(
				evt.target.getAttribute('data-walkthrough-step-target') == currentStep.target ||
				evt.target == currentStepElement ||
				currentStepElement.contains(evt.target)
			)
		){			
			console.log('[Walkthrough.js:Walkthrough] Done:', currentStep);
			this.onStepElementLeave();
			currentStepElement.removeAttribute('data-walkthrough-step-target');
			currentStep.done = true;
			this.saveLS();

			// if it's last step of the walkthrough
			if(this.steps.indexOf(currentStep) == this.steps.length - 1 ){
				// done
				return this.finish();
			}

			// new current step

			currentStep = this.getStep();
			if(!currentStep) return;
			currentStepElement = document.querySelector(currentStep.target);
			currentStepElement.setAttribute('data-walkthrough-step-target', currentStep.target);
			this.onStepElementEnter();

			console.log('[Walkthrough.js:Walkthrough] The current step is', currentStep);
		}
	}

	finish (){
		// it's walkthrough's last step and it's finished
		console.log('[Walkthrough.js:Walkthrough] Last step finished');
		this.removeLS();
		this.walkthroughManager.onFinish(this.title);

		console.log('[Walkthrough.js:Walkthrough] Finished walkthrough');
	}
}