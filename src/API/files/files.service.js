import config from '../../config/env';

const fs = require('fs');
const path = require('path');
const del = require('del');

const { filesPath } = config;

function cleanFolder() {
    return del([path.join(filesPath, '**'), `!${filesPath}`]);
}

function getFiles(folder) {
    folder = folder || config.filesPath;

    return new Promise((resolve, reject) => {
        fs.readdir(folder, (error, data) =>
            resolveData(resolve, reject, error, data));
    });
}

function deleteFile(name, folder) {
    folder = folder || config.filesPath;

    return new Promise((resolve, reject) => {
        const curPath = path.join(folder, name);
        fs.unlink(curPath, (error, data) =>
            resolveData(resolve, reject, error, data));
    });
}

function getFile(name, folder) {
    folder = folder || config.filesPath;

    return new Promise((resolve, reject) => {
        fs.readFile(path.join(folder, name), (error, data) =>
            resolveData(resolve, reject, error, data));
    });
}

function resolveData(resolve, reject, error, data) {
    if (error) {
        reject(getMessage(error));
        return;
    }
    resolve(data);
}

function getMessage(error) {
    let message = error.message || error;
    // remove absolute path from the message
    if (error.code === 'ENOENT') {
        message = message.substring(0, message.indexOf(','));
    }
    return message;
}

export default { cleanFolder, getFiles, deleteFile, getFile };