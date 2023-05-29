'use strict';

const dork = require('..');
const assert = require('assert').strict;

assert.strictEqual(dork(), 'Hello from dork');
console.info('dork tests passed');
