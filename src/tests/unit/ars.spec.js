describe('Angular Rest Support', function() {
  var $cacheFactory, $httpBackend;
  var arsHelper, arsHelperProvider;
  var baseUrl1 = '';
  var baseUrl2 = 'http://domain1.com';
  var baseUrl3 = 'http://domain2.com';
  var dataBuilder = jsonApiDataBuilder();
  var headersData1 = {token: 'abc123'};
  var headersData2 = {token: 'abc456'};
  var httpMethods = ['delete', 'get', 'patch', 'post', 'put'];
  var requestData = {name: 'John Doe', dob: '1982-01-01'};

  beforeEach(function() {
    module('ars', function(_arsHelperProvider_) {
      arsHelperProvider = _arsHelperProvider_;
    });

    inject(function(_$cacheFactory_, _$httpBackend_, _arsHelper_) {
      $cacheFactory = _$cacheFactory_;
      $httpBackend = _$httpBackend_;
      arsHelper = _arsHelper_;
    });

    // Mock the Data
    $httpBackend
      .whenDELETE(baseUrl1 + '/authors')
      .respond(200);
    $httpBackend
      .whenDELETE(baseUrl1 + '/badurl')
      .respond(400);

    $httpBackend
      .whenGET(baseUrl1 + '/authors')
      .respond(200, dataBuilder.allAuthors);
    $httpBackend
      .whenGET(baseUrl1 + '/authors/private')
      .respond(function(method, url, data, headers) {
        return (
          headers.token && (headers.token === headersData1.token) ?
          [200, dataBuilder.allAuthors] :
          (
            (headers.token && (headers.token === headersData2.token)) ?
            [200, dataBuilder.allBooks] :
            [400]
          )
        );
      });
    $httpBackend
      .whenGET(baseUrl1 + '/badurl')
      .respond(400);
    $httpBackend
      .whenGET(baseUrl2 + '/test')
      .respond(200, dataBuilder.allAuthors);
    $httpBackend
      .whenGET(baseUrl3 + '/test')
      .respond(200, dataBuilder.allBooks);

    $httpBackend
      .whenPATCH(baseUrl1 + '/authors')
      .respond(function(method, url, data, headers) {
        return [200, data];
      });
    $httpBackend
      .whenPATCH(baseUrl1 + '/badurl')
      .respond(400);

    $httpBackend
      .whenPOST(baseUrl1 + '/authors')
      .respond(function(method, url, data, headers) {
        return [200, data];
      });
    $httpBackend
      .whenPOST(baseUrl1 + '/authors/failedvalidation')
      .respond(function(method, url, data, headers) {
        return [422, dataBuilder.allAuthorsValidationErrors];
      });
    $httpBackend
      .whenPOST(baseUrl1 + '/badurl')
      .respond(400);

    $httpBackend
      .whenPUT(baseUrl1 + '/authors')
      .respond(function(method, url, data, headers) {
        return [200, data];
      });
    $httpBackend
      .whenPUT(baseUrl1 + '/badurl')
      .respond(400);
  });

  describe('When calling a valid end-point', function() {
    for (var key in httpMethods) {
      var httpMethod = httpMethods[key];

      (function(httpMethod) {
        var httpRequest;

        beforeEach(function() {
          var args = ['/authors'];
          if (httpMethod != 'get' && httpMethod != 'delete') {
            args.push(requestData);
          }
          httpRequest = arsHelper[httpMethod]
            .apply(null, args)
            .request();
        });

        it('Should make the relevant type of request', function() {
          $httpBackend['expect' + httpMethod.toUpperCase()]('/authors');
          $httpBackend.flush();
        });

        it('Should return the correct http status code', function() {
          var httpStatus;
          httpRequest
            .then(function(success) {
              httpStatus = success.status;
            });
          $httpBackend.flush();
          expect(httpStatus).toEqual(200);
        });

        it('Should return the correct data', function() {
          var returnedData;
          httpRequest
            .then(function(success) {
              returnedData = success.data;
            });
          $httpBackend.flush();

          if (httpMethod == 'get') {
            expect(returnedData).toEqual(JSON.parse(dataBuilder.allAuthors));
          } else if (httpMethod == 'delete') {
            expect(returnedData).toEqual(undefined);
          } else {
            expect(returnedData).toEqual(requestData);
          }

        });
      })(httpMethod);

    };
  });

  describe('When calling an invalid end-point', function() {
    for (var key in httpMethods) {
      var httpMethod = httpMethods[key];

      (function(httpMethod) {
        var request;

        beforeEach(function() {
          request = arsHelper[httpMethod]('/badurl').request();
        });

        it('Should return the correct http status code', function() {
          var httpStatus;
          request
            .then(function(success) {}, function(fail) {
              httpStatus = fail.status;
            });
          $httpBackend.flush();
          expect(httpStatus).toEqual(400);
        });
      })(httpMethod);
    }
  });

  describe('When setting a default request transformer', function() {
    var postRequest;

    beforeEach(function() {
      arsHelper.setDefaultRequestTransformer(dataBuilder.authorsDefaultRequestTransformer);
      spyOn(dataBuilder.authorsDefaultRequestTransformer, 'transform').and.callThrough();
      postRequest = arsHelper
        .post('/authors', requestData)
        .request();
    });

    it('The default transformer\'s transform method should be called with the correct data',
        function() {
      $httpBackend.flush();
      expect(dataBuilder.authorsDefaultRequestTransformer.transform)
        .toHaveBeenCalledWith(requestData);
    });

    it('The default transformer\'s transform method should be called the correct no. of times',
        function() {
      expect(dataBuilder.authorsDefaultRequestTransformer.transform.calls.count()).toEqual(0);
      $httpBackend.flush();
      expect(dataBuilder.authorsDefaultRequestTransformer.transform.calls.count()).toEqual(1);
    });

    it('Should return the correct data', function() {
      var returnedData;
      postRequest
        .then(function(success) {
          returnedData = success.data;
        });
      $httpBackend.flush();
      expect(returnedData)
        .toEqual(dataBuilder.authorsDefaultRequestTransformer.transform(requestData));
    });

  });

  describe('When setting a request transformer for an individual request', function() {
    var postRequest;

    beforeEach(function() {
      // Testing with the default transformer set too
      arsHelper.setDefaultRequestTransformer(dataBuilder.authorsDefaultRequestTransformer);
      spyOn(dataBuilder.authorsRequestTransformer, 'transform').and.callThrough();
      postRequest = arsHelper
        .post('/authors', requestData)
        .setRequestTransformer(dataBuilder.authorsRequestTransformer)
        .request();
    });

    it('The transformer\'s transform method should be called with the correct data',
        function() {
      $httpBackend.flush();
      expect(dataBuilder.authorsRequestTransformer.transform)
        .toHaveBeenCalledWith(requestData);
    });

    it('The transformer\'s transform method should be called the correct no. of times',
        function() {
      expect(dataBuilder.authorsRequestTransformer.transform.calls.count()).toEqual(0);
      $httpBackend.flush();
      expect(dataBuilder.authorsRequestTransformer.transform.calls.count()).toEqual(1);
    });

    it('Should return the correct data but future requests should revert', function() {
      var returnedData;
      postRequest
        .then(function(success) {
          returnedData = success.data;
        });
      $httpBackend.flush();
      expect(returnedData)
        .toEqual(dataBuilder.authorsRequestTransformer.transform(requestData));

      returnedData = null;

      arsHelper
        .post('/authors', requestData)
        .request()
        .then(function(success) {
          returnedData = success.data;
        });
      $httpBackend.flush();
      expect(returnedData)
        .toEqual(dataBuilder.authorsDefaultRequestTransformer.transform(requestData));
    });

  });

  describe('When setting a default response transformer', function() {
    var getRequest;

    beforeEach(function() {
      arsHelper.setDefaultResponseTransformer(dataBuilder.authorsDefaultResponseTransformer);
      spyOn(dataBuilder.authorsDefaultResponseTransformer, 'transform').and.callThrough();
      getRequest = arsHelper
        .get('/authors')
        .request();
    });

    it('The default transformer\'s transform method should be called with the correct data',
        function() {
      $httpBackend.flush();
      expect(dataBuilder.authorsDefaultResponseTransformer.transform)
        .toHaveBeenCalledWith(JSON.parse(dataBuilder.allAuthors));
    });

    it('The default transformer\'s transform method should be called the correct no. of times',
        function() {
      expect(dataBuilder.authorsDefaultResponseTransformer.transform.calls.count()).toEqual(0);
      $httpBackend.flush();
      expect(dataBuilder.authorsDefaultResponseTransformer.transform.calls.count()).toEqual(1);
    });

    it('Should return the correct data', function() {
      var returnedData;
      getRequest
        .then(function(success) {
          returnedData = success.data;
        });
      $httpBackend.flush();
      expect(returnedData)
        .toEqual(
          dataBuilder.authorsDefaultResponseTransformer
            .transform(JSON.parse(dataBuilder.allAuthors))
        );
    });

  });

  describe('When setting a response transformer for an individual request', function() {
    var getRequest;

    beforeEach(function() {
      // Testing with the default transformer set too
      arsHelper.setDefaultResponseTransformer(dataBuilder.authorsDefaultResponseTransformer);
      spyOn(dataBuilder.authorsResponseTransformer, 'transform').and.callThrough();
      getRequest = arsHelper
        .get('/authors')
        .setResponseTransformer(dataBuilder.authorsResponseTransformer)
        .request();
    });

    it('The transformer\'s transform method should be called with the correct data',
        function() {
      $httpBackend.flush();
      expect(dataBuilder.authorsResponseTransformer.transform)
        .toHaveBeenCalledWith(JSON.parse(dataBuilder.allAuthors));
    });

    it('The transformer\'s transform method should be called the correct no. of times',
        function() {
      expect(dataBuilder.authorsResponseTransformer.transform.calls.count()).toEqual(0);
      $httpBackend.flush();
      expect(dataBuilder.authorsResponseTransformer.transform.calls.count()).toEqual(1);
    });

    it('Should return the correct data but future requests should revert', function() {
      var returnedData;
      getRequest
        .then(function(success) {
          returnedData = success.data;
        });
      $httpBackend.flush();
      expect(returnedData)
        .toEqual(
          dataBuilder.authorsResponseTransformer
            .transform(JSON.parse(dataBuilder.allAuthors))
        );

      returnedData = null;

      arsHelper
        .get('/authors')
        .request()
        .then(function(success) {
          returnedData = success.data;
        });
      $httpBackend.flush();
      expect(returnedData)
        .toEqual(
          dataBuilder.authorsDefaultResponseTransformer
            .transform(JSON.parse(dataBuilder.allAuthors))
        );
    });

  });

  describe('When setting a default error transformer', function() {
    var postRequest;

    beforeEach(function() {
      arsHelper.setDefaultErrorResponseTransformer(dataBuilder.authorsDefaultErrorTransformer);
      spyOn(dataBuilder.authorsDefaultErrorTransformer, 'transform').and.callThrough();
      postRequest = arsHelper
        .post('/authors/failedvalidation', requestData)
        .request();
    });

    it('The default transformer\'s transform method should be called with the correct error data',
        function() {
      $httpBackend.flush();
      expect(dataBuilder.authorsDefaultErrorTransformer.transform)
        .toHaveBeenCalledWith(JSON.parse(dataBuilder.allAuthorsValidationErrors));
    });

    it('The default transformer\'s transform method should be called the correct no. of times',
        function() {
      expect(dataBuilder.authorsDefaultErrorTransformer.transform.calls.count()).toEqual(0);
      $httpBackend.flush();
      expect(dataBuilder.authorsDefaultErrorTransformer.transform.calls.count()).toEqual(1);
    });

    it('Should return the correctly transformed error data', function() {
      var errorData;
      postRequest.then(function(success) {}, function(fail) {
        errorData = fail.data;
      });
      $httpBackend.flush();
      expect(errorData)
        .toEqual(
          dataBuilder.authorsDefaultErrorTransformer
            .transform(JSON.parse(dataBuilder.allAuthorsValidationErrors))
        );
    });

  });

  describe('When setting an error transformer for an individual request', function() {
    var postRequest;

    beforeEach(function() {
      // Testing with the default transformer set too
      arsHelper.setDefaultErrorResponseTransformer(dataBuilder.authorsDefaultErrorTransformer);
      spyOn(dataBuilder.authorsErrorTransformer, 'transform').and.callThrough();
      postRequest = arsHelper
        .post('/authors/failedvalidation', requestData)
        .setErrorResponseTransformer(dataBuilder.authorsErrorTransformer)
        .request();
    });

    it('The transformer\'s transform method should be called with the correct data',
        function() {
      $httpBackend.flush();
      expect(dataBuilder.authorsErrorTransformer.transform)
        .toHaveBeenCalledWith(JSON.parse(dataBuilder.allAuthorsValidationErrors));
    });

    it('The transformer\'s transform method should be called the correct no. of times',
        function() {
      expect(dataBuilder.authorsErrorTransformer.transform.calls.count()).toEqual(0);
      $httpBackend.flush();
      expect(dataBuilder.authorsErrorTransformer.transform.calls.count()).toEqual(1);
    });

    it('Should return the correctly transformed error data but future requests should revert',
        function() {
      var errorData;
      postRequest.then(function(success) {}, function(fail) {
        errorData = fail.data;
      });
      $httpBackend.flush();
      expect(errorData)
        .toEqual(
          dataBuilder.authorsErrorTransformer
            .transform(JSON.parse(dataBuilder.allAuthorsValidationErrors))
        );

      errorData = null;

      arsHelper
        .post('/authors/failedvalidation', requestData)
        .request()
        .then(function(success) {}, function(fail) {
          errorData = fail.data;
        });
      $httpBackend.flush();
      expect(errorData)
        .toEqual(
          dataBuilder.authorsDefaultErrorTransformer
            .transform(JSON.parse(dataBuilder.allAuthorsValidationErrors))
        );
    });

  });

  describe('After the default header is set', function() {

    beforeEach(function() {
      arsHelperProvider.setDefaultHeaders(headersData1);
    });

    it('The correct data should be returned', function() {
      var returnedData;
      arsHelper
        .get('/authors/private')
        .request()
        .then(function(success) {
          returnedData = success.data;
        });
      $httpBackend.flush();
      expect(returnedData).toEqual(JSON.parse(dataBuilder.allAuthors));
    });

    describe('After the header is set for an individual request', function() {
      it('The correct data should be returned but future requests should revert', function() {
        var returnedData;
        arsHelper
          .get('/authors/private')
          .setHeaders(headersData2)
          .request()
          .then(function(success) {
            returnedData = success.data;
          });
        $httpBackend.flush();
        expect(returnedData).toEqual(JSON.parse(dataBuilder.allBooks));

        returnedData = null;
        arsHelper
          .get('/authors/private')
          .request()
          .then(function(success) {
            returnedData = success.data;
          });
        $httpBackend.flush();
        expect(returnedData).toEqual(JSON.parse(dataBuilder.allAuthors));
      });
    });
  });

  describe('When enabling the default cache for a specific request', function() {
    var defaultCache, getRequest;

    beforeEach(function() {
      getRequest = arsHelper
        .get('/authors')
        .setCache(true)
        .request();

      defaultCache = $cacheFactory.get('$http');
      defaultCache.removeAll();
    });

    it('The correct data should be stored in the cache', function() {
      expect(defaultCache.get('/authors')).toBeUndefined();
      $httpBackend.flush();
      expect(defaultCache.get('/authors')[1]).toEqual(dataBuilder.allAuthors);
    });
  });

  describe('Before the default base url is set', function() {

    it('The correct fallback base url should be set', function() {
      expect(arsHelperProvider.getDefaultBaseUrl()).toEqual('');
    });

  });

  describe('After the default base url is set', function() {

    beforeEach(function() {
      arsHelperProvider.setDefaultBaseUrl(baseUrl2);
    });

    it('The correct default base url should be set', function() {
      expect(arsHelperProvider.getDefaultBaseUrl()).toEqual(baseUrl2);
    });

    it('The correct data should be returned', function() {
      var returnedData;
      arsHelper
        .get('/test')
        .request()
        .then(function(success) {
          returnedData = success.data;
        });
      $httpBackend.flush();
      expect(returnedData).toEqual(JSON.parse(dataBuilder.allAuthors));
    });

    describe('After the base url is set for an individual request', function() {
      it('The correct data should be returned but future requests should revert', function() {
        var returnedData;
        arsHelper
          .get('/test')
          .setBaseUrl(baseUrl3)
          .request()
          .then(function(success) {
            returnedData = success.data;
          });
        $httpBackend.flush();
        expect(returnedData).toEqual(JSON.parse(dataBuilder.allBooks));

        returnedData = null;
        arsHelper
          .get('/test')
          .request()
          .then(function(success) {
            returnedData = success.data;
          });
        $httpBackend.flush();
        expect(returnedData).toEqual(JSON.parse(dataBuilder.allAuthors));
      });
    });
  });

});
