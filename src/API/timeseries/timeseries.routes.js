import express from 'express';
import timeseriesCtrl from './timeseries.controller.js';

const router = express.Router();// eslint-disable-line new-cap

router.route('/')
    .get(timeseriesCtrl.getSensor, timeseriesCtrl.query);


export default router;
