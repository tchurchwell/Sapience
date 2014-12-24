'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    http = require('http'),
    _ = require('lodash'),
    S = require('string'),
    Q = require('q'),
    MetricModel = mongoose.model('Metric'),
    ConnectorModel = mongoose.model('Connector'),
    CategoryModel = mongoose.model('Category'),
    ProductCategoryModel = mongoose.model('ProductCategory');

function getValueFromProductCategory(productCategory) {

    var mainExpress = productCategory.expression;

    var expression = mainExpress.split(',');

    var url = expression[0];

    var tagName = expression[1];

    var deferred = Q.defer();

    http.get(url, function(res) {

        var xml = '';

        res.on('data', function(chunk) {
            xml += chunk;
        });

        res.on('end', function() {

            var pos, newSelectedData, requestedData;

            if (S(mainExpress).contains('Cucumber')) {

                console.log('Entering for url : ' + url);

                var totalCount = S(xml).count('classname="Then');

                deferred.resolve(totalCount);

            } else if (S(mainExpress).contains('Omni-PST-Build')) {

                console.log('Entering for url : ' + url);

                pos = S(xml).indexOf('tests');
                newSelectedData = xml.substring(pos - 9, pos);

                requestedData = S(newSelectedData).replaceAll(' ', '').replaceAll(',', '').s;

                deferred.resolve(requestedData);

            } else if (S(mainExpress).contains('total')) {

                console.log('Entering for url : ' + url);

                var metrixData = xml.substring(39, 103);

                pos = S(metrixData).indexOf(tagName);

                newSelectedData = metrixData.substr(pos, metrixData.length);
                requestedData = S(newSelectedData).between('"', '"').s;

                deferred.resolve(requestedData);

            }
        });

    }).on('error', function(e) {
        console.error('Got error: ' + e);
        deferred.reject(e);
    });

    return deferred.promise;

}

exports.fetch = function(req, res) {

    var metrics = [],
        fetchRequests = [],
        categoryIds = [];

    ConnectorModel.find({
        name: 'Jenkins'
    }, function(err, connectors) {

        CategoryModel.find({
            connector: connectors[0]._id
        }, function(err, categories) {

            _.each(categories, function(category) {
                categoryIds.push(category._id);
            });

            ProductCategoryModel.find({
                category: {
                    $in: categoryIds
                }
            }, function(err, productCategories) {

                console.log('The filtered ProductCategory list is : ' + productCategories);
                if (!err) {
                    _.each(productCategories, function(productCategory) {

                        var fetchReq = getValueFromProductCategory(productCategory);

                        fetchReq.then(function(jenkinsData) {
                            var metric = new MetricModel({
                                product: productCategory.product,
                                category: productCategory.category,
                                value: jenkinsData
                            });
                            metric.save(function(err) {
                                if (err) {
                                    console.error('### Saving to db', err);

                                } else {
                                    console.log('### Saved data to db');
                                }
                            });
                            metrics.push(metric);
                        });
                        fetchRequests.push(fetchReq);
                    });

                    Q.all(fetchRequests).then(function() {
                        res.send(metrics);
                    }).fail(function(error) {
                        console.error(arguments);
                        res.send(500, {
                            error: error.stacktrace || error,
                            data: metrics
                        });
                    });
                }

            });

        });
    });
};
