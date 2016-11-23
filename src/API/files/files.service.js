import fs from 'fs';
import path from 'path';
import del from 'del';
import Promise from 'bluebird';
import config from '../../config/env';
import tryAsync from '../helpers/try-async';

Promise.promisifyAll(fs);

const filesService = {
    cleanFolder,
    tryDeleteFile,
    resolveFilePath
};

export default filesService;

function cleanFolder() {
    return del([filesService.resolveFilePath('**'), `!${config.filesPath}`]);
}

function tryDeleteFile(name) {
    return tryAsync(Promise.try(() => {
        const filePath = filesService.resolveFilePath(name);
        return fs.unlinkAsync(filePath);
    }));
}

function resolveFilePath(fileName) {
    return path.join(config.filesPath, fileName);
}