import express from 'express';
import filesCtrl from './files.controller.js';

const router = express.Router();    // eslint-disable-line new-cap

router.route('/')

    /** GET /api/files - Get files */
    .get(filesCtrl.query)

    /** POST /api/files - Upload new file */
    .post(filesCtrl.create);

router.route('/:filename')

    /** PUT /api/files/:filename - Update file */
    .post(filesCtrl.update)

    /** DELETE /api/files/:filename - Delete file */
    .delete(filesCtrl.remove);

export default router;
