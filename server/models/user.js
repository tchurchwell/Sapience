'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Q = require('q'),
    _ = require('lodash'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

/**
 * User Schema
 */
var UserSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        required:true
    },
    lastName: {
        type: String,
        trim: true,
        required:true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required:true
    },
    skills: {
    	type: String,
        trim: true
    },
    hashed_password: String,
    provider: {
        type: String,
        default: 'local'
    },
    location: {
    	type: String,
        trim: true
    },
    pinCode: {
    	type: String,
        trim: true
    },
    salt: String,
    facebook: {},
    twitter: {},
    github: {},
    google: {},
    linkedin: {},
    created: {
        type: Date,
        default: Date.now
    }
});

/**
 * Virtuals
 */
UserSchema.virtual('password').set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
}).get(function() {
    return this._password;
});

/**
 * Validations
 */
var validatePresenceOf = function(value) {
    return value && value.length;
}, validateForLocal = function(value) {
    // if you are authenticating by any of the oauth strategies, don't validate
    return (this.provider!=='local') ? true : (typeof value === 'string' && value.length > 0);
};

// the below 4 validations only apply if you are signing up traditionally

UserSchema.path('firstName').validate(validateForLocal, 'First name cannot be blank');

UserSchema.path('lastName').validate(validateForLocal, 'Last name cannot be blank');

UserSchema.path('email').validate(validateForLocal, 'Email cannot be blank');

UserSchema.path('hashed_password').validate(validateForLocal, 'Password cannot be blank');

/**
 * Pre-save hook
 */
UserSchema.pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.password) && !this.provider)
        next(new Error('Invalid password'));
    else
        next();
});

/**
 * Authenticate - check if the passwords are the same
 *
 * @param {String} plainText
 * @return {Boolean}
 * @api public
 */
UserSchema.methods.authenticate = function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
};

/**
 * Make salt
 *
 * @return {String}
 * @api public
 */
UserSchema.methods.makeSalt = function() {
    return crypto.randomBytes(16).toString('base64');
};

/**
 * Encrypt password
 *
 * @param {String} password
 * @return {String}
 * @api public
 */
UserSchema.methods.encryptPassword = function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
};

/**
 * Return user json object without private parameters
 * */
UserSchema.methods.sanitize = function() {
    var userObject = _.omit(this._doc, 'hashed_password', 'salt', '_id', '__v', 'provider');
    userObject.id = this.id.toString();
    return userObject;
};

/**
 * Static method to save user object.
 * */
UserSchema.statics.save = function(userObj) {
    var User = mongoose.model('User'),
        user = new User(userObj),
        message = null,
        createReq = Q.defer();

    user.save(function(err) {
        if (err) {
            switch (err.code) {
                case 11000:
                case 11001:
                    message = 'Email already exists';
                    break;
                default:
                    message = err.errors || 'Please fill all the required fields';
            }
            createReq.reject(message);
        } else {
            createReq.resolve(user);
        }
    });

    return createReq.promise;
};

mongoose.model('User', UserSchema);