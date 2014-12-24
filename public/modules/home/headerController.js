'use strict';

angular.module('sapience.system').controller('HeaderController', ['$scope', 'UserService', function($scope, UserService) {

    $scope.menu = [
        {
            'title': 'Dashboard',
            'state': 'DASHBOARD'
        }/*,{
            'title': 'Expected Data',
            'state': 'EXPECTED-DATA'
        },{
         'title': 'MyProfile',
         'state': 'MYPROFILE'
         },{
         'title': 'Products',
         'state': 'PRODUCT-LIST'
         }*/
    ];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = UserService.isUserAuthenticated;
    $scope.getUser = UserService.getUser;
}
]);
