import userModel from '../../shared/user/user.model';

export default { populateUsers };

/* istanbul ignore next */
const users = [];

users.push({
    login: 'admin',
    name: 'Your Admin',
    email: 'admin@smarthouse.com',
    role: 'admin',
    password: 'admin'
});

users.push({
    login: 'Bond',
    name: 'James Bond',
    email: 'agent007@mi6.uk',
    role: 'user',
    password: 'password'
});

users.push({
    login: 'johnDoe',
    name: 'John Doe',
    email: 'johndoe@smarthouse.com',
    role: 'user:write',
    password: 'password'
});

users.push({
    login: 'janeDoe',
    name: 'Jane Doe',
    email: 'janedoe@smarthouse.com',
    role: 'user:read',
    password: 'password'
});

function populateUsers() {
    return userModel.find({}).remove()
        .then(() => {
            return userModel.create(...users);
        });
}