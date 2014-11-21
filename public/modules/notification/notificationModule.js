'use strict';

angular.module('sapience.system.notification', ['ui.router']).constant('ColorCoding', {
    info: 'success',
    error: 'danger'
}).run(function($rootScope, NotificationService) {
    $rootScope.$on('$locationChangeSuccess', function(evt, from, to) {
        if (from !== to) {
            NotificationService.reset();
        }
    });
});