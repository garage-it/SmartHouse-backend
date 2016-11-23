import path from 'path';
import del from 'del';
import Promise from 'bluebird';
import config from '../../config/env';
import tryAsync from '../helpers/try-async';

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
    return tryAsync(Promise.try(() => deleteFile(name)));
}

function deleteFile(name) {
    return del(filesService.resolveFilePath(name));
}

function resolveFilePath(fileName) {
    return path.join(config.filesPath, fileName);
}
