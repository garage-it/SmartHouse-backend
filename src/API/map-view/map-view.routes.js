import { Router } from 'express';
import mapViewCtrl from './map-view.controller';

export default Router()

    .get('/', mapViewCtrl.get)

    .put('/', mapViewCtrl.updateInfo)

    .post('/picture', mapViewCtrl.uploadPicture);