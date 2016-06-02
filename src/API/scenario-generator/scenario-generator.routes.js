import express from 'express';
import scenarioCtrl from './scenario-generator.controller.js';

const router = express.Router();    // eslint-disable-line new-cap

router.route('/')
    /** GET /api/scenario-generator - Get converted scenario */
    .get(scenarioCtrl.getConvertedScenario);

export default router;
