import { compose } from 'compose-middleware';
import fileUploadMiddleware from '../files/file-upload.middleware';
import mapViewService from './map-view.service';

export default {
    uploadPicture: compose(fileUploadMiddleware, onFileUploaded)
};

function onFileUploaded(req, { send }, next) {

    const { id } = req.params;
    const { filename } = req.file;

    mapViewService.updatePicture(id, filename)
        .then(send)
        .catch(next);
}
