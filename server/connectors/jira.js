'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    http = require('http'),
    Q = require('q'),
    _ = require('lodash'),
    Buffer = require('buffer').Buffer,
    MetricModel = mongoose.model('Metric'),
    ConnectorModel = mongoose.model('Connector'),
    CategoryModel = mongoose.model('Category'),
    ProductCategoryModel = mongoose.model('ProductCategory');

function getIssueCountForProductCategory(productCategory) {
    var base64Encode = new Buffer('qametrics:quality').toString('base64'),
        reqData = {
            jql: productCategory.expression,
            maxResults: 0
        },
        options = {
            host: 'jira.cengage.com',
            port: '80',
            method: 'POST',
            path: '/rest/api/2/search',
            headers: {
                'Authorization': 'Basic ' + base64Encode,
                'Content-Type': 'application/json'
            }
        };

    var deferred = Q.defer(),
        fetchReq = http.request(options, function(jiraRes) {
            if (jiraRes.statusCode === 200) {
                // Buffer the body entirely for processing as a whole.
                var dataChunks = [];
                jiraRes.on('data', function(chunk) {
                    dataChunks.push(chunk);
                });

                jiraRes.on('end', function() {
                    var data = dataChunks.join(''),
                        jsonData = JSON.parse(data);
                    console.log('Data fetched from jira,', jsonData, 'for expression=', productCategory.expression);
                    deferred.resolve(jsonData);
                });
            } else {
                deferred.reject({
                    statusCode: jiraRes.statusCode,
                    productCategory: productCategory
                });
            }
        }).on('error', function(e) {
            console.error('Got error: ' + e);
            deferred.reject(e);
        });

    fetchReq.write(JSON.stringify(reqData));
    fetchReq.end();
    return deferred.promise;
}



function checkingForLinkedIN() {
    var base64Encode = new Buffer('sansar.mor146@gmail.com:S@n5!RMOR!@#RL').toString('base64'),
        reqData = {
            jql: 'skills',
            maxResults: 0
        },
        options = {
            host: 'https://www.linkedin.com/',
            port: '80',
            method: 'POST',
            path: '/rest/api/2/search',
            headers: {
                'Authorization': 'Basic ' + base64Encode,
                'Content-Type': 'application/json'
            }
        };

    var deferred = Q.defer(),
        fetchReq = http.request(options, function(jiraRes) {
            if (jiraRes.statusCode === 200) {
                // Buffer the body entirely for processing as a whole.
                var dataChunks = [];
                jiraRes.on('data', function(chunk) {
                    dataChunks.push(chunk);
                });

                jiraRes.on('end', function() {
                    var data = dataChunks.join(''),
                        jsonData = JSON.parse(data);
                    deferred.resolve(jsonData);
                });
            } else {
                deferred.reject({
                    statusCode: jiraRes.statusCode,
                });
            }
        }).on('error', function(e) {
            console.error('Got error: ' + e);
            deferred.reject(e);
        });

    fetchReq.write(JSON.stringify(reqData));
    fetchReq.end();
    return deferred.promise;
}
/**
 * Fetch database from jira and store into Metrics collection
 */

exports.fetch = function(req, res) {
	
	var fetchReq = checkingForLinkedIN();

	console.log('mil gaya : '+fetchReq);
	
    var metrics = [],
        fetchRequests = [],
        categoryIds = [];

    ConnectorModel.find({
        name: 'Jira'
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

                if (!err) {

                    console.log('The filtered ProductCategory list is : ' + productCategories);

                    _.each(productCategories, function(productCategory) {
                        var fetchReq = getIssueCountForProductCategory(productCategory);

                        fetchReq.then(function(jiraData) {
                            var metric = new MetricModel({
                                product: productCategory.product,
                                category: productCategory.category,
                                value: jiraData.total
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
