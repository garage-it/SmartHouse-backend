import express from 'express';
import MethodNotAllowedError from '../helpers/MethodNotAllowedError';
import sensorCtrl from './sensor.controller.js';

const router = express.Router();    // eslint-disable-line new-cap

router.route('/')
    /** GET /api/sensors - Get list of sensors */
    .get(sensorCtrl.query)

    /** POST /api/sensors - Create new sensor */
    .post(sensorCtrl.create)
    .all((req, res, next) => next(new MethodNotAllowedError(`${req.method} is not supported`)));

router.route('/:id')
    /** GET /api/sensors/:sensorId - Get sensor */
    .get(sensorCtrl.get)

    /** PUT /api/sensors/:sensorId - Update sensor */
    .put(sensorCtrl.update)

    /** DELETE /api/sensors/:sensorId - Delete sensor */
    .delete(sensorCtrl.remove)
    .all((req, res, next) => next(new MethodNotAllowedError(`${req.method} is not supported`)));


export default router;
