'use strict';

angular.module('sapience.system.user').factory('UserResource', ['$base64', '$resource',
    function(Base64, $resource) {
        return $resource('/auth/login', {}, {
            login: {
                method: 'POST',
                transformRequest: function(data) {
                    data.password = Base64.encode(data.password);
                    return JSON.stringify(data);
                }
            },
            logout: {
                method: 'GET',
                url: '/auth/logout'
            },
            register: {
                method: 'POST',
                url: '/auth/register'
            }
        });
    }
]);
