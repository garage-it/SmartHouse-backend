import config from '../../config/env';
import { OAuth2 } from 'oauth';

const fbOAuth = new OAuth2(
    config.facebook.clientID,
    config.facebook.clientSecret,
    config.facebook.baseSite,
    config.facebook.authorizationURL
);

function facebookLogin(req, res) {
    const fbAuthUrl = fbOAuth.getAuthorizeUrl({
        response_type: 'token',
        scope: ['public_profile', 'email'].join(','),
        // It will work only for non development env's
        // because for development used different port for front-end (WebpackDevServer)
        redirect_uri: config.publicUrl + '/auth/login-facebook-callback'
    });
    res.redirect(fbAuthUrl);
}

function facebookLoginCallback(req, res) {
    res.render('auth/login-facebook-callback', {
        localStorageKey: config.token.localStorageKey,
        fbLoginWithAccessTokenUrl: '/api/auth/login-facebook-with-access-token',
        fbLoginSuccessUrl: '/',
        fbLoginFailUrl: '/#/login/fb-error'
    });
}

export default {
    facebookLogin,
    facebookLoginCallback
};
