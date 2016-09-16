import dotenv from 'dotenv';
import path from 'path';

dotenv.config({silent: true});

const env = process.env.ENV_CONFIG || 'development';
const config = require(`./${env}`);

const defaults = {
    root: path.join(__dirname, '/..'),
    host: 'localhost'
};

export default  Object.assign({}, defaults, config);
