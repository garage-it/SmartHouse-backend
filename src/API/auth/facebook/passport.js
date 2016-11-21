/* istanbul ignore next */
// Should be ignored for now because of third party dependency. So API tests can't help

import passport from 'passport';
import FacebookTokenStrategy from 'passport-facebook-token';

/**
 * @function setup
 * @description Register facebook authentication strategy
 * @param {Object} UserService
 * @param {Object} facebookConfig
 */
export default function setup(UserService, facebookConfig) {
    passport.use(new FacebookTokenStrategy({
        clientID: facebookConfig.clientID,
        clientSecret: facebookConfig.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        if (profile.emails[0].value) {
            // Some times it happens
            // https://developers.facebook.com/bugs/298946933534016/?comment_id=620710881344692
            // https://developers.facebook.com/docs/graph-api/reference/user
            done(new Error('Facebook Auth: Not found e-mail in profile'));
            return;
        }

        UserService.findOrCreateUser(
            {
                email: profile.emails[0].value
            },
            {
                email: profile.emails[0].value,
                name: profile.displayName,
                facebookId: profile.id
            }
        )
        .then(user => {
            done(null, user);
        })
        .catch(done);
    }));
}
