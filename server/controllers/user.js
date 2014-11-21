'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Q = require('q'),
    User = mongoose.model('User');

/**
 * Auth callback
 *//*
exports.authCallback = function(req, res) {
    res.redirect('/');
};

*//**
 * Show login form
 *//*
exports.signin = function(req, res) {
    res.render('users/signin', {
        title: 'Signin',
        message: req.flash('error')
    });
};

*//**
 * Show sign up form
 *//*
exports.signup = function(req, res) {
    res.render('users/signup', {
        title: 'Sign up',
        user: new User()
    });
};

*//**
 * Logout
 *//*
exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};

*//**
 * Session
 *//*
exports.session = function(req, res) {
    res.redirect('/');
};*/

/**
 * Create user
 */
exports.create = User.save;

/**
 * Send User
 *//*

exports.me = function(req, res) {
    res.jsonp(req.user || null);
};

*/
/**
 * Find user by id
 *//*

exports.user = function(req, res, next, id) {
    User
        .findOne({
            _id: id
        })
        .exec(function(err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
            req.profile = user;
            next();
        });
};*/
