import { compose } from 'compose-middleware';
import fileUploadMiddleware from '../files/file-upload.middleware';
import mapViewService from './map-view.service';

export default {
    getById,
    create,
    query,
    uploadPicture: compose(fileUploadMiddleware, onFileUploaded)
};

function getById(req, { send }, next) {

    const { id } = req.params;

    mapViewService.getById(id)
        .then(send)
        .catch(next);
}

function create(req, { send }, next) {

    const mapViewCreateDto = req.body;

    mapViewService.create(mapViewCreateDto)
        .then(send)
        .catch(next);
}

function query(req, { send }, next) {
    mapViewService.query()
      .then(send)
      .catch(next);
}

function onFileUploaded(req, { send }, next) {

    const { id } = req.params;
    const { filename } = req.file;

    mapViewService.updatePicture(id, filename)
        .then(send)
        .catch(next);
}