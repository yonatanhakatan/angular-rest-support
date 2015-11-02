(function() {
    'use strict';

    angular
        .module('api')
        .provider('apiHelper', apiHelperProvider);

    apiHelperProvider.$inject = [];

    function apiHelperProvider() {
        /* jshint validthis:true */

        var config = {
            baseUrl: ''
        };

        // These are methods that are available
        // at both the config and run stages
        var globalMethods = {
            getBaseUrl: getBaseUrl,
            setBaseUrl: setBaseUrl
        };

        // Expose methods to the provider
        exposeGlobalMethods(this);

        this.$get = apiHelperFactory;

        apiHelperFactory.$inject = [];

        /////////////////////////////////////////

        function apiHelperFactory() {
            var factory = {};
            // Expose methods to the factory so
            // they are available at runtime
            exposeGlobalMethods(factory);
            return factory;
        }

        function exposeGlobalMethods(context) {
            for(var key in globalMethods) {
                context[key] = globalMethods[key];
            }
        }

        function getBaseUrl() {
            return config.baseUrl;
        }

        function setBaseUrl(url) {
            config.baseUrl = url;
        }
    }
})();
