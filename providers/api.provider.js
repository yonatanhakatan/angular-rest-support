(function() {
    'use strict';

    angular
        .module('api')
        .provider('apiHelper', apiHelperProvider);

    apiHelperProvider.$inject = ['$httpProvider'];

    /**
     * An API Helper that allows you to make
     * requests to REST API's.
     */
    function apiHelperProvider($httpProvider) {
        /* jshint validthis:true */

        var config = {
            baseUrl: ''
        };

        assignGlobalMethods(this);

        this.$get = apiHelperFactory;
        this.setHeaders = setHeaders;

        apiHelperFactory.$inject = ['$http'];

        /**
         * Helper factory which is run at run stage
         * of Angular lifecycle.
         * @param  {[type]} $http Injected $http object
         * @return {Object} The factory object
         */
        function apiHelperFactory($http) {
            var factory = {
                get: prepareGetRequest,
                post: preparePostRequest,
                setDefaultErrorResponseTransformer: setDefaultErrorResponseTransformer,
                setDefaultRequestTransformer: setDefaultRequestTransformer,
                setDefaultResponseTransformer: setDefaultResponseTransformer
            };

            assignGlobalMethods(factory);

            return factory;

            /**
             * Appends the default request/response transformations
             * to the new request/response transformation
             * @param  {Array|Function} defaults The default request/response transformation(s)
             * @param  {Function} transform The new request/response transformation
             * @return {Array}
             */
            function appendDefaultTransform(defaults, transform) {
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
                var httpConfig = {
                    method: requestObj.httpMethod.toUpperCase(),
                    transformRequest: appendDefaultTransform($http.defaults.transformRequest, function(value) {
                        return requestObj.requestTransformer ?
                                angular.toJson(requestObj.requestTransformer.transform(angular.fromJson(value))) :
                                ( factory.defaultRequestTransformer ? angular.toJson(factory.defaultRequestTransformer.transform(angular.fromJson(value))) : value );
                    }),
                    transformResponse: appendDefaultTransform($http.defaults.transformResponse, function(value, headers, status) {
                        var responseTransformer, defaultResponseTransformer;
                        if(status >= 400 && status < 500) {
                            responseTransformer = requestObj.errorResponseTransformer;
                            defaultResponseTransformer = factory.defaultErrorResponseTransformer;
                        } else {
                            responseTransformer = requestObj.responseTransformer;
                            defaultResponseTransformer = factory.defaultResponseTransformer;
                        }
                        return responseTransformer ? responseTransformer.transform(value) : ( defaultResponseTransformer ? defaultResponseTransformer.transform(value) : value );
                    }),
                    url: requestObj.fullUrl
                };
                if(requestObj.headers) {
                    httpConfig.headers = requestObj.headers;
                }
                if(requestObj.requestData) {
                    var httpConfigProperty = httpConfig.method == "GET" ? "params" : "data";
                    httpConfig[httpConfigProperty] = requestObj.requestData;
                }
                return $http(httpConfig);
            }

            /**
             * Creates an API request object ready
             * to make the http request
             * @param  {string} relativeUrl The relative url part of the API call
             * @param  {string} httpMethod The http method for the request e.g. "get" or "post"
             * @param  {Object} requestData (Optional) The data to send as part of the request
             * @return {Object} The request object
             */
            function prepareApiRequest(relativeUrl, httpMethod, requestData) {
                return {
                    httpMethod: httpMethod,
                    fullUrl: getBaseUrl() + relativeUrl,
                    request: performRequest,
                    requestData: requestData,
                    setErrorResponseTransformer: setErrorResponseTransformer,
                    setHeaders: setHeaders,
                    setRequestTransformer: setRequestTransformer,
                    setResponseTransformer: setResponseTransformer
                };
            }

            /**
             * Prepare an HTTP GET request
             * @param  {string} relativeUrl The relative url part of the API call
             * @param  {Object} postData (Optional) The data to send for the API request
             * @return {Object} The request object
             */
            function prepareGetRequest(relativeUrl, requestData) {
                return prepareApiRequest(relativeUrl, "get", requestData);
            }

            /**
             * Prepare an HTTP POST request
             * @param  {string} relativeUrl The relative url part of the API call
             * @param  {Object} postData (Optional) The data to send for the API request
             * @return {Object} The request object
             */
            function preparePostRequest(relativeUrl, postData) {
                return prepareApiRequest(relativeUrl, "post", postData);
            }

            /**
             * Sets the default error response transformer for all future requests
             * Note: The default error response transformer MUST have a method
             * named 'transform' defined to handle the transformation
             * @return {Object} The factory object
             */
            function setDefaultErrorResponseTransformer(defaultErrorResponseTransformer) {
                this.defaultErrorResponseTransformer = defaultErrorResponseTransformer;
                return this;
            }

            /**
             * Sets the default request transformer for all future requests
             * Note: The default request transformer MUST have a method
             * named 'transform' defined to handle the transformation
             * @return {Object} The factory object
             */
            function setDefaultRequestTransformer(defaultRequestTransformer) {
                this.defaultRequestTransformer = defaultRequestTransformer;
                return this;
            }

            /**
             * Sets the default response transformer for all future requests
             * Note: The default response transformer MUST have a method
             * named 'transform' defined to handle the transformation
             * @return {Object} The factory object
             */
            function setDefaultResponseTransformer(defaultResponseTransformer) {
                this.defaultResponseTransformer = defaultResponseTransformer;
                return this;
            }

            /**
             * Sets the error response transformer for the request
             * Note: The error response transformer MUST have a method
             * named 'transform' defined to handle the transformation
             * @return {Object} The request object
             */
            function setErrorResponseTransformer(errorResponseTransformer) {
                this.errorResponseTransformer = errorResponseTransformer;
                return this;
            }

            /**
             * Set the HTTP headers to send for the request
             * @param {Object} headers Map of strings or functions which return strings representing
             * HTTP headers to send to the server. If the return value of a function is null, the
             * header will not be sent. Functions accept a config object as an argument.
             * @return {Object} The request object
             */
            function setHeaders(headers) {
                this.headers = headers;
                return this;
            }

            /**
             * Sets the request transformer for the request
             * Note: The request transformer MUST have a method
             * named 'transform' defined to handle the transformation
             * @return {Object} The request object
             */
            function setRequestTransformer(requestTransformer) {
                this.requestTransformer = requestTransformer;
                return this;
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

        /**
         * Set the HTTP headers to send for all requests
         * @param {Object} headers Map of strings or functions which return strings representing
         * HTTP headers to send to the server. If the return value of a function is null, the
         * header will not be sent. Functions accept a config object as an argument.
         * @param  {string} httpMethod (Optional) When an httpMethod is set, the headers will
         * only be applied to http requests of that type. If ommited, it will be applied to all
         * requests.
         */
        function setHeaders(headers, httpMethod) {
            if(typeof(httpMethod) === "undefined") {
                $httpProvider.defaults.headers.post = {};
                $httpProvider.defaults.headers.put = {};
                httpMethod = "common";
            }
            $httpProvider.defaults.headers[httpMethod.toLowerCase()] = headers;
        }
    }
})();
