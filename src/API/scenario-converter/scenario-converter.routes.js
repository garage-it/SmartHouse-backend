import express from 'express';
import scenarioConverterCtrl from './scenario-converter.controller.js';

const router = express.Router();    // eslint-disable-line new-cap

router.route('/')
    /** GET /api/scenario-converter - Get converted scenario */
    .get(scenarioConverterCtrl.getConvertedScenario);

export default router;
