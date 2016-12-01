import express from 'express';
import servoStatiscticsCtrl from './servo-statistics.controller.js';

const router = express.Router();// eslint-disable-line new-cap

router.route('/')
    .get(servoStatiscticsCtrl.query);

export default router;
