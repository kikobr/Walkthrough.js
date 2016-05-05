import Walkthrough from './Walkthrough';
import EventManager from './EventManager';

export default class WalkthroughManager {
	
	constructor(args = {}) {
		this.walkthroughs = args.walkthroughs || [];
		this.localStorageKey = args.localStorageKey || "walkthrough-current";
		this.className = args.className || "walkthrough-current";
		this.renderTo = args.renderTo || "body";
		// this.onStepElementEnter = args.onStepElementEnter || function (el, step) { el.classList.add(this.className); };
		// this.onStepElementLeave = args.onStepElementLeave || function (el, step) { el.classList.remove(this.className); };
		this.onFinish = args.onFinish || function (walkthroughName) {};
		this.currentWalkthrough = new Walkthrough();
		this.onStepElementEnter = (el, step) => {
			el.classList.add(this.className);
			typeof args.onStepElementEnter == 'function' ? args.onStepElementEnter.call(this, el, step) : '';
		}
		this.onStepElementLeave = (el, step) => {
			el.classList.remove(this.className);
			typeof args.onStepElementLeave == 'function' ? args.onStepElementLeave.call(this, el, step) : '';
		}

		this.load(this.walkthroughs);
		this.render();
		this.eventManager = new EventManager();

		this.recoverLS();
	}

	recoverLS () {
		if(!window.localStorage) return;
		let recoveredWalkthrough = JSON.parse(window.localStorage.getItem(this.localStorageKey));
		recoveredWalkthrough ? this.start(recoveredWalkthrough) : '';
	}
	
	load (walkthroughs = []) {
		this.walkthroughs = [];
		walkthroughs.forEach(walkthrough => {
			// add to availableWalkthroughs if matches it's pages url
			for (let page of walkthrough.pages) {
				// comparing the two urls is safer without final / 
				if(page.url.replace(/\/$/, '')  == window.location.pathname.replace(/\/$/, '') ){
					walkthrough.available = true;
					break;
				}
			}
			this.walkthroughs.push(walkthrough);
		});
	}

	// methods

	render () {
		let walkthroughs = '';
		this.walkthroughs.forEach((walkthrough, index) =>{
			let playButton = walkthrough.available ? ` <button data-index="${index}">Play</button>` : '';
			walkthroughs += `<li>${walkthrough.title}${playButton}</li>`;
		});
		let template = `<ul data-walkthroughs>${walkthroughs}</ul>`;
		let div = document.createElement('div');
		div.innerHTML = template;
		document.querySelector(this.renderTo).appendChild(div);
		// Set listeners to start walkthroughs on click
		let walkthroughPlayElements = document.querySelectorAll('[data-walkthroughs] [data-index]');
		if( walkthroughPlayElements.length ){
			for(let i = 0; i < walkthroughPlayElements.length; i ++){
				let walkthroughPlayElement = walkthroughPlayElements[i];
				walkthroughPlayElement.addEventListener('click', evt => {
					let walkthrough = this.walkthroughs[evt.target.getAttribute('data-index')];
					this.start(walkthrough);
				});
			}
		}
	}

	start (walkthrough) {
		console.log(`Starting ${walkthrough.title}!`);
		walkthrough.active = true;
		let clonedWalkthrough = JSON.parse(JSON.stringify(walkthrough));
		this.currentWalkthrough.load(this, clonedWalkthrough);
		this.eventManager.walkthrough = this.currentWalkthrough;
	}

}