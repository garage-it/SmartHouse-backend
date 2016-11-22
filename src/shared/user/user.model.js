import mongoose from 'mongoose';
import crypto from 'crypto';
import findOrCreate from 'mongoose-findorcreate';
import Promise from 'bluebird';

/**
 * @file User Schema
 */
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    role: {
        type: String,
        default: 'user'
    },
    facebookId: {type: Number},
    salt: {type: String},
    hashedPassword: {type: String}
}, {
    collection: 'users',
    toObject: {
        transform(doc, ret) {
            delete ret.salt;
            delete ret.hashedPassword;
            delete ret.__v;
            return ret;
        }
    }
});

UserSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = makeSalt();
        this.hashedPassword = encryptPassword(password, this.salt);
    })
    .get(function () {
        return this._password;
    });

/**
 * @function
 * @description Make salt for password private method
 * @return {String}
 */
function makeSalt() {
    return crypto.randomBytes(16).toString('base64');
}

/**
 * @function encryptPassword
 * @description encrypt password private method
 * @param {String} password
 * @param {String} salt
 * @return {String}
 */
function encryptPassword(password, salt) {
    let encryptedPassword = '';

    if (password && salt) {
        const saltBuffer = new Buffer(salt, 'base64');
        encryptedPassword = crypto.pbkdf2Sync(password, saltBuffer, 10000, 64, 'sha1').toString('base64');
    }

    return encryptedPassword;
}

UserSchema.methods = {
    /**
     * @function authenticate
     * @description Check is password correct
     * @param {String} plainText
     * @return {Boolean}
     */
    authenticate(plainText) {
        return encryptPassword(plainText, this.salt) === this.hashedPassword;
    }
};

UserSchema.plugin(findOrCreate);
UserSchema.statics.findOrCreate = Promise.promisify(UserSchema.statics.findOrCreate);

export default mongoose.model('User', UserSchema);
