'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    MetricModel = mongoose.model('Metric');

/**
 * Metrics by product and category
 */
exports.metrics = function(req, res) {
    var product = req.params.productId;
    var category = req.params.category;
    MetricModel.metrics(product, category, function(err, metrics) {
        if (err) {
            res.send(500, err);
        }
        res.jsonp(metrics);
    });
};
