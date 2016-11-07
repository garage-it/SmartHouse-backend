import passport from 'passport';
import passportLocal from 'passport-local';

const LocalStrategy = passportLocal.Strategy;

/**
 * @function setup
 * @description Register local authentication strategy
 * @param {Object} UserService
 */
export default function setup(UserService) {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (email, password, done) => {
        return UserService.findOneBy({email: email})
            .then(user => {
                if (user && UserService.isPasswordCorrect(user,password)) {
                    done(null, user.toObject({transform: true}));
                } else {
                    done();
                }
            })
            .catch(err => done(err));
    }));
}