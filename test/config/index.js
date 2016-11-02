'use strict';

const
    chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    sinonAsPromised = require('sinon-as-promised'),
    Promise = require('bluebird');

global.env = null;
global.sinon = sinon;
global.expect = chai.expect;

sinonAsPromised(Promise);
chai.should();
chai.use(sinonChai);

beforeEach(() => {
    global.env = sinon.sandbox.create();
});

afterEach(() => {
    global.env.restore();
});