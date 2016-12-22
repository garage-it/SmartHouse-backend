import express from 'express';
import viewCtrl from './view.controller.js';

const router = express.Router();// eslint-disable-line new-cap

router.route('/')

    /** GET /api/view - Get list of all views */
    .get(viewCtrl.query)

    /** POST /api/view - Add new view */
    .post(viewCtrl.create);

router.route('/:id')

    /** GET /api/view/:id - Get view */
    .get(viewCtrl.get)

    /** POST /api/view/:id - Update view */
    .post(viewCtrl.update);

export default router;
