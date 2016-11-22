import express from 'express';
import filesCtrl from './files.controller.js';
import config from './../../config/env';

const router = express.Router();    // eslint-disable-line new-cap

/** GET /api/files/:filename - Get file */
router.use('/', express.static(config.filesPath));

router.route('/')

    /** POST /api/files - Upload new file */
    .post(filesCtrl.create);

router.route('/:filename')

    /** PUT /api/files/:filename - Update file */
    .post(filesCtrl.update)

    /** DELETE /api/files/:filename - Delete file */
    .delete(filesCtrl.remove);

export default router;
