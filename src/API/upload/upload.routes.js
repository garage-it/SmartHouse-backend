import express from 'express';
import uploadCtrl from './upload.controller.js';

const router = express.Router();    // eslint-disable-line new-cap

router.route('/')
    /** GET /api/upload - Get files */
    .get(uploadCtrl.query)

    /** POST /api/upload - Upload new file */
    .put(uploadCtrl.create);

router.route('/:fileName')
    /** GET /api/sensors/:fileName - Get file */
    .get(uploadCtrl.get)

    /** PUT /api/sensors/:fileName - Update file */
    .post(uploadCtrl.update)

    /** DELETE /api/sensors/:fileName - Delete file */
    .delete(uploadCtrl.remove);

export default router;
