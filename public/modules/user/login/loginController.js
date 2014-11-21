'use strict';

angular.module('sapience.system.user').controller('LoginController', ['$rootScope', '$scope', '$state', 'UserService', 'NotificationService',
    function($rootScope, $scope, $state, UserService, NotificationService) {
        $scope.login = function() {
            NotificationService.reset();
            UserService.login($scope.user).then(function() {
                var loginState = $state.get('login'),
                    loginData = loginState.data || {};
                $state.go(loginData.fromState || 'home', loginData.fromParams);
                NotificationService.info('You have been successfully authenticated.');
            }, function(err) {
                NotificationService.error({message: err, timeout: false});
            });
        };
    }
]);
