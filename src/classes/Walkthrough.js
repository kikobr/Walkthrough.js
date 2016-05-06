/*
*	TODO: Instead of using this.getStep() everytime and do recalculations everytime,
*	try to store currentStep as a class property, for fast retrieval. 
*
*	TODO: Inside onStepElementEnter, if the element was removed by
*	frontend, try to wait until element is available to trigger it on.
**/
import Logger from './Logger';

export default class Walkthrough {
	constructor(args) {
		this.logger = new Logger({ enabled: args.log, prefix: 'Walkthrough' });
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
			this.logger.log('Walkthrough reloaded');
		}

		this.walkthroughManager = walkthroughManager;
		this.title = walkthrough.title;
		this.steps = walkthrough.steps;
		this.autoreset = walkthrough.autoreset || false;
		this.options = walkthrough.options;

		/*
		*	If walkthrough is autoreset = true, clear all steps. When we get the current step on the next
		*	block (current step is the first !done step that matches current page), the previous steps will
		*	be set to true. This way, we can always restart the walkthrough from the beginning but also jump
		*	to the middle of it if the user navigated to advanced steps.
		**/
		if(this.autoreset){
			for(let step of this.steps){
				step.done = false;
			}
		}

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
			this.logger.log('The current step is', currentStep);
			let currentStepElement = document.querySelector(currentStep.target);
			this.onStepElementEnter();
		}
	}

	saveLS () {
		if(!window.localStorage) return;
		window.localStorage.setItem(this.walkthroughManager.localStorageKey, JSON.stringify({
			title: this.title,
			steps: this.steps,
			autoreset: this.autoreset,
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

		let hasDynamicMatch = false;

		for (let [index, step] of this.steps.entries()){

			// only return as currentStep those that are not done
			if(step.done) continue;

			let exactMatch = false,
				dynamicMatch = false;

			// comparing the two urls is safer without final '/' 
			if (step.url.replace(/\/$/, '') == window.location.pathname.replace(/\/$/, '')) {
				exactMatch = true;
			} 
			/*	
			*	If step.url didn't match exactly the page url, and it contains a '*', 
			*	it'll match any url that starts with what's before step.url's '*'.
			*
			*	hasDynamicMatch will allow only the first dynamic match to be returned as currentStep.
			**/
			else if(!hasDynamicMatch && step.url.match(/\*/g)){
				let regex = new RegExp("^" + step.url.replace('*', '').replace(/\/$/, ''));
				if(window.location.pathname.replace(/\/$/, '').match(regex)){
					dynamicMatch = true;
					hasDynamicMatch = true;	
				}
			} 

			/*
			*	dynamicMatchs dont break the loop. This will give a chance for all steps to be
			*	exactly matched, and the first one that does will break the loop.
			*/
			if(exactMatch || dynamicMatch) {
				prevStep = this.steps[index-1] || false;
				currentStep = step;
				nextStep = this.steps[index+1] || false;
				if(exactMatch) break;
			}
		}
		this.logger.log('Current step:', currentStep);
		if(position == 'prev') step = prevStep;
		else if(position == 'current') step = currentStep;
		else if(position == 'next') step = nextStep;
		return step;
	}

	onStepElementEnter (step = null) {
		let currentStep = step || this.getStep();
		if(!currentStep) return;
		let	currentStepElement = document.querySelector(currentStep.target);
		
		/*
			If the step element is not available, im assuming it's dynamic and is yet to be
			rendered to the DOM. So, we'll wait for a timeout to wait it appear.
		*/
		if(!currentStepElement){
			let time = 0,
				timeout = 5000;
			let elementShowedUp = () => {
				currentStepElement.setAttribute('data-walkthrough-step-target', currentStep.target);
				this.walkthroughManager.onStepElementEnter(currentStepElement, currentStep);
				clearInterval(waitUntilElementShowsUp);
			}
			let waitUntilElementShowsUp = setInterval(()=>{
				currentStepElement = document.querySelector(currentStep.target);
				time += 100;
				if(currentStepElement) elementShowedUp();
				else if(time >= timeout) clearInterval(waitUntilElementShowsUp);
			}, 100);
		} else {
			currentStepElement.setAttribute('data-walkthrough-step-target', currentStep.target);
			this.walkthroughManager.onStepElementEnter(currentStepElement, currentStep);
		}
	}

	onStepElementLeave (step = null) {
		let currentStep = step || this.getStep();
		if(!currentStep) return;
		let currentStepElement = document.querySelector(currentStep.target);
		currentStepElement.removeAttribute('data-walkthrough-step-target');
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
			this.logger.log('Done:', currentStep);
			this.onStepElementLeave();
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
			this.onStepElementEnter();

			this.logger.log('The current step is', currentStep);
		}
	}

	finish (){
		// it's walkthrough's last step and it's finished
		this.logger.log('Last step finished');
		this.removeLS();
		this.walkthroughManager.onFinish(this.title);

		this.logger.log('Finished walkthrough');
	}
}