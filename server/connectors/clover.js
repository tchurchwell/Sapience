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
    dateFormat = require('dateformat'),
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
        
        console.log('outside end function');
        
        res.on('end', function() {

        	console.log('inside end function');
            var metrixData = xml.substring(170, 445);

            var coveredElementsPos, coveredElementsSelectedData, coveredElementsRequestedData,
                totalElementsPos, totalElementsSelectedData, totalElementsRequestedData,
                statementsPos, statementsSelectedData, statementsRequestedData,
                methodsPos, methodsSelectedData, methodsRequestedData,
                complexityPos, complexitySelectedData, complexityRequestedData;

            if (S(tagName).contains('Code Coverage')) {

                console.log('inside code coverage');

                coveredElementsPos = S(metrixData).indexOf('coveredelements');
                coveredElementsSelectedData = metrixData.substr(coveredElementsPos, metrixData.length);
                coveredElementsRequestedData = S(coveredElementsSelectedData).between('"', '"').s;

                console.log('covered element is ' + coveredElementsRequestedData);

                totalElementsPos = S(metrixData).indexOf(' elements');
                totalElementsSelectedData = metrixData.substr(totalElementsPos, metrixData.length);
                totalElementsRequestedData = S(totalElementsSelectedData).between('"', '"').s;

                console.log('total elements is ' + totalElementsRequestedData);

                var codeCoverage = S((S(coveredElementsRequestedData).toInt() / S(totalElementsRequestedData).toInt()) * 100).toString();

                console.log('final code coverage is ' + codeCoverage);

                deferred.resolve(codeCoverage);

            } else if (S(tagName).contains('Statements per Method')) {

                console.log('inside statement per method');

                statementsPos = S(metrixData).indexOf(' statements');
                statementsSelectedData = metrixData.substr(statementsPos, metrixData.length);
                statementsRequestedData = S(statementsSelectedData).between('"', '"').s;

                console.log('required statements is ' + statementsRequestedData);

                methodsPos = S(metrixData).indexOf('methods');
                methodsSelectedData = metrixData.substr(methodsPos, metrixData.length);
                methodsRequestedData = S(methodsSelectedData).between('"', '"').s;

                console.log('required methods is ' + methodsRequestedData);

                var statementsPerMethods = S(S(statementsRequestedData).toInt() / S(methodsRequestedData).toInt()).toString();

                console.log('final statementsPerMethods is ' + statementsPerMethods);

                deferred.resolve(statementsPerMethods);

            } else {

                console.log('inside cyclomatic complexity');

                complexityPos = S(metrixData).indexOf('complexity');
                complexitySelectedData = metrixData.substr(complexityPos, metrixData.length);
                complexityRequestedData = S(complexitySelectedData).between('"', '"').s;

                console.log('required complexity is ' + complexityRequestedData);

                methodsPos = S(metrixData).indexOf('methods');
                methodsSelectedData = metrixData.substr(methodsPos, metrixData.length);
                methodsRequestedData = S(methodsSelectedData).between('"', '"').s;

                console.log('required methods is ' + methodsRequestedData);

                var cyclomaticComplexity = S(S(complexityRequestedData).toInt() / S(methodsRequestedData).toInt()).toString();

                console.log('final cyclomaticComplexity is : ' + cyclomaticComplexity);

                deferred.resolve(cyclomaticComplexity);
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
        name: 'Clover'
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
                        
                        var ts_hms = new Date();
                        var day=dateFormat(ts_hms, 'yyyy-mm-dd');
                   //     currentDate.format('dd-mm-yyyy');

                        fetchReq.then(function(jenkinsData) {
                            var metric = new MetricModel({
                                product: productCategory.product,
                                category: productCategory.category,
                                value: jenkinsData,
                                created: day
                            });
                            
                            MetricModel.find({product: productCategory.product,
                                category: productCategory.category,
                                created: day}, '-__v').exec(function(err, metrics) {
                                	console.log(metrics);
                                	var existingMetrics=metrics;
                                if (metrics==='') {
                                	console.log('inside if statement');
                                	metric.save(function(err) {
                                        if (err) {
                                            console.error('### Error in saving clover to db', err);
                                        } else {
                                            console.log('### saving clover data to db');
                                        }
                                    });
                                } else {
                                    console.log('No need to add duplicate entry:inside else statement');
                                    var updatedMetric = {
                                        product: existingMetrics[0].product,
                                        category: existingMetrics[0].category,
                                        value: jenkinsData
                                    };
                                    
                                    console.log('updated metric is : '+ updatedMetric);
                                   MetricModel.findOne({_id: metrics[0]._id}, function(err, preMetric){
                            	        _.extend(preMetric, updatedMetric);
                            	        preMetric.save(function(err) {
                            	            if (err) {
                            	                res.send(500, err);
                            	            } else {
                            	                res.jsonp(preMetric);
                            	            }
                            	        });
                            	    });
                                    
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