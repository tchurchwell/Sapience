angular.module('sapience.masters').controller('ProductListController', ['$window', '$scope', 'ProductResource', function($window, $scope, ProductResource) {
    $scope.products = ProductResource.query();

    /*$scope.delete = function(product) {
        var choice = $window.confirm('Are you sure?');
        if (choice) {
            product.$delete({id: product._id}).then(function() {
                console.log('Product deleted successfully');
            }).catch(function(err) {
                console.error('Error occurred while deleting product', err);
            });
        }
    }*/
}]);