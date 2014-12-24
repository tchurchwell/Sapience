'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    MetricModel = mongoose.model('Metric');

/**
 * List of Metrics
 */
exports.all = function(req, res) {
    MetricModel.find({}, '-__v').populate([{
        path: 'product',
        select: 'code name'
    }, {
        path: 'category',
        select: 'code name connector position'
    }]).exec(function(err, metrics) {
        if (err) {
            res.send(500, err);
        } else {
            res.jsonp(metrics);
        }
    });
};
