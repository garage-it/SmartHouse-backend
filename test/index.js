'use strict';

require('babel-register');

const
    path = require('path'),
    load = require('./load');

const SRC_PATH = path.join(__dirname, '../src');
load(SRC_PATH);