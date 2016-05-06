(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Logger = require('./Logger');

var _Logger2 = _interopRequireDefault(_Logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventManager = function () {
	function EventManager(args) {
		_classCallCheck(this, EventManager);

		this.logger = new _Logger2.default({ enabled: args.log, prefix: 'EventManager' });

		this.availableEvents = ['click', 'submit', 'keypress'];

		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = this.availableEvents[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var evt = _step.value;

				document.addEventListener(evt, this.triggerWalkthrough.bind(this));
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}
	}

	_createClass(EventManager, [{
		key: 'triggerWalkthrough',
		value: function triggerWalkthrough(evt) {
			if (!this.walkthrough) return;
			this.walkthrough.triggerEvent(evt);
		}
	}]);

	return EventManager;
}();

exports.default = EventManager;

},{"./Logger":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Logger = function () {
	function Logger(args) {
		_classCallCheck(this, Logger);

		this.enabled = args.enabled || false;
		this.prefix = args.prefix || '';
	}

	_createClass(Logger, [{
		key: 'log',
		value: function log(msg) {
			var _console;

			for (var _len = arguments.length, additional = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				additional[_key - 1] = arguments[_key];
			}

			this.enabled ? (_console = console).log.apply(_console, ['[' + this.prefix + '] ' + msg].concat(additional)) : '';
		}
	}, {
		key: 'error',
		value: function error(msg) {
			var _console2;

			for (var _len2 = arguments.length, additional = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
				additional[_key2 - 1] = arguments[_key2];
			}

			this.enabled ? (_console2 = console).log.apply(_console2, ['[' + this.prefix + '] ' + msg].concat(additional)) : '';
		}
	}]);

	return Logger;
}();

exports.default = Logger;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     *	TODO: Instead of using this.getStep() everytime and do recalculations everytime,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     *	try to store currentStep as a class property, for fast retrieval. 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     *	TODO: Inside onStepElementEnter, if the element was removed by
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     *	frontend, try to wait until element is available to trigger it on.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     **/


var _Logger = require('./Logger');

var _Logger2 = _interopRequireDefault(_Logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Walkthrough = function () {
	function Walkthrough(args) {
		_classCallCheck(this, Walkthrough);

		this.logger = new _Logger2.default({ enabled: args.log, prefix: 'Walkthrough' });
	}

	_createClass(Walkthrough, [{
		key: 'load',
		value: function load(walkthroughManager, walkthrough) {

			/*
   *	If this.walkthroughManager is present, it means this class is already instantiated 
   *	inside walkthroughManager... So, before loading the new walkthrough object, we need to
   *	clear it, fire off events on inputs and remove it from localstorage.
   **/
			if (this.walkthroughManager) {
				// remove from current walkthrough from LS
				this.removeLS();
				// reset elements
				var _currentStep = this.getStep();
				if (_currentStep) {
					var currentStepElement = document.querySelector(_currentStep.target);
					this.walkthroughManager.onStepElementLeave(currentStepElement, _currentStep);
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
			if (this.autoreset) {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = this.steps[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var step = _step.value;

						step.done = false;
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}
			}

			/*
   * 	If there are steps before the current one in the walkthrough object, it means the user 
   *	already did the previous steps OR the user simply jumped in the middle of the walkthrough.
   *	In either cases, we must assume previous steps as done, every single one of them.
   **/
			var prevStep = this.getStep('prev'),
			    currentStep = this.getStep();
			if (prevStep) {
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = this.steps[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var _step3 = _step2.value;

						if (_step3 == currentStep) {
							break;
						}
						_step3.done = true;
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}
			}

			// add to localStorage
			this.saveLS();

			if (currentStep) {
				this.logger.log('The current step is', currentStep);
				var _currentStepElement = document.querySelector(currentStep.target);
				this.onStepElementEnter();
			}
		}
	}, {
		key: 'saveLS',
		value: function saveLS() {
			if (!window.localStorage) return;
			window.localStorage.setItem(this.walkthroughManager.localStorageKey, JSON.stringify({
				title: this.title,
				steps: this.steps,
				autoreset: this.autoreset,
				options: this.options
			}));
		}
	}, {
		key: 'removeLS',
		value: function removeLS() {
			if (!window.localStorage) return;
			window.localStorage.removeItem(this.walkthroughManager.localStorageKey);
		}

		// methods

	}, {
		key: 'getStep',
		value: function getStep() {
			var position = arguments.length <= 0 || arguments[0] === undefined ? 'current' : arguments[0];

			var currentStep = null,
			    prevStep = null,
			    nextStep = null,
			    step = null;

			var hasDynamicMatch = false;

			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = this.steps.entries()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion3 = (_step4 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var _step4$value = _slicedToArray(_step4.value, 2);

					var index = _step4$value[0];
					var _step5 = _step4$value[1];


					// only return as currentStep those that are not done
					if (_step5.done) continue;

					var exactMatch = false,
					    dynamicMatch = false;

					// comparing the two urls is safer without final '/'
					if (_step5.url.replace(/\/$/, '') == window.location.pathname.replace(/\/$/, '')) {
						exactMatch = true;
					}
					/*	
     *	If step.url didn't match exactly the page url, and it contains a '*', 
     *	it'll match any url that starts with what's before step.url's '*'.
     *
     *	hasDynamicMatch will allow only the first dynamic match to be returned as currentStep.
     **/
					else if (!hasDynamicMatch && _step5.url.match(/\*/g)) {
							var regex = new RegExp("^" + _step5.url.replace('*', '').replace(/\/$/, ''));
							if (window.location.pathname.replace(/\/$/, '').match(regex)) {
								dynamicMatch = true;
								hasDynamicMatch = true;
							}
						}

					/*
     *	dynamicMatchs dont break the loop. This will give a chance for all steps to be
     *	exactly matched, and the first one that does will break the loop.
     */
					if (exactMatch || dynamicMatch) {
						prevStep = this.steps[index - 1] || false;
						currentStep = _step5;
						nextStep = this.steps[index + 1] || false;
						if (exactMatch) break;
					}
				}
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3.return) {
						_iterator3.return();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}

			this.logger.log('Current step:', currentStep);
			if (position == 'prev') step = prevStep;else if (position == 'current') step = currentStep;else if (position == 'next') step = nextStep;
			return step;
		}
	}, {
		key: 'onStepElementEnter',
		value: function onStepElementEnter() {
			var _this = this;

			var step = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

			var currentStep = step || this.getStep();
			if (!currentStep) return;
			var currentStepElement = document.querySelector(currentStep.target);

			/*
   	If the step element is not available, im assuming it's dynamic and is yet to be
   	rendered to the DOM. So, we'll wait for a timeout to wait it appear.
   */
			if (!currentStepElement) {
				(function () {
					var time = 0,
					    timeout = 5000;
					var elementShowedUp = function elementShowedUp() {
						currentStepElement.setAttribute('data-walkthrough-step-target', currentStep.target);
						_this.walkthroughManager.onStepElementEnter(currentStepElement, currentStep);
						clearInterval(waitUntilElementShowsUp);
					};
					var waitUntilElementShowsUp = setInterval(function () {
						currentStepElement = document.querySelector(currentStep.target);
						time += 100;
						if (currentStepElement) elementShowedUp();else if (time >= timeout) clearInterval(waitUntilElementShowsUp);
					}, 100);
				})();
			} else {
				currentStepElement.setAttribute('data-walkthrough-step-target', currentStep.target);
				this.walkthroughManager.onStepElementEnter(currentStepElement, currentStep);
			}
		}
	}, {
		key: 'onStepElementLeave',
		value: function onStepElementLeave() {
			var step = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

			var currentStep = step || this.getStep();
			if (!currentStep) return;
			var currentStepElement = document.querySelector(currentStep.target);
			currentStepElement.removeAttribute('data-walkthrough-step-target');
			this.walkthroughManager.onStepElementLeave(currentStepElement, currentStep);
		}
	}, {
		key: 'triggerEvent',
		value: function triggerEvent(evt) {
			var currentStep = this.getStep();
			if (!currentStep) return false;

			var currentStepElement = document.querySelector(currentStep.target);

			/*
   *	Here, we are setting and getting data-attributes because it's the most reliable way
   *	to identify if the evt.target fired really matches currentStep.target's selector.
   *
   *	Also, if the frontend is using a framework that re-renders dom tree and eliminates
   *	evt.target element, we will still be able to identify the clicked element selector
   *	and check if it matches our currentStep.target. It will allow us to move forward to
   *	the next step, even if the element was removed in the frontend.
   **/

			if (evt.type == currentStep.type && (evt.target.getAttribute('data-walkthrough-step-target') == currentStep.target || evt.target == currentStepElement || currentStepElement.contains(evt.target))) {
				this.logger.log('Done:', currentStep);
				this.onStepElementLeave();
				currentStep.done = true;
				this.saveLS();

				// if it's last step of the walkthrough
				if (this.steps.indexOf(currentStep) == this.steps.length - 1) {
					// done
					return this.finish();
				}

				// new current step

				currentStep = this.getStep();
				if (!currentStep) return;
				this.onStepElementEnter();

				this.logger.log('The current step is', currentStep);
			}
		}
	}, {
		key: 'finish',
		value: function finish() {
			// it's walkthrough's last step and it's finished
			this.logger.log('Last step finished');
			this.removeLS();
			this.walkthroughManager.onFinish(this.title);

			this.logger.log('Finished walkthrough');
		}
	}]);

	return Walkthrough;
}();

exports.default = Walkthrough;

},{"./Logger":2}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Walkthrough = require('./Walkthrough');

var _Walkthrough2 = _interopRequireDefault(_Walkthrough);

var _EventManager = require('./EventManager');

var _EventManager2 = _interopRequireDefault(_EventManager);

var _Logger = require('./Logger');

var _Logger2 = _interopRequireDefault(_Logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WalkthroughManager = function () {
	function WalkthroughManager() {
		var _this = this;

		var args = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, WalkthroughManager);

		this.walkthroughs = args.walkthroughs || [];
		this.localStorageKey = args.localStorageKey || "walkthrough-current";
		this.className = args.className || "walkthrough-current";
		this.renderTo = args.renderTo || "body";
		this.log = args.log || false;
		this.logger = new _Logger2.default({ enabled: this.log, prefix: 'Manager' });
		// this.onStepElementEnter = args.onStepElementEnter || function (el, step) { el.classList.add(this.className); };
		// this.onStepElementLeave = args.onStepElementLeave || function (el, step) { el.classList.remove(this.className); };
		this.onFinish = args.onFinish || function (walkthroughName) {};
		this.currentWalkthrough = new _Walkthrough2.default({ log: this.log });
		this.onStepElementEnter = function (el, step) {
			el.classList.add(_this.className);
			typeof args.onStepElementEnter == 'function' ? args.onStepElementEnter.call(_this, el, step) : '';
		};
		this.onStepElementLeave = function (el, step) {
			el.classList.remove(_this.className);
			typeof args.onStepElementLeave == 'function' ? args.onStepElementLeave.call(_this, el, step) : '';
		};

		this.load(this.walkthroughs);
		this.render();
		this.eventManager = new _EventManager2.default({ log: this.log });

		this.recoverLS();
	}

	_createClass(WalkthroughManager, [{
		key: 'recoverLS',
		value: function recoverLS() {
			if (!window.localStorage) return;
			var recoveredWalkthrough = JSON.parse(window.localStorage.getItem(this.localStorageKey));
			// check if recovered walkthrough exists inside actual walkthroughs list
			var exists = false;
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.walkthroughs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var walkthrough = _step.value;

					if (walkthrough.title == recoveredWalkthrough.title) {
						exists = true;
						break;
					}
				}
				// if recovered walkthrough dont exist anymore, wipe it from local storage
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			recoveredWalkthrough && exists ? this.start(recoveredWalkthrough) : window.localStorage.removeItem(this.localStorageKey);
		}
	}, {
		key: 'load',
		value: function load() {
			var _this2 = this;

			var walkthroughs = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

			this.walkthroughs = [];
			walkthroughs.forEach(function (walkthrough) {
				// add to availableWalkthroughs if matches it's steps url
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = walkthrough.steps[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var step = _step2.value;

						var isCurrentUrl = void 0;
						// if step.url contains a '*' , it means it'll be available to any routes
						// after it. So, in these cases, use a match at the beginning of the url
						if (step.url.match(/\*/g)) {
							var regex = new RegExp("^" + step.url.replace('*', '').replace(/\/$/, ''));
							isCurrentUrl = window.location.pathname.replace(/\/$/, '').match(regex);
						} else {
							// comparing the two urls is safer without final '/'
							isCurrentUrl = step.url.replace(/\/$/, '') == window.location.pathname.replace(/\/$/, '');
						}
						if (isCurrentUrl) {
							walkthrough.available = true;
							break;
						}
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}

				_this2.walkthroughs.push(walkthrough);
			});
		}

		// methods

	}, {
		key: 'render',
		value: function render() {
			var _this3 = this;

			var walkthroughs = '';
			this.walkthroughs.forEach(function (walkthrough, index) {
				var playButton = walkthrough.available ? ' <button data-index="' + index + '">Play</button>' : '';
				walkthroughs += '<li>' + walkthrough.title + playButton + '</li>';
			});
			var template = '<ul data-walkthroughs>' + walkthroughs + '</ul>';
			var div = document.createElement('div');
			div.innerHTML = template;
			document.querySelector(this.renderTo).appendChild(div);
			// Set listeners to start walkthroughs on click
			var walkthroughPlayElements = document.querySelectorAll('[data-walkthroughs] [data-index]');
			if (walkthroughPlayElements.length) {
				for (var i = 0; i < walkthroughPlayElements.length; i++) {
					var walkthroughPlayElement = walkthroughPlayElements[i];
					walkthroughPlayElement.addEventListener('click', function (evt) {
						var walkthrough = _this3.walkthroughs[evt.target.getAttribute('data-index')];
						_this3.start(walkthrough);
					});
				}
			}
		}
	}, {
		key: 'start',
		value: function start(walkthrough) {
			this.logger.log('Starting ' + walkthrough.title + '!');
			walkthrough.active = true;
			var clonedWalkthrough = JSON.parse(JSON.stringify(walkthrough));
			this.currentWalkthrough.load(this, clonedWalkthrough);
			this.eventManager.walkthrough = this.currentWalkthrough;
		}
	}]);

	return WalkthroughManager;
}();

exports.default = WalkthroughManager;

},{"./EventManager":1,"./Logger":2,"./Walkthrough":3}],5:[function(require,module,exports){
'use strict';

var _WalkthroughManager = require('./classes/WalkthroughManager');

var _WalkthroughManager2 = _interopRequireDefault(_WalkthroughManager);

var _index = require('./unique-selector/src/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.unique = _index2.default;

// im copying unique-selector because of error
// ParseError: 'import' and 'export' may appear only with 'sourceType: module'


window.WalkthroughManager = _WalkthroughManager2.default;

},{"./classes/WalkthroughManager":4,"./unique-selector/src/index":12}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAttributes = getAttributes;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Returns the Attribute selectors of the element
 * @param  { DOM Element } element
 * @param  { Array } array of attributes to ignore
 * @return { Array }
 */
function getAttributes(el) {
  var attributesToIgnore = arguments.length <= 1 || arguments[1] === undefined ? ['id', 'class', 'length'] : arguments[1];
  var attributes = el.attributes;

  var attrs = [].concat(_toConsumableArray(attributes));

  return attrs.reduce(function (sum, next) {
    if (!(attributesToIgnore.indexOf(next.nodeName) > -1)) {
      sum.push('[' + next.nodeName + '="' + next.value + '"]');
    }
    return sum;
  }, []);
}

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClasses = getClasses;
exports.getClassSelectors = getClassSelectors;
/**
 * Get class names for an element
 *
 * @pararm { Element } el
 * @return { Array }
 */
function getClasses(el) {
  var classNames = void 0;

  try {
    classNames = el.classList.toString().split(' ');
  } catch (e) {
    if (!el.hasAttribute('class')) {
      return [];
    }

    var className = el.getAttribute('class');

    // remove duplicate and leading/trailing whitespaces
    className = className.trim().replace(/\s+/g, ' ');

    // split into separate classnames
    classNames = className.split(' ');
  }

  return classNames;
}

/**
 * Returns the Class selectors of the element
 * @param  { Object } element
 * @return { Array }
 */
function getClassSelectors(el) {
  var classList = getClasses(el).filter(Boolean);
  return classList.map(function (cl) {
    return '.' + cl;
  });
}

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getID = getID;
/**
 * Returns the Tag of the element
 * @param  { Object } element
 * @return { String }
 */
function getID(el) {
  return '#' + el.getAttribute('id');
}

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNthChild = getNthChild;

var _isElement = require('./isElement');

/**
 * Returns the selectors based on the position of the element relative to its siblings
 * @param  { Object } element
 * @return { Array }
 */
function getNthChild(element) {
  var counter = 0;
  var k = void 0;
  var sibling = void 0;
  var parentNode = element.parentNode;


  if (Boolean(parentNode)) {
    var childNodes = parentNode.childNodes;

    var len = childNodes.length;
    for (k = 0; k < len; k++) {
      sibling = childNodes[k];
      if ((0, _isElement.isElement)(sibling)) {
        counter++;
        if (sibling === element) {
          return ':nth-child(' + counter + ')';
        }
      }
    }
  }
  return null;
}

},{"./isElement":13}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getParents = getParents;

var _isElement = require('./isElement');

/**
 * Returns all the element and all of its parents
 * @param { DOM Element }
 * @return { Array of DOM elements }
 */
function getParents(el) {
  var parents = [];
  var currentElement = el;
  while ((0, _isElement.isElement)(currentElement)) {
    parents.push(currentElement);
    currentElement = currentElement.parentNode;
  }

  return parents;
}

},{"./isElement":13}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTag = getTag;
/**
 * Returns the Tag of the element
 * @param  { Object } element
 * @return { String }
 */
