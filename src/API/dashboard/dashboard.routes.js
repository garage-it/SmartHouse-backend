import express from 'express';
import dashboardCtrl from './dashboard.controller.js';

const router = express.Router();    // eslint-disable-line new-cap

router.route('/')
    /** GET /api/dashboard - Get dashboard */
    .get(dashboardCtrl.query)

    /** POST /api/dashboard - Create new dashboard */
    .post(dashboardCtrl.create);

router.route('/:id')
    /** GET /api/dashboard/:dashboardId - Get dashboard */
    .get(dashboardCtrl.get)

    /** PUT /api/dashboard/:dashboardId - Update dashboard */
    .put(dashboardCtrl.update)

    /** DELETE /api/dashboard/:dashboardId - Delete dashboard */
    .delete(dashboardCtrl.remove);

/** Load sensor when API with id route parameter is hit */
router.param('id', dashboardCtrl.load);

export default router;
