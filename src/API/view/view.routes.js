import express from 'express';
import viewCtrl from './view.controller.js';

const router = express.Router();// eslint-disable-line new-cap

router.route('/')

    .get(viewCtrl.query);

router.route('/:id')

    .get(viewCtrl.getById);

export default router;