function getTag(el) {
  return el.tagName.toLowerCase();
}

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = unique;

var _getID = require('./getID');

var _getClasses = require('./getClasses');

var _getAttributes = require('./getAttributes');

var _getNthChild = require('./getNthChild');

var _getTag = require('./getTag');

var _isUnique = require('./isUnique');

var _getParents = require('./getParents');

/**
 * Returns all the selectors of the elmenet
 * @param  { Object } element
 * @return { Object }
 */
function getAllSelectors(el, selectors, attributesToIgnore) {
  var funcs = {
    'Tag': _getTag.getTag,
    'NthChild': _getNthChild.getNthChild,
    'Attributes': function Attributes(elem) {
      return (0, _getAttributes.getAttributes)(elem, attributesToIgnore);
    },
    'Class': _getClasses.getClassSelectors,
    'ID': _getID.getID
  };

  return selectors.reduce(function (res, next) {
    res[next] = funcs[next](el);
    return res;
  }, {});
}

/**
 * Tests uniqueNess of the element inside its parent
 * @param  { Object } element
 * @param { String } Selectors
 * @return { Boolean }
 */
/**
 * Expose `unique`
 */

function testUniqueness(element, selector) {
  var parentNode = element.parentNode;

  var elements = parentNode.querySelectorAll(selector);
  return elements.length === 1 && elements[0] === element;
}

