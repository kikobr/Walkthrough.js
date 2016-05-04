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
			console.log('Walkthrough reloaded');
		}

		this.walkthroughManager = walkthroughManager;
		this.title = walkthrough.title;
		this.pages = walkthrough.pages;
		this.options = walkthrough.options;

		/*
		* 	If there are pages before the current one in the walkthrough object, it means the user 
		*	already did the previous steps OR the user simply jumped in the middle of the walkthrough.
		*	In either cases, we must assume previous steps as done, every single one of them.
		**/
		let prevPage = this.getPage('prev');
		if(prevPage){
			let currentPage = this.getPage();
			for(let page of this.pages){
				if(page.url == currentPage.url) {
					break;
					// return false;
				}
				page.steps.forEach(step => { step.done = true; }); // reset
			}
		}

		// add to localStorage
		this.saveLS();

		let currentStep = this.getStep(),
			currentStepElement = document.querySelector(currentStep.target);
		if(currentStep) {
			console.log('The current step is', currentStep);
			this.onStepElementEnter();
			currentStepElement.setAttribute('data-walkthrough-step-target', currentStep.target);
		}
		// console.log(this.getStep());
	}

	saveLS () {
		if(!window.localStorage) return;
		window.localStorage.setItem(this.walkthroughManager.localStorageKey, JSON.stringify({
			title: this.title,
			pages: this.pages,
			options: this.options,
		}));
	}

	removeLS () {
		if(!window.localStorage) return;
		window.localStorage.removeItem(this.walkthroughManager.localStorageKey);
	}

	// methods

	getPage (position = 'current') {
		let currentPage = null,
			prevPage = null,
			nextPage = null,
			page = null;
		for (let [index, page] of this.pages.entries()) {
			if(page.url == window.location.pathname){
				prevPage = this.pages[index-1] || false;
				currentPage = page;
				nextPage = this.pages[index+1] || false;
				break;
			}
		}
		if(position == 'prev') page = prevPage;
		else if(position == 'current') page = currentPage;
		else if(position == 'next') page = nextPage;
		return page;
	}

	getStep (position = 'current') {
		let currentStep = null,
			prevStep = null,
			nextStep = null,
			step = null;
		let steps = this.getPage().steps;
		for (let [index, step] of steps.entries()){
			if(step.done != true){
				prevStep = steps[index-1] || false;
				currentStep = step;
				nextStep = steps[index+1] || false;
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
		let currentPage = this.getPage(),
			currentStep = this.getStep();
		if(!currentPage || !currentStep) return false;

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
			// && (
			// )
		){			
			console.log('done:', currentStep);
			this.onStepElementLeave();
			currentStepElement.removeAttribute('data-walkthrough-step-target');
			currentStep.done = true;
			this.saveLS();

			// new current step

			currentStep = this.getStep();
			currentStepElement = document.querySelector(currentStep.target);
			currentStepElement.setAttribute('data-walkthrough-step-target', currentStep.target);
			this.onStepElementEnter();

			console.log('The current step is', currentStep);
			// if it's last step of page
			if(currentPage.steps.indexOf(currentStep) == currentPage.steps.length - 1 ){
				// done
				this.finishPage();
			}
		}
	}

	finishPage (){
		let finishedPage = this.getPage();
		if(finishedPage == this.pages[this.pages.length - 1]){
			// it's the last page and it's finished
			this.removeLS();
			this.walkthroughManager.onFinish(this.title);
		}
		console.log('finished:', finishedPage);
	}
}