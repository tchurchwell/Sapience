'use strict';

// User routes use users controller
var users = require('../controllers/user');

module.exports = function(app) {
    var passport = app.passport;

    // Register the user with local provider
    app.post('/auth/register', function(req, res, next) {
        req.assert('firstName', 'You must enter a first name').notEmpty();
        req.assert('lastName', 'You must enter a last name').notEmpty();
        req.assert('email', 'You must enter a valid email address').isEmail();
        req.assert('password', 'You must enter password').notEmpty();
        req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

        var errors = req.validationErrors();
        if (errors) {
            return res.status(400).send(errors);
        }

        users.create(req.body).then(function(user) {
            user = user.sanitize();
            req.login(user, function(err) {
                if (err) {
                    return next(err);
                }
                return res.send(req.user);
            });
        }).catch(function(error) {
            res.status(400).send({message: error});
        });
    });

    /*// Setting up the userId param
    app.param('userId', users.user);

    // Setting the local strategy route
    app.post('/users/session', passport.authenticate('local', {
        failureRedirect: '/signin',
        failureFlash: true
    }), users.session);*/

    // Setting the facebook oauth routes
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email', 'public_profile']
    }));

    app.get('/auth/facebook/callback', function(req, res, next){
        var errorMsg;
        if(req.query.error){
            switch (req.query.error_reason){
                case 'user_denied':
                    errorMsg = 'You declined to login with Facebook...';
                    break;
                default:
                    errorMsg = req.query.error_description;
            }
            req.flash('error', errorMsg);
            return res.redirect('/#!/register');
        }
        passport.authenticate('facebook', function(err, user, info) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/#!/register');
            }
            if (!user) {
                return res.send(401, info);
            }
            req.login(user, function(err) {
                if (err) {
                    return next(err);
                }
                return res.redirect('/');
            });
        })(req, res, next);
    });

    /*// Setting the github oauth routes
    app.get('/auth/github', passport.authenticate('github', {
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/github/callback', passport.authenticate('github', {
        failureRedirect: '/signin'
    }), users.redirectTo);

    // Setting the twitter oauth routes
    app.get('/auth/twitter', passport.authenticate('twitter', {
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        failureRedirect: '/signin'
    }), users.redirectTo);

    // Setting the google oauth routes
    app.get('/auth/google', passport.authenticate('google', {
        failureRedirect: '/signin',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }), users.signin);

    app.get('/auth/google/callback', passport.authenticate('google', {
        failureRedirect: '/signin'
    }), users.redirectTo);*/

    // Setting the linkedin oauth routes
    app.get('/auth/linkedin',passport.authenticate('linkedin', {
        /*failureRedirect: '/#!/register',*/
        scope: [ 'r_emailaddress','r_fullprofile' ]
    }));

    app.get('/auth/linkedin/callback', function(req, res, next) {
        var errorMsg;
        if(req.query.oauth_problem){
            switch (req.query.oauth_problem){
                case 'user_refused':
                    errorMsg = 'You declined to login with Linkedin...';
                    break;
                default:
                    errorMsg = req.query.oauth_problem;
            }
            req.flash('error', errorMsg);
            return res.redirect('/#!/register');
        }
        passport.authenticate('linkedin', function(err, user, info) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/#!/register');
            }
            if (!user) {
                return res.send(401, info);
            }
            req.login(user, function(err) {
                if (err) {
                    return next(err);
                }
                return res.redirect('/');
            });
        })(req, res, next);
    });

    /*app.get('/auth/linkedin/callback', app.passport.authenticate('linkedin', {
        failureRedirect: '/#!/register'
    }), function(req,res,next){
        console.log('/auth/linkedin/callback');
        next();
    });*/

};
