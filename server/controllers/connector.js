'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    ConnectorModel = mongoose.model('Connector');

/**
 * Create an connector
 */
exports.create = function(req, res) {
    var connector = new ConnectorModel(req.body);

    connector.save(function(err) {
        if (err) {
            res.send(500, err);
        } else {
            res.jsonp(connector);
        }
    });
};

/**
 * Load connector by id
 */
exports.findOne = function(req, res) {
    ConnectorModel.findById(req.params.connectorId, function(err, connector) {
        if (err) {
            res.send(500, err);
        }
        res.jsonp(connector);
    });
};

/**
 * List of Connectors
 */
exports.all = function(req, res) {
    ConnectorModel.find({}, '-__v').exec(function(err, connectors) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(connectors);
        }
    });
};
