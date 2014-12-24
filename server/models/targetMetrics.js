'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Metric Schema
 */
var TargetMetricSchema = new Schema({
    product: {
        type: Schema.ObjectId,
        ref: 'Product',
        required: true
    },
    category: {
        type: Schema.ObjectId,
        ref: 'Category',
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

/**
 * Validations
 */
/*

 MetricSchema.path('product').required(true, 'Product cannot be blank');
 MetricSchema.path('category').required(true, 'Category cannot be blank');
 */

/**
 * MetricModel.metrics
 * Load all metrics of product by category
 */
TargetMetricSchema.statics.metrics = function(product, category, cb) {
    this.find({
        product: product,
        category: product
    }).exec(cb);

};

mongoose.model('TargetMetric', TargetMetricSchema);