/**
 * Checks all the possible selectors of an element to find one unique and return it
 * @param  { Object } element
 * @param  { Array } items
 * @param  { String } tag
 * @return { String }
 */
function getUniqueCombination(element, items, tag) {
  var combinations = getCombinations(items);
  var uniqCombinations = combinations.filter(testUniqueness.bind(this, element));
  if (uniqCombinations.length) return uniqCombinations[0];

  if (Boolean(tag)) {
    var _combinations = items.map(function (item) {
      return tag + item;
    });
    var _uniqCombinations = _combinations.filter(testUniqueness.bind(this, element));
    if (_uniqCombinations.length) return _uniqCombinations[0];
  }

  return null;
}

/**
 * Returns a uniqueSelector based on the passed options
 * @param  { DOM } element
 * @param  { Array } options
 * @return { String }
 */
function getUniqueSelector(element, selectorTypes, attributesToIgnore) {
  var foundSelector = void 0;

  var elementSelectors = getAllSelectors(element, selectorTypes, attributesToIgnore);

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = selectorTypes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var selectorType = _step.value;
      var ID = elementSelectors.ID;
      var Tag = elementSelectors.Tag;
      var Classes = elementSelectors.Class;
      var Attributes = elementSelectors.Attributes;
      var NthChild = elementSelectors.NthChild;

      switch (selectorType) {
        case 'ID':
          if (Boolean(ID) && testUniqueness(element, ID)) {
            return ID;
          }
          break;

        case 'Tag':
          if (Boolean(Tag) && testUniqueness(element, Tag)) {
            return Tag;
          }
          break;

        case 'Class':
          if (Boolean(Classes) && Classes.length) {
            foundSelector = getUniqueCombination(element, Classes, Tag);
            if (foundSelector) {
              return foundSelector;
            }
          }
          break;

        case 'Attributes':
          if (Boolean(Attributes) && Attributes.length) {
            foundSelector = getUniqueCombination(element, Attributes, Tag);
            if (foundSelector) {
              return foundSelector;
            }
          }
          break;

        case 'NthChild':
          if (Boolean(NthChild)) {
            return NthChild;
          }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return '*';
}

/**
 * Returns all the possible selector compinations
 */
function getCombinations(items) {
  items = items ? items : [];
  var result = [[]];
  var i = void 0,
      j = void 0,
      k = void 0,
      l = void 0,
      ref = void 0,
      ref1 = void 0;

  for (i = k = 0, ref = items.length - 1; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
    for (j = l = 0, ref1 = result.length - 1; 0 <= ref1 ? l <= ref1 : l >= ref1; j = 0 <= ref1 ? ++l : --l) {
      result.push(result[j].concat(items[i]));
    }
  }

  result.shift();
  result = result.sort(function (a, b) {
    return a.length - b.length;
  });
  result = result.map(function (item) {
    return item.join('');
  });

  return result;
}

/**
 * Generate unique CSS selector for given DOM element
 *
 * @param {Element} el
 * @return {String}
 * @api private
 */

function unique(el) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var _options$selectorType = options.selectorTypes;
  var selectorTypes = _options$selectorType === undefined ? ['ID', 'Class', 'Tag', 'NthChild'] : _options$selectorType;
  var _options$attributesTo = options.attributesToIgnore;
  var attributesToIgnore = _options$attributesTo === undefined ? ['id', 'class', 'length'] : _options$attributesTo;

  var allSelectors = [];
  var parents = (0, _getParents.getParents)(el);

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = parents[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var elem = _step2.value;

      var selector = getUniqueSelector(elem, selectorTypes, attributesToIgnore);
      if (Boolean(selector)) {
        allSelectors.push(selector);
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  var selectors = [];
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = allSelectors[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var it = _step3.value;

      selectors.unshift(it);
      var _selector = selectors.join(' > ');
      if ((0, _isUnique.isUnique)(el, _selector)) {
        return _selector;
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  return null;
}

},{"./getAttributes":6,"./getClasses":7,"./getID":8,"./getNthChild":9,"./getParents":10,"./getTag":11,"./isUnique":14}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.isElement = isElement;
/**
 * Determines if the passed el is a DOM element
 */
function isElement(el) {
  var isElem = void 0;

  if ((typeof HTMLElement === 'undefined' ? 'undefined' : _typeof(HTMLElement)) === 'object') {
    isElem = el instanceof HTMLElement;
  } else {
    isElem = !!el && (typeof el === 'undefined' ? 'undefined' : _typeof(el)) === 'object' && el.nodeType === 1 && typeof el.nodeName === 'string';
  }
  return isElem;
}

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isUnique = isUnique;
/**
 * Checks if the selector is unique
 * @param  { Object } element
 * @param  { String } selector
 * @return { Array }
 */
function isUnique(el, selector) {
  if (!Boolean(selector)) return false;
  var elems = el.ownerDocument.querySelectorAll(selector);
  return elems.length === 1 && elems[0] === el;
}

},{}]},{},[5]);
