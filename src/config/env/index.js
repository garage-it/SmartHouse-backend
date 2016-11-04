import dotenv from 'dotenv';
import path from 'path';

dotenv.config({silent: true});

const env = process.env.ENV_CONFIG || 'development';
const config = require(`./${env}`);

const defaults = {
    userRoles: ['guest', 'user:read', 'user:write', 'user', 'admin'],
    root: path.join(__dirname, '/..'),
    host: 'localhost',
    token: {
        expires: 60*10,
        secret: 'session_secret'
    }
};

export default  Object.assign({}, defaults, config);
