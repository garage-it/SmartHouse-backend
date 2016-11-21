import config from './../config/env';

const fs = require('fs');
const path = require('path');

function cleanFolder(folder) {
    folder = folder || config.uploadsFolder;

    fs.access(folder, fs.R_OK | fs.W_OK, err => {
        if (err) throw err;

        fs.readdir(folder, (error, files) => {
            if (error) throw error;
            files.forEach((file) => deleteFile(file, folder));
        });
    });
}

function getFiles(folder) {
    folder = folder || config.uploadsFolder;

    return new Promise((resolve, reject) => {
        fs.access(folder, fs.R_OK | fs.W_OK, (err) => {
            if (err) {
                reject(err);
                return;
            }

            fs.readdir(folder, (error, data) =>
                resolveData(resolve, reject, error, data));
        });
    });
}

function deleteFile(name, folder) {
    folder = folder || config.uploadsFolder;

    return new Promise((resolve, reject) => {
        const curPath = path.join(folder, name);
        fs.unlink(curPath, (error, data) =>
            resolveData(resolve, reject, error, data));
    });
}

function getFile(name, folder) {
    folder = folder || config.uploadsFolder;

    return new Promise((resolve, reject) => {
        const curPath = path.join(folder, name);
        fs.access(curPath, fs.R_OK, err => {
            if (err) {
                reject(getMessage(err));
                return;
            }

            fs.readFile(path.join(folder, name), (error, data) =>
                resolveData(resolve, reject, error, data));
        });
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

export default {cleanFolder, getFiles, deleteFile, getFile};