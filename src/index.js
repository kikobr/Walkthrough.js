'use strict';

import WalkthroughManager from './classes/WalkthroughManager'

// im copying unique-selector because of error
// ParseError: 'import' and 'export' may appear only with 'sourceType: module'
import unique from './unique-selector/src/index';

window.unique = unique;

window.WalkthroughManager = WalkthroughManager;