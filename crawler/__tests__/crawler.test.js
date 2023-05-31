'use strict';

const crawler = require('..');
const assert = require('assert').strict;

assert.strictEqual(crawler(), 'Hello from crawler');
console.info('crawler tests passed');
