'use strict';

// Products routes use products controller
var products = require('../controllers/product'),
    productCategories = require('../controllers/productCategory'),
    jiraConnector = require('../connectors/jira'),
    jenkinsConnector = require('../connectors/jenkin'),
    cloverConnector = require('../connectors/clover'),
    sonarConnector = require('../connectors/sonar');

module.exports = function(app) {

    app.get('/jira/fetch', jiraConnector.fetch);
    app.get('/jenkins/fetch', jenkinsConnector.fetch);
    app.get('/clover/fetch', cloverConnector.fetch);
    app.get('/sonar/fetch', sonarConnector.fetch);

    app.get('/crud/products', products.all);
    app.post('/crud/products', products.create);
    app.get('/crud/products/:productId', products.findOne);
    app.put('/crud/products/:productId', products.update);

    app.get('/crud/products/:productId/categories', productCategories.all);
    app.post('/crud/products/:productId/categories', productCategories.create);
    app.get('/crud/productCategoriesExpectedData', productCategories.fetchProductCategoriesExpectedData);
    app.get('/crud/product/:productId/category/:categoryId', productCategories.findDataBySelectedProductAndCategory);
    app.put('/crud/productCategory/update', productCategories.update);
  //  app.put('/crud/productCategory/:_id', productCategories.update);
    
    

    app.param('productId', products.product);
    app.get('/crud/products/survey/:surveyJson', products.limeSurveyJsonString);
    
   /* app.get('/crud/targetMetrics', targetExpMetrics.all);
    app.post('/crud/targetMetrics', targetExpMetrics.create);*/
};
