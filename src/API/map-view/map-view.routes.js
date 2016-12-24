import { Router } from 'express';
import mapViewCtrl from './map-view.controller';

export default Router()

    .post('/:id/picture', mapViewCtrl.uploadPicture);