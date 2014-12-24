'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * ProductCategory Schema
 */
var ProductCategorySchema = new Schema({
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
    expression: {
        type: String,
        trim: true,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    expectedValue: {
        type: Number,
        required: true
    }
});

/**
 * Validations
 */

/*
 ProductCategorySchema.path('product').required(true, 'Product cannot be blank');
 ProductCategorySchema.path('category').required(true, 'Category cannot be blank');
 */

mongoose.model('ProductCategory', ProductCategorySchema);
