import { compose } from 'compose-middleware';
import fileUploadMiddleware from '../files/file-upload.middleware';
import mapViewService from './map-view.service';

export default {
    get,
    updateInfo,
    uploadPicture: compose(fileUploadMiddleware, onFileUploaded)
};

function get(req, res, next) {

    mapViewService.get()
        .then((mapView) => res.send(mapView))
        .catch(next);
}

function updateInfo(req, res, next) {

    const updates = req.body;

    mapViewService.updateInfo(updates)
        .then((mapView) => res.send(mapView))
        .catch(next);
}

function onFileUploaded(req, res, next) {

    const { filename } = req.file;

    mapViewService.updatePicture(filename)
        .then((mapView) => res.send(mapView))
        .catch(next);
}