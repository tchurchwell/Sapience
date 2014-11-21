'use strict';

var User = require('../controllers/user');
/*
 var SessionManager = require('./../../modules/session/session'),
 authorization = require('./../../modules/authorization/authorization'),
 authErrorCodes = require('./../../modules/session/authErrorCodes');
 */

module.exports = function(app) {

    function decodePassword(req, res, next) {
        req.body.password = new Buffer(req.body.password, 'base64').toString('ascii');
        next();
    }

    app.post('/auth/login', decodePassword, function(req, res, next) {
        app.passport.authenticate('local', function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.send(401, info);
            }
            req.login(user, function(err) {
                if (err) {
                    return next(err);
                }
                return res.send(req.user || user);
            });
        })(req, res, next);
    });

    app.get('/auth/logout', function(req, res) {
        req.logout();
        res.send(200);
    });
};
