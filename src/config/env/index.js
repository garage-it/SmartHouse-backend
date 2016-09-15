import dotenv from 'dotenv';
import path from 'path';

dotenv.config({silent: true});

const env = process.env.ENV_CONFIG || 'development';
const config = require(`./${env}`);

const defaults = {
    root: path.join(__dirname, '/..'),
    host: 'localhost'
};

Object.assign(config, defaults);

export default config;
