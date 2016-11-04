import passport from 'passport';
import passportFacebook from 'passport-facebook';

const FacebookStrategy = passportFacebook.Strategy;

/**
 * Register facebook authentication strategy
 *
 */
function setup(UserService, config) {
    passport.use(new FacebookStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL
    }, (accessToken, refreshToken, profile, done) => {
        UserService.findOrCreateUser({ email: profile.emails[0].value }, {
            facebookId: profile.id,
            email: profile.emails[0].value,
            name: profile.username
        })
        .then((user) => {
            done(null, user);
        })
        .catch((err) => {
            done(err);
        });
    }));
}

export default {
    setup
};