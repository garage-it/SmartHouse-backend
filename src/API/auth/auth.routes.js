import express from 'express';
import authCtrl from './auth.controller';
const router = express.Router();
authCtrl.initialize();

router.post('/register', authCtrl.register());
router.post('/login', authCtrl.login());
router.post('/login-facebook', authCtrl.facebookLoginWithAccessToken());

export default router;
