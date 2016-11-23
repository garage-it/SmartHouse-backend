import fs from 'fs';
import path from 'path';
import del from 'del';
import Promise from 'bluebird';
import config from '../../config/env';
import tryAsync from '../helpers/try-async';

Promise.promisifyAll(fs);

const self = {
    cleanFolder,
    tryDeleteFile,
    resolveFilePath
};

export default self;

function cleanFolder() {
    return del([self.resolveFilePath('**'), `!${config.filesPath}`]);
}

function tryDeleteFile(name) {
    return tryAsync(Promise.try(() => {
        const filePath = self.resolveFilePath(name);
        return fs.unlinkAsync(filePath);
    }));
}

function resolveFilePath(fileName) {
    return path.join(config.filesPath, fileName);
}