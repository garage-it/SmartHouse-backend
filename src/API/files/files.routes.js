import express from 'express';
import filesCtrl from './files.controller';

export default express.Router()

    .use('/', filesCtrl.serve);
