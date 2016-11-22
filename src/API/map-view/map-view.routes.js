import { Router } from 'express';
import mapViewCtrl from './map-view.controller';

export default Router()

    .get('/', mapViewCtrl.get)

    .post('/picture', mapViewCtrl.uploadPicture);