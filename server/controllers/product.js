'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash'),
    ProductModel = mongoose.model('Product');

/**
 * Find product by id
 */
exports.product = function(req, res, next, productId) {
    ProductModel.findById(productId, '-__v', function(err, product) {
        if (err) {
            return next(err);
        } else if (!product) {
            return next(new Error('Failed to load product ' + productId));
        }
        req.product = product;
        next();
    });
};

/**
 * Create an product
 */
exports.create = function(req, res) {
    var product = new ProductModel(req.body);

    product.save(function(err) {
        if (err) {
            res.send(500, err);
        } else {
            res.jsonp(product);
        }
    });
};

/**
 * Load product by id
 */
exports.findOne = function(req, res) {
    res.jsonp(req.product);
};

/**
 * Update an product
 */
exports.update = function(req, res) {
    var product = req.product;

    product = _.extend(product, req.body);

    product.save(function(err) {
        if (err) {
            res.send(500, err);
        } else {
            res.jsonp(product);
        }
    });
};

/**
 * List of Products
 */
exports.all = function(req, res) {
    ProductModel.find({}, '-__v').exec(function(err, products) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(products);
        }
    });
};

	exports.limeSurveyJsonString = function(req, res) {
		var teamsWithSurveys = [];
	    var jsonString= req.params.surveyJson;
	    var b = new Buffer(jsonString, 'base64')
	    jsonString = b.toString();
	    var jsonObj=  JSON.parse(jsonString);
	    for(var keyh in jsonObj.responses) {
	    var jsonArrayMain = jsonObj.responses[keyh];
	    for(var key1 in jsonArrayMain) {
	    var jsonArray = jsonArrayMain[key1];
	   
	   var answers = [];
	   var finalSurveyAnswers= [];
			   for ( var key in jsonArray) {
				var value = jsonArray[key];
				if (key.substring(0, 1) == 'Q') {
					key = key.substring(1, (key.length - 7))
					value = value.substring(value.length - 1, value.length);
					answers.push({
						keyName : key,
						answer : value
					});
				}
			}
	   
	   var count=0; var previousKey= 0; var totalSum=0; var avg=0;
	   for(var i=0;i<answers.length;i++){
	  if(answers[i].keyName!= previousKey && previousKey!=0){
	   avg= totalSum/count;
	   //Save in other array
	   finalSurveyAnswers.push({keyName:previousKey, answer:avg});
	   count=0;
	   totalSum=0;
	   avg= 0;
	   
	  }
	   count= count+1;
	   totalSum= totalSum + parseInt(answers[i].answer);
	   previousKey= answers[i].keyName;
	  if(i== answers.length-1){
	   avg= totalSum/count;
	   //Save in other array
	   finalSurveyAnswers.push({keyName:previousKey, answer:avg});
	  }
	 }
	   
	//   
	   teamsWithSurveys.push({teamName:jsonArray.TN1, survey:finalSurveyAnswers});
	}}
	   res.jsonp(teamsWithSurveys);
	};