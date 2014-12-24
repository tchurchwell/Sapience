'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Category Schema
 */
var CategorySchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    connector: {
        type: Schema.ObjectId,
        ref: 'Connector',
        required: true
    },
    position: {
    	type: Number,
    	required: true
    },
    parent: {
        type: Schema.ObjectId,
        ref: 'Category'
    },
    created: {
        type: Date,
        default: Date.now
    }
});

/**
 * Validations
 */

/*CategorySchema.path('name').required(true, 'Category cannot be blank');*/

CategorySchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }, '-__v').populate('parent', 'name').exec(cb);
};

mongoose.model('Category', CategorySchema);
