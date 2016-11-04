import composeMiddleware from 'compose-middleware';
import passport from 'passport';
import local from './local/passport';
import facebook from './facebook/passport';
import UserService from '../../shared/user/user.service';
import config from '../../config/oauth';
import authService from '../../shared/auth/auth.service';

/**
 * Register authenticate strategies
 */
function initialize() {
    local.setup(UserService, config);
    facebook.setup(UserService, config);
}


function register() {
    return composeMiddleware.compose(
        (reg, res, next) => {
            reg.params = reg.body;

            UserService.createUser(reg.params)
                .then(() => {
                    next();
                });
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