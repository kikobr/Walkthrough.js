export default class EventManager {
	constructor (walkthrough = false) {
		this.walkthrough = walkthrough;
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