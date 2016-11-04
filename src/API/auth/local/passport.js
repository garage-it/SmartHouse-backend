import passport from 'passport';
import passportLocal from 'passport-local';

const LocalStrategy = passportLocal.Strategy;

/**
 * Register local authentication strategy
 *
 */
function setup(UserService) {
    passport.use(new LocalStrategy({
        usernameField: 'name',
        passwordField: 'password'
    }, (name, password, done) => {
        const query = {$or: [{email: name}, {name: name}]};

        return UserService.findOneBy(query)
            .then((user) => {
                if (user && UserService.isPasswordCorrect(user,password)) {
                    done(null, user.toObject({transform: true}));
                } else {
                    done();
                }
            })
            .catch((err) => done(err));
    }));
}

export default {
    setup
};