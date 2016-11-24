import { Router } from 'express';
import mapViewCtrl from './map-view.controller';

export default Router()

    .post('/', mapViewCtrl.create)

    .get('/:id', mapViewCtrl.getById)

    .post('/:id/picture', mapViewCtrl.uploadPicture);