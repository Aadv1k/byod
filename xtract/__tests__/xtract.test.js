'use strict';

const xtract = require('..');
const assert = require('assert').strict;

assert.strictEqual(xtract(), 'Hello from xtract');
console.info('xtract tests passed');
