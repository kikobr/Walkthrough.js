import Walkthrough from './Walkthrough';
import EventManager from './EventManager';
import Logger from './Logger';

export default class WalkthroughManager {
	
	constructor(args = {}) {
		this.walkthroughs = args.walkthroughs || [];
		this.localStorageKey = args.localStorageKey || "walkthrough-current";
		this.className = args.className || "walkthrough-current";
		this.renderTo = args.renderTo || "body";
		this.log = args.log || false;
		this.logger = new Logger({ enabled: this.log, prefix: 'Manager' });
		// this.onStepElementEnter = args.onStepElementEnter || function (el, step) { el.classList.add(this.className); };
		// this.onStepElementLeave = args.onStepElementLeave || function (el, step) { el.classList.remove(this.className); };
		this.onFinish = args.onFinish || function (walkthroughName) {};
		this.currentWalkthrough = new Walkthrough({ log: this.log });
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
		this.eventManager = new EventManager({ log: this.log });

		this.recoverLS();
	}

	recoverLS () {
		if(!window.localStorage) return;
		let recoveredWalkthrough = JSON.parse(window.localStorage.getItem(this.localStorageKey));
		if(!recoveredWalkthrough) return;
		// check if recovered walkthrough exists inside actual walkthroughs list
		let exists = false;
		for(let walkthrough of this.walkthroughs){
			if(walkthrough.name == recoveredWalkthrough.name){
				exists = true;
				break;
			}
		}
		// if recovered walkthrough dont exist anymore, wipe it from local storage 
		recoveredWalkthrough && exists ? this.start(recoveredWalkthrough) : window.localStorage.removeItem(this.localStorageKey);
	}
	
	load (walkthroughs = []) {
		this.walkthroughs = [];
		walkthroughs.forEach(walkthrough => {
			// add to availableWalkthroughs if matches it's steps url
			for (let step of walkthrough.steps) {
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
				if(isCurrentUrl){
					walkthrough.available = true;
					break;
				}
			}
			this.walkthroughs.push(walkthrough);
		});
	}

	// methods

	render () {
		if(!this.renderTo) return;
		
		let walkthroughs = '';
		this.walkthroughs.forEach((walkthrough, index) =>{
			let playButton = walkthrough.available ? ` <button data-index="${index}">Play</button>` : '';
			walkthroughs += `<li>${walkthrough.label}${playButton}</li>`;
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

	start (walkthrough, opts = {}) {
		// also start walkthroughs by name
		if(typeof walkthrough == 'string'){
			for(let walk of this.walkthroughs){
				if(walk.name == walkthrough){
					walkthrough = walk;
					break;
				}
			}
		}
		this.logger.log(`Starting ${walkthrough.name}!`);
		walkthrough.active = true;
		let clonedWalkthrough = JSON.parse(JSON.stringify(walkthrough));
		this.currentWalkthrough.load(this, clonedWalkthrough, { stepEnter: opts.stepEnter == false ? false : true });
		this.eventManager.walkthrough = this.currentWalkthrough;
	}

}