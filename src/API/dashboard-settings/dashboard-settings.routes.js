import express from 'express';
import dashboardCtrl from './dashboard-settings.controller';

const router = express.Router();// eslint-disable-line new-cap

router.route('/')
    /** GET /api/dashboard - Get dashboard */
    .get(dashboardCtrl.query)

    /** PUT /api/dashboard - Update dashboard */
    .put(dashboardCtrl.update);

export default router;
