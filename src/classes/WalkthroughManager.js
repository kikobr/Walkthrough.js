import Walkthrough from './Walkthrough';
import EventManager from './EventManager';

export default class WalkthroughManager {
	
	constructor(args = {}) {
		this.walkthroughs = args.walkthroughs || [];
		this.localStorageKey = args.localStorageKey || "walkthrough-current";
		this.className = args.className || "walkthrough-current";
		this.onStepElementEnter = args.onStepElementEnter || function (el, step) { el.classList.add(this.className); };
		this.onStepElementLeave = args.onStepElementLeave || function (el, step) { el.classList.remove(this.className); };
		this.onFinish = args.onFinish || function (walkthroughName) {};
		this.currentWalkthrough = new Walkthrough();

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
				if(page.url == window.location.pathname){
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
		document.body.appendChild(div);
		// Set listeners to start walkthroughs on click
		document.querySelector('[data-walkthroughs] [data-index]').addEventListener('click', evt => {
			let walkthrough = this.walkthroughs[evt.target.getAttribute('data-index')];
			this.start(walkthrough);
		});
	}

	start (walkthrough) {
		console.log(`Starting ${walkthrough.title}!`);
		walkthrough.active = true;
		let clonedWalkthrough = JSON.parse(JSON.stringify(walkthrough));
		this.currentWalkthrough.load(this, clonedWalkthrough);
		this.eventManager.walkthrough = this.currentWalkthrough;
	}

}