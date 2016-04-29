import express from 'express';
import scenarioCtrl from './scenario.controller.js';

const router = express.Router();    // eslint-disable-line new-cap

router.route('/')
    /** GET /api/scenarios - Get list of scenarios */
    .get(scenarioCtrl.query);

router.route('/:id')
    /** GET /api/scenarios/:scenarioId - Get scenario */
    .get(scenarioCtrl.get);

export default router;
