describe('Angular Rest Support', function() {
  var $httpBackend;
  var arsHelper;
  var dataBuilder = jsonApiDataBuilder();
  var httpMethods = ['delete', 'get', 'patch', 'post', 'put'];
  var requestData = {name: 'John Doe', dob: '1982-01-01'};

  beforeEach(function() {
    module('ars');
    inject(function(_$httpBackend_, _arsHelper_) {
      $httpBackend = _$httpBackend_;
      arsHelper = _arsHelper_;
    });

    // Mock the Data
    $httpBackend.whenDELETE('/authors').respond(200);
    $httpBackend.whenDELETE('/badurl').respond(400);

    $httpBackend.whenGET('/authors').respond(200, dataBuilder.allAuthors);
    $httpBackend.whenGET('/badurl').respond(400);

    $httpBackend.whenPATCH('/authors').respond(function(method, url, data, headers) {
      return [200, data];
    });
    $httpBackend.whenPATCH('/badurl').respond(400);

    $httpBackend.whenPOST('/authors').respond(function(method, url, data, headers) {
      return [200, data];
    });
    $httpBackend.whenPOST('/badurl').respond(400);

    $httpBackend.whenPUT('/authors').respond(function(method, url, data, headers) {
      return [200, data];
    });
    $httpBackend.whenPUT('/badurl').respond(400);
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
    var transformer = {
      transform: function(data) {
        return {
          'data': {
            'type': 'authors',
            'attributes': {
              'name': data.name,
              'date_of_birth': data.dob
            }
          }
        };
      }
    };
    var postRequest;

    beforeEach(function() {
      postRequest = arsHelper
        .post('/authors', requestData)
        .setRequestTransformer(transformer)
        .request();

      spyOn(transformer, 'transform').and.callThrough();
    });

    it('The transformer\'s transform method should be called with the correct data', function() {
      $httpBackend.flush();
      expect(transformer.transform).toHaveBeenCalledWith(requestData);
    });

    it('The transformer\'s transform method should be called the correct no. of times', function() {
      expect(transformer.transform.calls.count()).toEqual(0);
      $httpBackend.flush();
      expect(transformer.transform.calls.count()).toEqual(1);
    });

    it('Should return the correct data', function() {
      var returnedData;
      postRequest
        .then(function(success) {
          returnedData = success.data;
        });
      $httpBackend.flush();
      expect(returnedData).toEqual(transformer.transform(requestData));
    });
  });

  describe('When setting a response transformer', function() {
    var transformer = {
      transform: function(rawData) {
        var transformedCollection = [];
        for (var i = 0; i < rawData.data.length; i++) {
          var dataItem = rawData.data[i];
          transformedCollection.push({
            id: dataItem.id,
            createdAt: dataItem.attributes.created_at,
            dob: dataItem.attributes.date_of_birth,
            dod: dataItem.attributes.date_of_death,
            name: dataItem.attributes.name,
            updatedAt: dataItem.attributes.updated_at
          });
        }
        return transformedCollection;
      }
    };
    var getRequest;

    beforeEach(function() {
      getRequest = arsHelper
        .get('/authors')
        .setResponseTransformer(transformer)
        .request();

      spyOn(transformer, 'transform').and.callThrough();
    });

    it('The transformer\'s transform method should be called with the correct data', function() {
      $httpBackend.flush();
      expect(transformer.transform).toHaveBeenCalledWith(JSON.parse(dataBuilder.allAuthors));
    });

    it('The transformer\'s transform method should be called the correct no. of times', function() {
      expect(transformer.transform.calls.count()).toEqual(0);
      $httpBackend.flush();
      expect(transformer.transform.calls.count()).toEqual(1);
    });

    it('Should return the correct data', function() {
      var returnedData;
      getRequest.then(function(success) {
        returnedData = success.data;
      });
      $httpBackend.flush();
      expect(returnedData).toEqual(transformer.transform(JSON.parse(dataBuilder.allAuthors)));
    });
  });

});
