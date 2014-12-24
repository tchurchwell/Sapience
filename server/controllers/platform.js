'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    PlatformModel = mongoose.model('Platform');

/**
 * Create an platform
 */
exports.create = function(req, res) {
    var platform = new PlatformModel(req.body);

    platform.save(function(err) {
        if (err) {
            res.send(500, err);
        } else {
            res.jsonp(platform);
        }
    });
};

/**
 * Load platform by id
 */
exports.findOne = function(req, res) {
	PlatformModel.findById(req.params.platformId, function(err, platform) {
        if (err) {
            res.send(500, err);
        }
        res.jsonp(platform);
    });
};

/**
 * List of Platforms
 */
exports.all = function(req, res) {
	PlatformModel.find({}, '-__v').exec(function(err, platforms) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(platforms);
        }
    });
};
