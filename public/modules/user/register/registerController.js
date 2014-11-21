'use strict';

angular.module('sapience.system.user').controller('RegisterController', ['$scope', '$state', 'lodash', 'UserService', 'NotificationService',
    function($scope, $state, _, UserService, NotificationService) {
        $scope.register = function() {
            NotificationService.reset();
            UserService.register($scope.user).then(function() {
                $state.go('home');
                NotificationService.info('Registration Successful...');
            }).catch(function(errors) {
                if (angular.isArray(errors) || angular.isObject(errors)) {
                    _.forEach(errors, function(err) {
                        err.timeout = false;
                        NotificationService.error(err);
                    });
                } else {
                    errors.timeout = false;
                    NotificationService.error(errors);
                }
            });
        };
    }
]);
