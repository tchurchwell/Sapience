'use strict';

//Setting up route
angular.module('sapience').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        // For unmatched routes:
        $urlRouterProvider.otherwise('/');

        // states for my app
        $stateProvider.state('PRODUCT-LIST', {
            url: '/products',
            templateUrl: '/modules/products/views/productList.html'

        }).state('DASHBOARD', {
            url: '/dashboard',
            views: {
                '@': {
                    templateUrl: '/modules/dashboard/views/dashboard.html'
                },
                'sidebar@DASHBOARD': {
                    templateUrl: '/modules/productSelector/views/productSelector.html'
                }
            }

        }).state('EXPECTED-DATA', {
            url: '/expectedData',
            templateUrl: 'modules/expectedData/views/expectedData.html'

        }).state('ADMIN', {
            url: '/admin',
            templateUrl: '/modules/admin/views/admin.html'

        }).state('home', {
            url: '/',
            templateUrl: '/modules/home/views/home.html',
            data: {
                isSecured: false
            }
        });
    }
]);

//Setting HTML5 Location Mode
angular.module('sapience').config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
]);
