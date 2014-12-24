'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    targetMetricModel = mongoose.model('TargetMetric');

/**
 * List of Metrics
 */
/*exports.allTargetmetrics = function(req, res) {
    targetMetricModel.find({}, '-__v').populate([{
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

create targetMetric

exports.createTargetmetrics = function(req, res) {
    var targetMetric = new targetMetricModel(req.body);

    targetMetric.save(function(err) {
        if (err) {
            res.send(500, err);
        } else {
            res.jsonp(targetMetric);
        }
    });
};*/