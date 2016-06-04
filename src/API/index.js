// NOTE: this is a starter kit file
// TODO: refactor

import express from 'express';

import sensorRoutes from './sensors/sensor.routes.js';
import scenarioRoutes from './scenarios/scenario.routes.js';
import scenarioConverterRoutes from './scenario-converter/scenario-converter.routes.js';

const router = express.Router();    // eslint-disable-line new-cap


/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
    res.send('OK')
);

router.use('/sensors', sensorRoutes);
router.use('/scenarios', scenarioRoutes);
router.use('/scenario-converter', scenarioConverterRoutes);

export default router;
