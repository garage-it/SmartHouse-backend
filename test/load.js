'use strict';

const
    glob = require('glob'),
    path = require('path');

const TESTS_PATTERN = '/**/*.test.js';

module.exports = function load(sourceDir) {
    require('./config');
    const SOURCE_TESTS_PATTERN = path.join(sourceDir, TESTS_PATTERN);
    glob.sync(SOURCE_TESTS_PATTERN).forEach(spec => require(spec));
};