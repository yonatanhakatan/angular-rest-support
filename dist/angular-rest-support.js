(function() {
  'use strict';

  angular
    .module('ars', []);
})();

(function() {
  'use strict';

  angular
    .module('ars')
    .provider('ars', arsProvider);

  arsProvider.$inject = ['$httpProvider'];

  /**
   * The provider that is run at the config phase
   * of Angular lifecycle.
   */
  function arsProvider($httpProvider) {
    /* jshint validthis:true */

    var providerConfig = {
      defaultBaseUrl: '',
      defaultErrorResponseTransformer: null,
      defaultRequestTransformer: null,
      defaultResponseTransformer: null
    };

    this.$get = arsFactory;
    this.getDefaultBaseUrl = getDefaultBaseUrl;
    this.setDefaultBaseUrl = setDefaultBaseUrl;
    this.setDefaultHeaders = setDefaultHeaders;

    arsFactory.$inject = ['$http'];

    /**
     * Factory which is run at run phase
     * of Angular lifecycle.
     * @param  {Object} $http Injected $http object
     * @return {Object} The factory object
     */
    function arsFactory($http) {
      var factory = {
        delete: prepareDeleteRequest,
        get: prepareGetRequest,
        patch: preparePatchRequest,
        put: preparePutRequest,
        post: preparePostRequest,
        setDefaultErrorResponseTransformer: setDefaultErrorResponseTransformer,
        setDefaultRequestTransformer: setDefaultRequestTransformer,
        setDefaultResponseTransformer: setDefaultResponseTransformer
      };

      return factory;

      /**
       * Appends the default request/response transformations
       * to the new request/response transformation
       * @param  {(Array|Function)} defaults The default request/response transformation(s)
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
          method: requestObj._config.httpMethod.toUpperCase(),
          transformRequest: appendDefaultTransform(
            $http.defaults.transformRequest,
            function(value) {
              return requestObj._config.requestTransformer ?
                angular.toJson(
                  requestObj._config.requestTransformer.transform(angular.fromJson(value))
                ) :
                (
                  providerConfig.defaultRequestTransformer ?
                  angular.toJson(
                    providerConfig.defaultRequestTransformer.transform(angular.fromJson(value))
                  ) :
                  value
                );
            }
          ),
          transformResponse: appendDefaultTransform(
            $http.defaults.transformResponse,
            function(value, headers, status) {
              var responseTransformer, defaultResponseTransformer;
              if (status >= 400 && status < 500) {
                responseTransformer = requestObj._config.errorResponseTransformer;
                defaultResponseTransformer = providerConfig.defaultErrorResponseTransformer;
              } else {
                responseTransformer = requestObj._config.responseTransformer;
                defaultResponseTransformer = providerConfig.defaultResponseTransformer;
              }
              return responseTransformer ?
                responseTransformer.transform(value) :
                (defaultResponseTransformer ? defaultResponseTransformer.transform(value) : value);
            }
          ),
          url: requestObj._config.baseUrl + requestObj._config.relativeUrl
        };

        if (requestObj._config.cache !== null) {
          httpConfig.cache = requestObj._config.cache;
        }

        if (requestObj._config.headers) {
          httpConfig.headers = requestObj._config.headers;
        }

        if (requestObj._config.requestData) {
          var httpConfigProperty = httpConfig.method == 'GET' ? 'params' : 'data';
          httpConfig[httpConfigProperty] = requestObj._config.requestData;
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
        var requestObjConfig = {
          baseUrl: providerConfig.defaultBaseUrl,
          cache: null,
          errorResponseTransformer: null,
          headers: null,
          httpMethod: httpMethod,
          relativeUrl: relativeUrl,
          requestData: requestData,
          requestTransformer: null,
          responseTransformer: null
        };

        return {
          _config: requestObjConfig,
          request: performRequest,
          setBaseUrl: setBaseUrl,
          setCache: setCache,
          setErrorResponseTransformer: setErrorResponseTransformer,
          setHeaders: setHeaders,
          setRequestTransformer: setRequestTransformer,
          setResponseTransformer: setResponseTransformer
        };
      }

      /**
       * Prepare an HTTP DELETE request
       * @param  {string} relativeUrl The relative url part of the API call
       * @param  {Object} requestData (Optional) The data to send for the API request
       * @return {Object} The request object
       */
      function prepareDeleteRequest(relativeUrl, requestData) {
        return prepareApiRequest(relativeUrl, 'delete', requestData);
      }

      /**
       * Prepare an HTTP GET request
       * @param  {string} relativeUrl The relative url part of the API call
       * @param  {Object} requestData (Optional) The data to send for the API request
       * @return {Object} The request object
       */
      function prepareGetRequest(relativeUrl, requestData) {
        return prepareApiRequest(relativeUrl, 'get', requestData);
      }

      /**
       * Prepare an HTTP PATCH request
       * @param  {string} relativeUrl The relative url part of the API call
       * @param  {Object} requestData (Optional) The data to send for the API request
       * @return {Object} The request object
       */
      function preparePatchRequest(relativeUrl, requestData) {
        return prepareApiRequest(relativeUrl, 'patch', requestData);
      }

      /**
       * Prepare an HTTP POST request
       * @param  {string} relativeUrl The relative url part of the API call
       * @param  {Object} requestData (Optional) The data to send for the API request
       * @return {Object} The request object
       */
      function preparePostRequest(relativeUrl, requestData) {
        return prepareApiRequest(relativeUrl, 'post', requestData);
      }

      /**
       * Prepare an HTTP PUT request
       * @param  {string} relativeUrl The relative url part of the API call
       * @param  {Object} requestData (Optional) The data to send for the API request
       * @return {Object} The request object
       */
      function preparePutRequest(relativeUrl, requestData) {
        return prepareApiRequest(relativeUrl, 'put', requestData);
      }

      /**
       * Sets the base url for the request
       * @param {string} baseUrl The base url
       */
      function setBaseUrl(baseUrl) {
        this._config.baseUrl = baseUrl;
        return this;
      }

      /**
       * Set the cache for the request
       * @param {(boolean|Object)} cache  If true, a default $http cache will be used to cache the GET
       * request, otherwise if a cache instance built with $cacheFactory, this cache will be used for caching.
       * @return {Object} The request object
       */
      function setCache(cache) {
        this._config.cache = cache;
        return this;
      }

      /**
       * Sets the default error response transformer for all future requests
       * Note: The default error response transformer MUST have a method
       * named 'transform' defined to handle the transformation
       * @return {Object} The factory object
       */
      function setDefaultErrorResponseTransformer(defaultErrorResponseTransformer) {
        providerConfig.defaultErrorResponseTransformer = defaultErrorResponseTransformer;
        return this;
      }

      /**
       * Sets the default request transformer for all future requests
       * Note: The default request transformer MUST have a method
       * named 'transform' defined to handle the transformation
       * @return {Object} The factory object
       */
      function setDefaultRequestTransformer(defaultRequestTransformer) {
        providerConfig.defaultRequestTransformer = defaultRequestTransformer;
        return this;
      }

      /**
       * Sets the default response transformer for all future requests
       * Note: The default response transformer MUST have a method
       * named 'transform' defined to handle the transformation
       * @return {Object} The factory object
       */
      function setDefaultResponseTransformer(defaultResponseTransformer) {
        providerConfig.defaultResponseTransformer = defaultResponseTransformer;
        return this;
      }

      /**
       * Sets the error response transformer for the request
       * Note: The error response transformer MUST have a method
       * named 'transform' defined to handle the transformation
       * @return {Object} The request object
       */
      function setErrorResponseTransformer(errorResponseTransformer) {
        this._config.errorResponseTransformer = errorResponseTransformer;
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
        this._config.headers = headers;
        return this;
      }

      /**
       * Sets the request transformer for the request
       * Note: The request transformer MUST have a method
       * named 'transform' defined to handle the transformation
       * @return {Object} The request object
       */
      function setRequestTransformer(requestTransformer) {
        this._config.requestTransformer = requestTransformer;
        return this;
      }

      /**
       * Sets the response transformer for the request
       * Note: The response transformer MUST have a method
       * named 'transform' defined to handle the transformation
       * @return {Object} The request object
       */
      function setResponseTransformer(responseTransformer) {
        this._config.responseTransformer = responseTransformer;
        return this;
      }

    }

    /**
     * Get the default base url currently set
     * @return {string} The base url
     */
    function getDefaultBaseUrl() {
      return providerConfig.defaultBaseUrl;
    }

    /**
     * Sets the default base url to be used for all requests
     * @param {string} baseUrl The base url
     */
    function setDefaultBaseUrl(baseUrl) {
      providerConfig.defaultBaseUrl = baseUrl;
    }

    /**
     * Set the default HTTP headers to send for all requests
     * @param {Object} headers Map of strings or functions which return strings representing
     * HTTP headers to send to the server. If the return value of a function is null, the
     * header will not be sent. Functions accept a config object as an argument.
     * @param  {string} httpMethod (Optional) When an httpMethod is set, the headers will
     * only be applied to http requests of that type. If ommited, it will be applied to all
     * requests.
     */
    function setDefaultHeaders(headers, httpMethod) {
      if (typeof(httpMethod) === 'undefined') {
        $httpProvider.defaults.headers.patch = {};
        $httpProvider.defaults.headers.post = {};
        $httpProvider.defaults.headers.put = {};
        httpMethod = 'common';
      }
      $httpProvider.defaults.headers[httpMethod.toLowerCase()] = headers;
    }
  }
})();
