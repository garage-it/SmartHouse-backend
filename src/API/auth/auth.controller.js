import composeMiddleware from 'compose-middleware';
import httpStatus from 'http-status';
import passport from 'passport';
import localSetup from './local/passport';
import facebookSetup from './facebook/passport';
import UserService from '../../shared/user/user.service';
import config from '../../config/auth';
import authService from '../../shared/auth/auth.service';

/**
 * @function initialize
 * @description Register authenticate strategies
 */
function initialize() {
    localSetup(UserService);
    facebookSetup(UserService, config);
}

function register() {
    return composeMiddleware.compose(
        (reg, res, next) => {
            reg.params = reg.body;

            UserService.findOneBy({email: reg.params.email})
                .then(result => {
                    if (result) {
                        res.status(httpStatus.BAD_REQUEST).json({
                            code: 'NOT_UNIQUE_EMAIL',
                            error: 'Email address already exists'
                        });
                    } else {
                        next();
                    }
                });
        },
        (reg, res, next) => {
            UserService.createUser(reg.params)
                .then(() => {
                    next();
                })
                .catch(next);
        },
        passport.authenticate('local', {session: false}),
        (req, res) => {
            res.json({
                user: req.user,
                token: authService.generateToken(req.user._id)
            });
        }
    );
}

function login() {
    return composeMiddleware.compose(
        (reg, res, next) => {
            reg.params = reg.body;
            next();
        },
        passport.authenticate('local', {session: false}),
        (req, res) => {
            res.json({
                user: req.user,
                token: authService.generateToken(req.user._id)
            });
        }
    );
}

function facebookLogin() {
    return composeMiddleware.compose(
        passport.authenticate('facebook', {
            scope: ['email', 'user_about_me'],
            failureRedirect: '/login',
            session: false
        })
    );
}

function facebookLoginCallback() {
    return composeMiddleware.compose(
        passport.authenticate('facebook', {
            failureRedirect: '/login',
            session: false
        }),
        (req, res) => {
            res.json({
                user: req.user,
                token: authService.generateToken(req.user._id)
            });
        }
    );
}

export default {
    register,
    login,
    facebookLogin,
    facebookLoginCallback,
    initialize
};