import config from './../../config/env';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

function cleanFolder(folder) {
    folder = folder || config.filesPath;

    return new Promise((resolve, reject) => {
        mkdirp(folder, () => {
            fs.readdir(folder, (error, files) => {
                if (error) {
                    reject(error);
                    return;
                }

                Promise.all(files.map(x => deleteFile(x, folder)))
                    .then(() => resolve())
                    .catch(() => reject());
            });
        });
    });
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