// NOTE: this is a starter kit file
// TODO: refactor

import express from 'express';
import userRoutes from './users/user.routes.js';
import sensorRoutes from './sensors/sensor.routes.js';
import scenarioRoutes from './scenarios/scenario.routes.js';

const router = express.Router();    // eslint-disable-line new-cap


/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
    res.send('OK')
);

// mount user routes at /users
router.use('/users', userRoutes);
router.use('/sensors', sensorRoutes);
router.use('/scenarios', scenarioRoutes);

export default router;
