'use strict';

// Products routes use connectors controller
var connectors = require('../controllers/connector');

module.exports = function(app) {

    app.get('/crud/connectors', connectors.all);
    app.post('/crud/connectors', connectors.create);
    app.get('/crud/connectors/:connectorId', connectors.findOne);
};