'use strict';

// Products routes use platforms controller
var platforms = require('../controllers/platform');

module.exports = function(app) {

    app.get('/crud/platforms', platforms.all);
    app.post('/crud/platforms', platforms.create);
    app.get('/crud/platforms/:platformId', platforms.findOne);
};
