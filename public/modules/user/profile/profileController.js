'use strict';

angular.module('sapience.system.user').controller('ProfileController', ['$scope', '$state', 'lodash', 'UserService', 'NotificationService',
    function($scope, $state, _, UserService, NotificationService) {
        $scope.user = UserService.getUser();
        $scope.update = function() {
            NotificationService.reset();
            UserService.update($scope.user).then(function() {
                $state.go('home');
                NotificationService.info('Profile updated Successfully...');
            }).catch(function(errors) {
                if (angular.isArray(errors)) {
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
