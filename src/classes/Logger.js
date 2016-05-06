export default class Logger {
	constructor (args) {
		this.enabled = args.enabled || false;
		this.prefix = args.prefix || '';
	}
	log (msg, ...additional) {
		this.enabled ? console.log(`[${this.prefix}] ${msg}`, ...additional) : '';
	}
	error (msg, ...additional) {
		this.enabled ? console.log(`[${this.prefix}] ${msg}`, ...additional) : '';
	}
}