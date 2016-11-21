import User from './user.model';
const REMOVED_FIELDS = '-salt -hashedPassword -__v';

/**
 * @function isPasswordCorrect
 * @description It will authenticate user password
 * @param {Object} user
 * @param {String} password
 * @return {Boolean}
 */
function isPasswordCorrect(user, password) {
    return user.authenticate(password);
}

/**
 * @function findOneBy
 * @description It will find one user by query
 * @param {Object} query
 * @return {object}
 */
function findOneBy(query) {
    return User.findOne(query);
}

/**
 * @function getAllUsers
 * @description It will return all users
 * @return {Array}
 */
function getAllUsers() {
    return User.find({}, REMOVED_FIELDS);
}

/**
 * @function getUserById
 * @description It will return user by id
 * @param {Number} userId
 * @return {object}
 */
function getUserById(userId) {
    return User.findById(userId, REMOVED_FIELDS);
}

/**
 * @function createUser
 * @description It will create new user in database
 * @param {object} body
 * @return {object}
 */
function createUser(body) {
    return User.create(body);
}

/* istanbul ignore next */
// Ignored until coverage report will be fixed

/**
 * @function findOrCreateUser
 * @description It will find user by query or create new user in database
 * @param {object} query
 * @param {object} body
 * @return {object}
 */
function findOrCreateUser(query, body) {
    return new Promise((resolve, reject) => {
        User.findOrCreate(query, body, {}, (err, user) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(user);
        });
    });
}

/**
 * @function updateUser
 * @description Update existing user
 * @param {object} body
 * @param {Number} userId
 * @return {object}
 */
function updateUser(body, userId) {
    return User.update({ '_id': userId }, { $set: body })
        .then(() => {
            return getUserById(userId);
        });
}

/**
 * @function deleteUser
 * @description Delete user by id
 * @param {Number} userId
 * @return {object}
 */
function deleteUser(userId) {
    return User.findByIdAndRemove(userId);
}

export default {
    isPasswordCorrect,
    findOneBy,
    getAllUsers,
    getUserById,
    createUser,
    findOrCreateUser,
    updateUser,
    deleteUser
};
