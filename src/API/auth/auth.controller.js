import composeMiddleware from 'compose-middleware';
import httpStatus from 'http-status';
import passport from 'passport';

import localSetup from './local/passport';
import facebookSetup from './facebook/passport';

import UserService from '../../shared/user/user.service';
import authService from '../../shared/auth/auth.service';

import config from '../../config/env';

/**
 * @function initialize
 * @description Register authenticate strategies
 */
function initialize() {
    localSetup(UserService);
    facebookSetup(UserService, config.facebook);
}

function register() {
    return composeMiddleware.compose(
        bodyToParamsMiddleware,
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
        createPassportAuthenticateMiddleware('local'),
        generateTokenControllerAction
    );
}

function login() {
    return composeMiddleware.compose(
        bodyToParamsMiddleware,
        createPassportAuthenticateMiddleware('local'),
        generateTokenControllerAction
    );
}

function facebookLoginWithAccessToken() {
    return composeMiddleware.compose(
        bodyToParamsMiddleware,
        createPassportAuthenticateMiddleware('facebook-token'),
        generateTokenControllerAction
    );
}

function bodyToParamsMiddleware(req, res, next) {
    req.params = req.body;
    next();
}

function generateTokenControllerAction(req, res) {
    res.json({
        user: req.user,
        token: authService.generateToken(req.user._id)
    });
}

function createPassportAuthenticateMiddleware(strategyName) {
    return passport.authenticate(strategyName, {session: false});
}

export default {
    register,
    login,
    facebookLoginWithAccessToken,
    initialize
};
