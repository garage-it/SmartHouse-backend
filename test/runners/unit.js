'use strict';

require('babel-register');

const
    path = require('path'),
    load = require('../load');

const SRC_PATH = path.resolve(__dirname, '../../src');
const TEST_PATTERN = '.test.js';

load(SRC_PATH, TEST_PATTERN);
