import composeMiddleware from 'compose-middleware';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import httpStatus from 'http-status';
import config from '../../config/env';
import UserService from '../user/user.service';
const validateJwt = expressJwt({ secret: config.token.secret });

/**
 * @function ensureAuthenticated
 * @description Attaches the user object to the request if authenticated
 * Otherwise returns 403
 * @return {Object}
 */
function ensureAuthenticated() {
    return composeMiddleware.compose(
        validateJwt,
        (req, res, next) => {
            const id = req.user && req.user._id;
            UserService.getUserById(id)
                .then(user => {
                    req.user = user;
                    next();
                })
                .catch(() => {
                    res.status(httpStatus.BAD_REQUEST).json({
                        code: 'USER_NOT_EXIST',
                        error: 'user not exist'
                    });
                });
        }
    );
}

/**
 * @function hasRole
 * @description Checks if the user role meets the minimum requirements of the route
 * @param {String} roleRequired
 * @return {Object}
 */
function hasRole(roleRequired) {
    if (!roleRequired) throw new Error('Required role needs to be set');

    return composeMiddleware.compose(
        ensureAuthenticated(),
        (req, res, next) => {
            if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
                next();
            } else {
                res.status(httpStatus.FORBIDDEN).json({
                    code: 'ACCESS_FORBIDDEN',
                    error: 'Access forbidden'
                });
            }
        }
    );
}

/**
 * @function generateToken
 * @description Returns a jwt token signed by the app secret
 * @param {Number} id
 */
function generateToken(id) {
    return jwt.sign({ _id: id }, config.token.secret, { expiresIn: config.token.expires });
}

export default {
    hasRole,
    ensureAuthenticated,
    generateToken
};
