'use strict';

angular.module('sapience.system').controller('adminController', ['$scope', function($scope) {

    $scope.entry = [
		{
			'name': 'Platforms',
			'display': 'PLATFORMS'
		},{
			'name': 'Products',
			'display': 'PRODUCTS'
		},{
			'name': 'Metrics',
			'display': 'METRICS'
		}
    ];
}]);