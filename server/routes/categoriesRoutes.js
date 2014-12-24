'use strict';

// Products routes use categories controller
var categories = require('../controllers/category');

module.exports = function(app) {

    app.get('/crud/categories', categories.all);
    app.post('/crud/categories', categories.create);
    app.get('/crud/categories/:categoryId', categories.show);
    app.put('/crud/categories/:categoryId', categories.update);

    app.param('categoryId', categories.category);
};
