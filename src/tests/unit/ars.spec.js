describe('Angular Rest Support', function() {
  var $httpBackend;
  var arsHelper;
  var dataBuilder = jsonApiDataBuilder();

  beforeEach(function() {
    module('ars');
    inject(function(_$httpBackend_, _arsHelper_) {
      $httpBackend = _$httpBackend_;
      arsHelper = _arsHelper_;
    });

    // Mock the Data
    $httpBackend.whenDELETE('/authors/1').respond(200);
    $httpBackend.whenDELETE('/badurl').respond(400);

    $httpBackend.whenGET('/authors').respond(200, dataBuilder.allAuthors);
    $httpBackend.whenGET('/badurl').respond(400);

    $httpBackend.whenPATCH('/authors/1').respond(function(method, url, data, headers) {
      return [200, data];
    });
    $httpBackend.whenPATCH('/badurl').respond(400);

    $httpBackend.whenPOST('/authors').respond(function(method, url, data, headers) {
      return [200, data];
    });
    $httpBackend.whenPOST('/badurl').respond(400);

    $httpBackend.whenPUT('/authors/1').respond(function(method, url, data, headers) {
      return [200, data];
    });
    $httpBackend.whenPUT('/badurl').respond(400);
  });

  describe('When calling a valid DELETE end-point', function() {
    var deleteRequest;

    beforeEach(function() {
      deleteRequest = arsHelper
        .delete('/authors/1')
        .request();
    });

    it('Should make a DELETE request', function() {
      $httpBackend.expectDELETE('/authors/1');
      $httpBackend.flush();
    });

    it('Should return the correct http status code', function() {
      var httpStatus;
      deleteRequest
        .then(function(success) {
          httpStatus = success.status;
        });
      $httpBackend.flush();
      expect(httpStatus).toEqual(200);
    });
  });

  describe('When calling an invalid DELETE end-point', function() {
    var deleteRequest;

    beforeEach(function() {
      deleteRequest = arsHelper
        .delete('/badurl')
        .request();
    });

    it('Should return the correct http status code', function() {
      var httpStatus;
      deleteRequest
        .then(function(success) {}, function(fail) {
          httpStatus = fail.status;
        });
      $httpBackend.flush();
      expect(httpStatus).toEqual(400);
    });
  });

  describe('When calling a valid GET end-point', function() {
    var getRequest;

    beforeEach(function() {
      getRequest = arsHelper
        .get('/authors')
        .request();
    });

    it('Should make a GET request', function() {
      $httpBackend.expectGET('/authors');
      $httpBackend.flush();
    });

    it('Should return the correct data', function() {
      var returnedData;
      getRequest
        .then(function(success) {
          returnedData = success.data;
        });
      $httpBackend.flush();
      expect(returnedData).toEqual(dataBuilder.allAuthors);
    });
  });

  describe('When calling an invalid GET end-point', function() {
    var getRequest;

    beforeEach(function() {
      getRequest = arsHelper
        .get('/badurl')
        .request();
    });

    it('Should return the correct http status code', function() {
      var httpStatus;
      getRequest
        .then(function(success) {}, function(fail) {
          httpStatus = fail.status;
        });
      $httpBackend.flush();
      expect(httpStatus).toEqual(400);
    });
  });

  describe('When calling a valid PATCH end-point', function() {
    var patchData = {name: 'John Doe', dob: '1982-01-01'};
    var patchRequest;

    beforeEach(function() {
      patchRequest = arsHelper
        .patch('/authors/1', patchData)
        .request();
    });

    it('Should make a PATCH request', function() {
      $httpBackend.expectPATCH('/authors/1');
      $httpBackend.flush();
    });

    it('Should return the correct data', function() {
      var returnedData;
      patchRequest
        .then(function(success) {
          returnedData = success.data;
        });
      $httpBackend.flush();
      expect(returnedData).toEqual(patchData);
    });
  });

  describe('When calling an invalid PATCH end-point', function() {
    var patchRequest;

    beforeEach(function() {
      patchRequest = arsHelper
        .patch('/badurl')
        .request();
    });

    it('Should return the correct http status code', function() {
      var httpStatus;
      patchRequest
        .then(function(success) {}, function(fail) {
          httpStatus = fail.status;
        });
      $httpBackend.flush();
      expect(httpStatus).toEqual(400);
    });
  });

  describe('When calling a valid POST end-point', function() {
    var postData = {name: 'John Doe', dob: '1982-01-01'};
    var postRequest;

    beforeEach(function() {
      postRequest = arsHelper
        .post('/authors', postData)
        .request();
    });

    it('Should make a POST request', function() {
      $httpBackend.expectPOST('/authors');
      $httpBackend.flush();
    });

    it('Should return the correct data', function() {
      var returnedData;
      postRequest
        .then(function(success) {
          returnedData = success.data;
        });
      $httpBackend.flush();
      expect(returnedData).toEqual(postData);
    });
  });

  describe('When calling an invalid POST end-point', function() {
    var postRequest;

    beforeEach(function() {
      postRequest = arsHelper
        .post('/badurl')
        .request();
    });

    it('Should return the correct http status code', function() {
      var httpStatus;
      postRequest
        .then(function(success) {}, function(fail) {
          httpStatus = fail.status;
        });
      $httpBackend.flush();
      expect(httpStatus).toEqual(400);
    });
  });

  describe('When setting a request transformer', function() {
    var postData = {name: 'John Doe', dob: '1982-01-01'};
    var postRequest;

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

    beforeEach(function() {
      postRequest = arsHelper
        .post('/authors', postData)
        .setRequestTransformer(transformer)
        .request();

      spyOn(transformer, 'transform').and.callThrough();
    });

    it('The transformer\'s transform method should be called with the correct data', function() {
      $httpBackend.flush();
      expect(transformer.transform).toHaveBeenCalledWith(postData);
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
      expect(returnedData).toEqual(transformer.transform(postData));
    });
  });

  describe('When calling a valid PUT end-point', function() {
    var putData = {name: 'John Doe', dob: '1982-01-01'};
    var putRequest;

    beforeEach(function() {
      putRequest = arsHelper
        .put('/authors/1', putData)
        .request();
    });

    it('Should make a PUT request', function() {
      $httpBackend.expectPUT('/authors/1');
      $httpBackend.flush();
    });

    it('Should return the correct data', function() {
      var returnedData;
      putRequest
        .then(function(success) {
          returnedData = success.data;
        });
      $httpBackend.flush();
      expect(returnedData).toEqual(putData);
    });
  });

  describe('When calling an invalid PUT end-point', function() {
    var putRequest;

    beforeEach(function() {
      putRequest = arsHelper
        .put('/badurl')
        .request();
    });

    it('Should return the correct http status code', function() {
      var httpStatus;
      putRequest
        .then(function(success) {}, function(fail) {
          httpStatus = fail.status;
        });
      $httpBackend.flush();
      expect(httpStatus).toEqual(400);
    });
  });
});
