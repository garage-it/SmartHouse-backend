import fs from 'fs';
import path from 'path';
import del from 'del';
import Promise from 'bluebird';
import config from '../../config/env';
import tryAsync from '../helpers/try-async';

Promise.promisifyAll(fs);

function cleanFolder() {
    return del([resolveFilePath('**'), `!${config.filesPath}`]);
}

function tryDeleteFile(name) {
    if (!name) {
        return Promise.resolve();
    }
    const filePath = resolveFilePath(name);
    return tryAsync(fs.unlinkAsync(filePath));
}

function resolveFilePath(fileName) {
    return path.join(config.filesPath, fileName);
}

export default {
    cleanFolder,
    tryDeleteFile,
    resolveFilePath
};