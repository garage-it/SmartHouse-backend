import dotenv from 'dotenv';
import path from 'path';

dotenv.config({silent: true});

const env = process.env.ENV_CONFIG || 'development';
const config = require(`./${env}`);

const defaults = {
    userRoles: ['guest', 'user:read', 'user:write', 'user', 'admin'],
    root: path.join(__dirname, '/..'),
    filesPath: path.join(__dirname, '/../../../files'),
    host: 'localhost',
    token: {
        expires: 60*10,
        secret: 'session_secret'
    },
    facebook: {
        clientID:     process.env.FACEBOOK_CLIENT_ID || 'invalid clientID for run app without error',
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET || 'invalid clientSecret for run app without error'
    }
};

export default Object.assign({}, defaults, config);
