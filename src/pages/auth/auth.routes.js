import express from 'express';
import authCtrl from './auth.controller';
const router = express.Router();


router.get('/login-facebook', authCtrl.facebookLogin);
router.get('/login-facebook-callback', authCtrl.facebookLoginCallback);

export default router;
