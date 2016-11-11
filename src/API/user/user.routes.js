import express from 'express';
import authService from '../../shared/auth/auth.service';
import userCtrl from './user.controller.js';

const router = express.Router();// eslint-disable-line new-cap

router.route('')
    .get(authService.hasRole('admin'), userCtrl.getAllUsers)
    .post(authService.hasRole('admin'), userCtrl.add);

router.route('/current-user')
    .get(authService.ensureAuthenticated(),userCtrl.getCurrentUser);

router.route('/:id')
    .get(authService.hasRole('user:read'), userCtrl.getById)
    .put(authService.hasRole('user:write'), userCtrl.update)
    .delete(authService.hasRole('admin'), userCtrl.deleteUserById);

export default router;