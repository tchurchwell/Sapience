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

    var expression = productCategory.expression.split(',');

    var url = expression[0];

    var tagName = expression[1];

    var deferred = Q.defer();

    http.get(url, function(res) {

        var xml = '';

        res.on('data', function(chunk) {
            xml += chunk;
        });

        res.on('end', function() {

            var pos;

            if (S(tagName).contains('Code Coverage')) {

                console.log('inside code coverage');

                pos = S(xml).indexOf('m_coverage');
                var secondCodeCoverageSelectedValue = S(xml.substring(pos, pos + 30)).between('>', '%').s;
                var codeCoverage = S(secondCodeCoverageSelectedValue).replaceAll(' ', '').s;
                console.log('Final Required code coverage value is : ' + codeCoverage);

                deferred.resolve(codeCoverage);

            } else if (S(tagName).contains('Statements per Method')) {

                console.log('inside statement per method');

                pos = S(xml).indexOf('m_statements');
                var secondStatementSelectedValue = S(xml.substring(pos + 14, pos + 30)).between('>', '<').s;
                var statementsRequestedData = S(secondStatementSelectedValue).replaceAll(' ', '').replaceAll(',', '').s;
                console.log('Final Required statement value is : ' + statementsRequestedData);

                var pos2 = S(xml).indexOf('m_functions');

                var secondSelectedValue = S(xml.substring(pos2 + 14, pos2 + 30)).between('>', '<').s;

                var methodsRequestedData = S(secondSelectedValue).replaceAll(' ', '').replaceAll(',', '').s;

                console.log('Final required method is : ' + methodsRequestedData);

                var statementsPerMethods = S(S(statementsRequestedData).toInt() / S(methodsRequestedData).toInt()).toString();

                console.log('final statementsPerMethods in sonar is ' + statementsPerMethods);

                deferred.resolve(statementsPerMethods);

            } else {

                console.log('inside cyclomatic complexity');

                pos = S(xml).indexOf('m_function_complexity');
                var secondCycloCompSelectedValue = S(xml.substring(pos, pos + 30)).between('>', '<').s;
                var cyclomaticComplexity = S(secondCycloCompSelectedValue).replaceAll(' ', '').replaceAll(',', '').s;
                console.log('Final Required cyclomatic complexity value in sonar is : ' + cyclomaticComplexity);

                deferred.resolve(cyclomaticComplexity);
            }

            console.log('response ended for url : ' + url);
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
        name: 'Sonar'
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
