'use strict';

// Products routes use metrics controller
var metrics = require('../controllers/metric');

module.exports = function(app) {

    app.get('/crud/metrics', metrics.all);
};
