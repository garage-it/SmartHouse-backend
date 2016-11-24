import path from 'path';
import del from 'del';
import Promise from 'bluebird';
import config from '../../config/env';
import tryAsync from '../helpers/try-async';

const filesService = {
    deleteAllFiles,
    tryDeleteFile,
    resolveFilePath
};

export default filesService;

function deleteAllFiles() {
    return del(filesService.resolveFilePath('**'));
}

function tryDeleteFile(name) {
    return tryAsync(Promise.try(() => deleteFile(name)));
}

function deleteFile(name) {
    if (!String(name).trim()) {
        throw new Error('name is empty');
    }
    return del(filesService.resolveFilePath(name));
}

function resolveFilePath(fileName) {
    return path.join(config.filesPath, fileName);
}
