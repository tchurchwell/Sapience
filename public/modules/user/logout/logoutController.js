'use strict';

angular.module('sapience.system.user').controller('LogoutController', ['$scope', '$state', 'UserService',
    function($scope, $state, UserService) {
        if (UserService.isUserAuthenticated()) {
            UserService.logout();
        } else {
            $state.go('login');
        }
    }
]);
