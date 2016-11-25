import express from 'express';

import authCtrl from './auth.controller';

const router = express.Router();

router.get('/login-facebook', authCtrl.facebookLogin);

export default router;
