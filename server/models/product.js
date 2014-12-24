'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Product Schema
 */
var ProductSchema = new Schema({
    code: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    platform: {
    	 type: Schema.ObjectId,
         ref: 'Platform',
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

/*ProductSchema.path('name').required(true, 'Product cannot be blank');*/

mongoose.model('Product', ProductSchema);
