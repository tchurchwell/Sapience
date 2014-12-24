'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Connector Schema
 */
var ConnectorSchema = new Schema({
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
    created: {
        type: Date,
        default: Date.now
    }
});

/**
 * Validations
 */

/*ConnectorSchema.path('name').required(true, 'Connector cannot be blank');*/

//ConnectorSchema.statics.load = function(id, cb) {
//    this.findOne({
//        _id: id
//    }, '-__v').populate('parent', 'name').exec(cb);
//};

mongoose.model('Connector', ConnectorSchema);
