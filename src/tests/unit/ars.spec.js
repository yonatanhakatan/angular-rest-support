describe('Angular Rest Support', function() {
  var $httpBackend;
  var arsHelper;
  var dataBuilder = jsonApiDataBuilder();
  var httpMethods = ['delete', 'get', 'patch', 'post', 'put'];
  var requestData = {name: 'John Doe', dob: '1982-01-01'};
  var headersData = {token: 'abc123'};

  beforeEach(function() {
    module('ars');
    inject(function(_$httpBackend_, _arsHelper_) {
      $httpBackend = _$httpBackend_;
      arsHelper = _arsHelper_;
    });

    // Mock the Data
    $httpBackend
      .whenDELETE('/authors')
      .respond(200);
    $httpBackend
      .whenDELETE('/badurl')
      .respond(400);

    $httpBackend
      .whenGET('/authors')
      .respond(200, dataBuilder.allAuthors);
    $httpBackend
      .whenGET('/authors/private')
      .respond(function(method, url, data, headers) {
        return (headers.token && (headers.token === headersData.token)) ?
          [200, dataBuilder.allAuthors] :
          400;
      });
    $httpBackend
      .whenGET('/badurl')
      .respond(400);

    $httpBackend
      .whenPATCH('/authors')
      .respond(function(method, url, data, headers) {
        return [200, data];
      });
    $httpBackend
      .whenPATCH('/badurl')
      .respond(400);

    $httpBackend
      .whenPOST('/authors')
      .respond(function(method, url, data, headers) {
        return [200, data];
      });
    $httpBackend
      .whenPOST('/authors/failedvalidation')
      .respond(function(method, url, data, headers) {
        return [422, dataBuilder.allAuthorsValidationErrors];
      });
    $httpBackend
      .whenPOST('/badurl')
      .respond(400);

    $httpBackend
      .whenPUT('/authors')
      .respond(function(method, url, data, headers) {
        return [200, data];
      });
    $httpBackend
      .whenPUT('/badurl')
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

  describe('When setting a request transformer', function() {
    var postRequest;

    beforeEach(function() {
      postRequest = arsHelper
        .post('/authors', requestData)
        .setRequestTransformer(dataBuilder.authorsRequestTransformer)
        .request();

      spyOn(dataBuilder.authorsRequestTransformer, 'transform').and.callThrough();
    });

    it('The transformer\'s transform method should be called with the correct data', function() {
      $httpBackend.flush();
      expect(dataBuilder.authorsRequestTransformer.transform).toHaveBeenCalledWith(requestData);
    });

    it('The transformer\'s transform method should be called the correct no. of times', function() {
      expect(dataBuilder.authorsRequestTransformer.transform.calls.count()).toEqual(0);
      $httpBackend.flush();
      expect(dataBuilder.authorsRequestTransformer.transform.calls.count()).toEqual(1);
    });

    it('Should return the correct data', function() {
      var returnedData;
      postRequest
        .then(function(success) {
          returnedData = success.data;
        });
      $httpBackend.flush();
      expect(returnedData).toEqual(dataBuilder.authorsRequestTransformer.transform(requestData));
    });
  });

  describe('When setting a response transformer', function() {
    var getRequest;

    beforeEach(function() {
      getRequest = arsHelper
        .get('/authors')
        .setResponseTransformer(dataBuilder.authorsResponseTransformer)
        .request();

      spyOn(dataBuilder.authorsResponseTransformer, 'transform').and.callThrough();
    });

    it('The transformer\'s transform method should be called with the correct data', function() {
      $httpBackend.flush();
      expect(dataBuilder.authorsResponseTransformer.transform)
        .toHaveBeenCalledWith(JSON.parse(dataBuilder.allAuthors));
    });

    it('The transformer\'s transform method should be called the correct no. of times', function() {
      expect(dataBuilder.authorsResponseTransformer.transform.calls.count()).toEqual(0);
      $httpBackend.flush();
      expect(dataBuilder.authorsResponseTransformer.transform.calls.count()).toEqual(1);
    });

    it('Should return the correct data', function() {
      var returnedData;
      getRequest.then(function(success) {
        returnedData = success.data;
      });
      $httpBackend.flush();
      expect(returnedData)
        .toEqual(dataBuilder.authorsResponseTransformer
          .transform(JSON.parse(dataBuilder.allAuthors)));
    });
  });

  describe('When setting an error transformer', function() {
    var postRequest;

    beforeEach(function() {
      postRequest = arsHelper
        .post('/authors/failedvalidation', requestData)
        .setErrorResponseTransformer(dataBuilder.authorsErrorTransformer)
        .request();

      spyOn(dataBuilder.authorsErrorTransformer, 'transform').and.callThrough();
    });

    it('The error transformer\'s transform method should be called with the correct error data',
        function() {
      $httpBackend.flush();
      expect(dataBuilder.authorsErrorTransformer.transform)
        .toHaveBeenCalledWith(JSON.parse(dataBuilder.allAuthorsValidationErrors));
    });

    it('The transformer\'s error transform method should be called the correct no. of times',
        function() {
      expect(dataBuilder.authorsErrorTransformer.transform.calls.count()).toEqual(0);
      $httpBackend.flush();
      expect(dataBuilder.authorsErrorTransformer.transform.calls.count()).toEqual(1);
    });

    it('Should return the correctly transformed error data', function() {
      var errorData;
      postRequest.then(function(success) {}, function(fail) {
        errorData = fail.data;
      });
      $httpBackend.flush();
      expect(errorData)
        .toEqual(dataBuilder.authorsErrorTransformer
          .transform(JSON.parse(dataBuilder.allAuthorsValidationErrors)));
    });
  });

  describe('When setting the header for a specific request', function() {
    var getRequest;

    beforeEach(function() {
      getRequest = arsHelper
        .get('/authors/private')
        .setHeaders(headersData)
        .request();
    });

    it('Should return a successful response', function() {
      var returnedData;
      getRequest.then(function(success) {
        returnedData = success.data;
      });
      $httpBackend.flush();
      expect(returnedData).toEqual(JSON.parse(dataBuilder.allAuthors));
    });
  });

});
