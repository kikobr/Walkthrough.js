/*
*	TODO: Instead of using this.getStep() everytime and do recalculations everytime,
*	try to store currentStep as a class property, for fast retrieval. 
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

		let currentStep = this.getStep();
		console.log('The current step is', currentStep);
		if(currentStep) this.onStepElementEnter();
		// console.log(this.getStep());
	}

	saveLS () {
		if(!window.localStorage) return;
		window.localStorage.setItem(this.walkthroughManager.localStorageKey, JSON.stringify({
			title: this.title,
			pages: this.pages
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
		if(	evt.type == currentStep.type &&
			evt.target == document.querySelector(currentStep.target)){
			
			console.log('done:', currentStep);
			this.onStepElementLeave();
			currentStep.done = true;
			this.saveLS();
			this.onStepElementEnter();

			console.log('The current step is', this.getStep());
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