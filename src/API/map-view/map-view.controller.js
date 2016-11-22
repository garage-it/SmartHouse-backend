import { compose } from 'compose-middleware';
import fileUploadMiddleware from '../files/file-upload.middleware';
import mapViewService from './map-view.service';

export default {
    get,
    uploadPicture: compose(fileUploadMiddleware, onFileUploaded)
};

function get(req, res, next) {
    return mapViewService.get()
        .then((mapView) => res.send(mapView))
        .catch(next);
}

function onFileUploaded(req, res, next) {
    const { filename } = req.file;

    return mapViewService.updatePicture(filename)
        .then((result) => res.send(result))
        .catch(next);
}