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
        // It will work only for non development mode
        // because for development used different port for front-end (WebpackDevServer)
        redirect_uri: req.query.redirect_uri
    });

    res.redirect(fbAuthUrl);
}

export default {
    facebookLogin
};
