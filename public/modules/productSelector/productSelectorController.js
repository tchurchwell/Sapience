'use strict';

angular.module('sapience.charts').controller('ProductSelectorController', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {
    $http.get('/crud/products').success(function(data) {
    	$scope.products = [];
    	
        data.forEach(function(product, index) {
            var product = {'id': product._id, 'selected':false, 'name': product.name,'platform': product.platform};
            $scope.products.push(product);
        });
    });
    
    $http.get('/crud/metrics').success(function(dataMetrics) {
    	$scope.productsWithData = [];
    	$scope.metricsData = [];
    	$scope.products.forEach(function(product, index) {
    		
    		
    		dataMetrics.forEach(function(metric, index){
    			//console.log('product.name'+ product.id);
    			//console.log('metric.product.name'+ metric.product._id);
        		if(product.id == metric.product._id){
        			//console.log('dataMetrics'+ metric.product.name);
        			$scope.productsWithData.push(product);
        		}
        	});
    		
    		
        });
    });
    
    $scope.actualDataModel=false;
    $scope.expectedDataModel=false;
    
    $http.get('/crud/platforms').success(function(data) {
        $scope.platforms = [];
        data.forEach(function(platform, index) {
            var platform = {id: platform._id, name: platform.name};
            $scope.platforms.push(platform);
        });
    });
    
    $scope.fetchProducts=function(platform, isCollapsed2){
    	
    	$scope.filteredPrroducts=[];
    	$scope.productsWithData.forEach(function(product,index){
    		
    		if(product.platform==platform.id && $scope.filteredPrroducts.indexOf(product) == -1){
    		$scope.filteredPrroducts.push(product);
    		}
    	});
    	
    };
    
   
    // function for showing responses
    $scope.selectSurvey = function(surveyId) {
    	$scope.selectedSurveyId= surveyId;
    	
    	var headers1 = {
    			'Access-Control-Allow-Origin' : '*',
    			'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
    			'Access-Control-Allow-Headers': 'X-Requested-With',
    			'Content-Type': 'application/json',
    			'Accept': 'application/json'
    		};

    	var request1 = $http({
    	method: "post",
    	headers: headers1,
    	url: "http://ec2-54-210-110-49.compute-1.amazonaws.com:8888/index.php/admin/remotecontrol",
    	data: {
    		method: "list_questions",
    		id: 1,
    	    params: {
    	    	sSessionKey: $scope.sessionKeySurvey,
    	    	iSurveyID : surveyId
    	    }
    	}
    	});
    	request1.success(
    	        function( data, status, headers, config ) {
    	        	$scope.limeSurveyQuestions=data.result;
    	         });  
    	
    	
 	   var headers = {
    			'Access-Control-Allow-Origin' : '*',
    			'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
    			'Access-Control-Allow-Headers': 'X-Requested-With',
    			'Content-Type': 'application/json',
    			'Accept': 'application/json'
    		};
 	   
    	var request = $http({
    	method: "post",
    	headers: headers,
    	url: "http://ec2-54-210-110-49.compute-1.amazonaws.com:8888/index.php/admin/remotecontrol",
    	data: {
    		method: "export_responses",
    		id: 1,
    	    params: {
    	    	sSessionKey: $scope.sessionKeySurvey,
    	    	iSurveyID: $scope.selectedSurveyId,
    	    	sDocumentType: 'json',
    	    	sLanguageCode: null,
    	    	sCompletionStatus: 'complete',
    	    	sHeadingType: 'code',
    	    	sResponseType: 'short',
    	    	iFromResponseID: null,
    	    	iToResponseID: null,
    	    	aFields: null
    	    }
    	}
    	
    	});
    	request.success(
    	        function( data1, status, headers, config ) {
	        	$http.get('/crud/products/survey/'+data1.result).success(function(data1) {
    	       	$rootScope.$broadcast('limeSurveySelection', data1, $scope.limeSurveyQuestions);
    	        });
	        	
    	       }
    	        );
 	   
    };

 // function for selected Practice
    $scope.practiceSelected = function(practiceSelectedId) {
    	
    	$scope.cfdump = "";
    	if(practiceSelectedId== 1){
    		
    		var headers = {
    				'Access-Control-Allow-Origin' : '*',
    				'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
    				'Access-Control-Allow-Headers': 'X-Requested-With',
    				'Content-Type': 'application/json',
    				'Accept': 'application/json'
    			};
    		
    	var request = $http({
            method: "post",
            headers: headers,
            url: "http://ec2-54-210-110-49.compute-1.amazonaws.com:8888/index.php/admin/remotecontrol",
            data: {
            	method: "get_session_key",
            	id: 1,
                params: {
                	username: "admin",
                	password: "admin"
                }
            }
        });

        // Store the data-dump of the FORM scope.
        request.success(
            function( initialData, status) {
            	$scope.sessionKeySurvey= initialData.result;
            	var headers1 = {
            			'Access-Control-Allow-Origin' : '*',
            			'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
            			'Access-Control-Allow-Headers': 'X-Requested-With',
            			'Content-Type': 'application/json',
            			'Accept': 'application/json'
            		};

            	var request1 = $http({
            	method: "post",
            	headers: headers1,
            	url: "http://ec2-54-210-110-49.compute-1.amazonaws.com:8888/index.php/admin/remotecontrol",
            	data: {
            		method: "list_surveys",
            		id: 1,
            	    params: {
            	    	sSessionKey: initialData.result,
            	    	sUser: "admin"
            	    }
            	}
            	});
            	request1.success(
            	        function( data, status, headers, config ) {
            	        	$scope.limeSurveyTitleResults=data.result;
            	          });        	        
            	});
            }
    };
    
    
    // function for Actual Data
    $scope.productSelected = function(application, actualDataModel) {
	    
        $rootScope.$broadcast('productSelection', application,'forActualData');
    };
    
    // function for Expected Data
    $scope.expectedProductSelected=function(application, expectedDataModel){
    	
    	if(expectedDataModel==false){
    		application.selected=false;
    	}
    	
    	$rootScope.$broadcast('productSelection', application,'forExpectedData');
    }
    
    
    $scope.practices=[{
        'id': '1',
        'name': 'Surveys'
    }];
    
}]);