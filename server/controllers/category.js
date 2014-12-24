'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash'),
    CategoryModel = mongoose.model('Category');

/**
 * Find category by id
 */
exports.category = function(req, res, next, categoryId) {
    CategoryModel.load(categoryId, function(err, category) {
        if (err) {
            return next(err);
        } else if (!category) {
            return next(new Error('Failed to load category ' + categoryId));
        }
        req.category = category;
        next();
    });
};

/**
 * Create an category
 */
exports.create = function(req, res) {
    var category = new CategoryModel(req.body);

    category.save(function(err) {
        if (err) {
            res.send(500, err);
        } else {
            res.jsonp(category);
        }
    });
};

/**
 * Load category by id
 */
exports.show = function(req, res) {
    res.jsonp(req.category);
};

/**
 * Update an category
 */
exports.update = function(req, res) {
    var category = req.category;

    category = _.extend(category, req.body);

    category.save(function(err) {
        if (err) {
            res.send(500, err);
        } else {
            res.jsonp(category);
        }
    });
};

/**
 * List of Categories
 */
exports.all = function(req, res) {
    CategoryModel.find({}, '-__v').exec(function(err, categories) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(categories);
        }
    });
};
