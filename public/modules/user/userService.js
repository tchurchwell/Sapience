'use strict';

angular.module('sapience.system.user').factory('UserService', ['$q', 'Global', 'UserResource',
    function($q, Global, UserResource) {
        var userAuthenticated = Global.authenticated,
            loggedInUser = new UserResource(Global.user);

        function sanitizeMessage(response) {
            var message = response && response.data;
            return message.message || message;
        }

        function onAuthenticateChange(deferredReq, authenticate) {
            var deferred = $q.defer(),
                promise = deferred.promise;

            deferredReq.then(function() {
                userAuthenticated = authenticate;
                deferred.resolve();
            }).catch(function(response) {
                userAuthenticated = !authenticate;
                var message = sanitizeMessage(response);
                deferred.reject(message);
            });
            return promise;
        }

        return {
            isUserAuthenticated: function() {
                return userAuthenticated;
            },
            register: function(user) {
                loggedInUser = new UserResource(user);
                return onAuthenticateChange(loggedInUser.$register(), true);
            },
            login: function(user) {
                loggedInUser = new UserResource(user);
                return onAuthenticateChange(loggedInUser.$login(), true);
            },
            logout: function() {
                return onAuthenticateChange(loggedInUser.$logout(), false);
            },
            getUser: function() {
                return loggedInUser;
            }
        };
    }
]);
