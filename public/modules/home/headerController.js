'use strict';

angular.module('sapience.system').controller('HeaderController', ['$scope', 'UserService', function($scope, UserService) {

    $scope.menu = [
        
    ];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = UserService.isUserAuthenticated;
    $scope.getUser = UserService.getUser;
}
]);
