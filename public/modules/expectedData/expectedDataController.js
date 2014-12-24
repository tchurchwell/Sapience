'use strict';

angular.module('sapience.system').controller('expectedDataController', ['$scope', 'NotificationService' , '$http', function($scope, NotificationService, $http) {
	
	$scope.expectedDataFormModel={
    		selectedProductId : '',
    		selectedCategoryId : '',
    		selectedExpression : '',
    		selectedExpectedValue : ''
    };

    $http.get('/crud/platforms').success(function(data) {
        $scope.platforms = [];
        data.forEach(function(nplatform, index) {
            var platform = {id: nplatform._id, name: nplatform.name};
            $scope.platforms.push(platform);
        });
    });
    
    $scope.abc='';
    $scope.saveSelectedProducts = function(product){
    	$("#select_product").text(product.name);
    	$scope.selectedProductId=product.id;
    	console.log('inside save select product method : '+ product.id);
    };
    
    $scope.saveSelectedCategory = function(category){
    	$("#select_category").text(category.name);
    	$scope.selectedCategoryId=category.id;
    	console.log('inside save select category method : '+ category.id);

    	$http.get('/crud/product/'+$scope.selectedProductId+'/category/'+$scope.selectedCategoryId).success(function(productCategory) {
    		$scope.fetechedOjbect=productCategory;
    		
    		$scope.fetechedOjbect.forEach(function(prodCat){
				
				$scope.indexId=true;
				$scope.loginbox=false;
				$scope.fetchedPCategoryObject=prodCat;
    		});
    		$scope.expectedDataFormModel.selectedExpectedValue=$scope.fetchedPCategoryObject.expectedValue;
    		$scope.expectedDataFormModel.selectedExpression=$scope.fetchedPCategoryObject.expression;
    	});
    };
    
    $scope.fetchProducts=function(platform){
    	$("#select_platform").text(platform.name);
    	
    	 $http.get('/crud/products').success(function(data) {
    	    	$scope.products = [];
    	    	$scope.filteredProducts=[];
    	        data.forEach(function(product, index) {
    	            var product = {'id': product._id, 'selected':false, 'name': product.name,'platform': product.platform};
    	          
    	            if(product.platform==platform.id){
    	    			$scope.filteredProducts.push(product);
    	    		}
    	        });
    	    });
    };
    
    $scope.submitExpectedData=function(expectedDataFormModel){
    	expectedDataFormModel.selectedProduct=$scope.selectedProductId;
    	expectedDataFormModel.selectedCategory=$scope.selectedCategoryId;
    	
    	$http.get('/crud/product/'+expectedDataFormModel.selectedProduct+'/category/'+expectedDataFormModel.selectedCategory).success(function(productCategory) {
    		$scope.fetechedOjbect=productCategory;
    		
    		$scope.fetechedOjbect.forEach(function(prodCat){
				
				$scope.indexId=true;
				$scope.loginbox=false;
				$scope.fetchedPCategoryObject=prodCat;
    		});
    		$scope.fetchedPCategoryObject.expectedValue=expectedDataFormModel.selectedExpectedValue;
    		$scope.fetchedPCategoryObject.expression=expectedDataFormModel.selectedExpression;
    		$http.put('/crud/productCategory/update' ,  $scope.fetchedPCategoryObject).success(function(data) {
    			 NotificationService.reset();
    			 NotificationService.info('Data Successfully Saved...');
    	        })
    	})
    }

    //
    $http.get('/crud/connectors').success(function(data) {
        $scope.connectors = [];
        data.forEach(function(nconnector, index) {
            var connector = {id: nconnector._id, name: nconnector.name};
            $scope.connectors.push(connector);
        });
    });

    //
    $scope.fetchCategories=function(connector){
    $("#select_connector").text(connector.name);
   	 $http.get('/crud/categories').success(function(data) {
   		$scope.filteredCategories=[];
   	    	$scope.categories1 = [];
   	        data.forEach(function(category, index) {
   	            var category = {'id': category._id, 'name': category.name,'connector': category.connector};
   	           // $scope.categories1.push(category);
   	         if(category.connector==connector.id){
   	   			$scope.filteredCategories.push(category);
   	   		}
   	        });
   	    });
 
   };
    
   

}]);