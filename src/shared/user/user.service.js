import User from './user.model';

/**
 * It will authenticate user password
 *
 * @param {Object} user
 * @param {String} password
 * @return {Boolean}
 *
 */
function isPasswordCorrect(user, password) {
    return user.authenticate(password);
}

/**
 * It will find one user by query
 *
 * @param {Object} query
 * @return {object}
 *
 */
function findOneBy(query) {
    return User.findOne(query);
}

/**
 * It will return all users
 * @return {Array}
 *
 */
function getAllUsers() {
    return User.find({}, '-salt -hashedPassword -__v');
}

/**
 * It will return user by id
 *
 * @param {Number} userId
 * @return {object}
 *
 */
function getUserById(userId) {
    return User.findById(userId);
}

/**
 * It will create new user in database
 *
 * @param {object} body
 * @return {object}
 *
 */
function createUser(body) {
    return User.create(body).then((result) => {
        return result;
    });
}

/**
 * It will find user by query
 * or create new user in database
 *
 * @param {object} query
 * @param {object} body
 * @return {object}
 *
 */
function findOrCreateUser (query, body) {
    return User.findOrCreate(query, body).then((result) => {
        return result;
    });
}

/**
 * Update existing user
 *
 * @param {object} body
 * @param {Number} userId
 * @return {object}
 *
 */
function updateUser(body, userId) {
    return User.update({ '_id': userId }, { $set: body });
}

/**
 * Delete user by id
 *
 * @param {Number} userId
 * @return {object}
 *
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