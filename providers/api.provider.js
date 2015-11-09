(function() {
    'use strict';

    angular
        .module('api')
        .provider('apiHelper', apiHelperProvider);

    /**
     * An API Helper that allows you to make
     * requests to REST API's.
     */
    function apiHelperProvider() {
        /* jshint validthis:true */

        var config = {
            baseUrl: ''
        };

        assignGlobalMethods(this);

        this.$get = apiHelperFactory;

        apiHelperFactory.$inject = ['$http'];

        /**
         * Assigns the global methods to the given contextObj.
         * This is useful for methods that need to be available
         * at the config and run stages.
         * @param  {Object} contextObj The object to be used as the context object
         */
        function assignGlobalMethods(contextObj) {
            var globalMethods = {
                getBaseUrl: getBaseUrl,
                setBaseUrl: setBaseUrl
            };

            for(var key in globalMethods) {
                contextObj[key] = globalMethods[key];
            }
        }

        /**
         * Helper factory which is run at run stage
         * of Angular lifecycle.
         * @param  {[type]} $http Injected $http object
         * @return {Object} The factory object
         */
        function apiHelperFactory($http) {
            var factory = {
                get: prepareGetRequest
            };

            assignGlobalMethods(factory);

            return factory;

            /**
             * Appends the default response transformations
             * to the new response transformation
             * @param  {Array|Function} defaults The default response transformation(s)
             * @param  {Function} transform The new response transformation
             * @return {Array}
             */
            function appendDefaultResponseTransform(defaults, transform) {
                // We can't guarantee that the default transformation is an array
                defaults = angular.isArray(defaults) ? defaults : [defaults];
                // Append the new transformation to the defaults
                return defaults.concat(transform);
            }

            /**
             * Perform the HTTP request via Angular $http
             * @return {Object} Promise object
             */
            function performRequest() {
                var requestObj = this;
                return $http({
                    method: requestObj.httpMethod.toUpperCase(),
                    transformResponse: appendDefaultResponseTransform($http.defaults.transformResponse, function(value) {
                        return requestObj.responseTransformer ? requestObj.responseTransformer.transform(value) : value;
                    }),
                    url: requestObj.fullUrl
                });
            }

            /**
             * Creates an API request object ready
             * to make the http request
             * @param  {string} relativeUrl The relative url part of the API call
             * @param  {string} httpMethod The http method for the request e.g. "get" or "post"
             * @return {Object} The request object
             */
            function prepareApiRequest(relativeUrl, httpMethod) {
                return {
                    httpMethod: httpMethod,
                    fullUrl: getBaseUrl() + relativeUrl,
                    request: performRequest,
                    setResponseTransformer: setResponseTransformer
                };
            }

            /**
             * Prepare an HTTP get request
             * @param  {string} relativeUrl The relative url part of the API call
             * @return {Object} The request object
             */
            function prepareGetRequest(relativeUrl) {
                return prepareApiRequest(relativeUrl, "get");
            }

            /**
             * Sets the response transformer for the request
             * Note: The response transformer MUST have a method
             * named 'transform' defined to handle the transformation
             * @return {Object} The request object
             */
            function setResponseTransformer(responseTransformer) {
                this.responseTransformer = responseTransformer;
                return this;
            }

        }

        /**
         * Get the base url for the API Helper
         * @return {string} The base url
         */
        function getBaseUrl() {
            return config.baseUrl;
        }

        /**
         * Sets the base url for the API Helper
         * @param {string} baseUrl The base url
         */
        function setBaseUrl(baseUrl) {
            config.baseUrl = baseUrl;
        }
    }
})();
