import express from 'express';
import scenarioCtrl from './scenario.controller.js';

const router = express.Router();    // eslint-disable-line new-cap

router.route('/')
    /** GET /api/scenarios - Get list of scenarios */
    .get(scenarioCtrl.query)
    .post(scenarioCtrl.create);

router.route('/:id')
    /** GET /api/scenarios/:scenarioId - Get scenario */
    .get(scenarioCtrl.get)
    .delete(scenarioCtrl.remove)
    .put(scenarioCtrl.update);

router.param('id', scenarioCtrl.load);

export default router;
