import Logger from './Logger';

export default class EventManager {
	constructor (args) {

		this.logger = new Logger({ enabled: args.log, prefix: 'EventManager' });

		this.availableEvents = [
			'click',
			'submit',
			'keypress'
		];

		for( let evt of this.availableEvents ) {
			document.addEventListener(evt, this.triggerWalkthrough.bind(this));
		}
	}
	triggerWalkthrough (evt) {
		if(!this.walkthrough) return;
		this.walkthrough.triggerEvent(evt);
	}
}