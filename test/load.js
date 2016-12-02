'use strict';

const
    glob = require('glob'),
    path = require('path');

module.exports = function load(sourceDir, testPattern) {
    require('./config');
    const SOURCE_TESTS_PATTERN = path.join(sourceDir, `/**/*${testPattern}`);
    glob.sync(SOURCE_TESTS_PATTERN).forEach(spec => require(spec));
};