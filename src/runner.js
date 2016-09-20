/* istanbul ignore next */
var fs = require('fs');
/* istanbul ignore next */
var path = require('path');

/* istanbul ignore next */
var babelrc = fs.readFileSync(path.resolve(__dirname, '../.babelrc'));
/* istanbul ignore next */
var config;
try {
    /* istanbul ignore next */
    config = JSON.parse(babelrc);
} catch (err) {
    /* eslint-disable *//* istanbul ignore next */
    console.error('==> ERROR: Error parsing babelrc');
    /* istanbul ignore next */
    console.error(err);
    /* eslint-enable */
}
/* istanbul ignore next */
require('babel-core/register')(config);
/* istanbul ignore next */
require('./index.js');
