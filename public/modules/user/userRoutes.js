'use strict';

angular.module('sapience.system.user').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider) {
        $stateProvider.state('login', {
            url: '/login',
            templateUrl: '/modules/user/login/views/login.html'
        }).state('logout', {
            url: '/logout',
            templateUrl: '/modules/user/logout/views/logout.html'
        }).state('profile', {
            url: '/profile',
            templateUrl: '/modules/user/profile/views/profile.html'
        }).state('register', {
            url: '/register',
            templateUrl: '/modules/user/register/views/register.html',
            data: {
                isSecured: false
            }
        });
    }
])/*.config(function($httpProvider) {
    var logsOutUserOn401 = ['$q', '$injector',
        function($q, $injector) {

            var error = function(response) {
                var UserService = $injector.get('UserService'),
                    $state = $injector.get('$state');

                if (response.status === 401) {
                    UserService.logout();
                    $state.go('login');
                }
                return $q.reject(response);
            };

            return function(promise) {
                return promise.
                catch(error);
            };
        }
    ];

    $httpProvider.responseInterceptors.push(logsOutUserOn401);

})*/.run(function($rootScope, UserService, $state, lodash) {

    function saveCurrentState(loginState, fromState, fromParams) {
        loginState.data = loginState.data || {};
        loginState.data.fromState = fromState.name;
        loginState.data.fromParams = fromParams;
    }

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        /* If already logged in and going to login, then route to home */
        if (toState.name === 'login' && UserService.isUserAuthenticated()) {
            $state.go('home');
            event.preventDefault();
        }
        /* If redirecting to home and not coming from logout then save state to use after login */
        else if (toState.name === 'login' && !lodash.isEmpty(fromState.name) && fromState.name !== 'logout' && fromState.name !== 'register') {
            saveCurrentState(toState, fromState, fromParams);
        }
        /* If going to other than login and not logged in then save state and take to login */
        if ((toState.data ? toState.data.isSecured !== false : true) && toState.name !== 'login' && !UserService.isUserAuthenticated()) {
            if (toState.name !== 'logout' && fromState.name !== 'logout' && toState.name !== 'register' && fromState.name !== 'register') {
                var loginState = $state.get('login');
                saveCurrentState(loginState, toState, toParams);
            }
            $state.go('login');
            event.preventDefault();
        }
    });
});
