import path from 'path';

const env = process.env.NODE_ENV || 'cloud';
const config = require(`./${env}`);

const defaults = {
    root: path.join(__dirname, '/..')
};

Object.assign(config, defaults);

export default config;
