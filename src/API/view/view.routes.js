import express from 'express';
import viewCtrl from './view.controller.js';

const router = express.Router();// eslint-disable-line new-cap

router.route('/')

    /** GET /api/view - Get list of all views */
    .get(viewCtrl.query)

    /** Create /api/view - Add new view */
    .post(viewCtrl.create);

router.route('/:id')

    /** GET /api/view - Get view */
    .get(viewCtrl.get);

export default router;
