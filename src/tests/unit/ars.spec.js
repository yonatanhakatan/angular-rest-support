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
    $httpBackend.whenGET('/authors').respond(200, dataBuilder.allAuthors);
    $httpBackend.whenGET('/badurl').respond(400);

    $httpBackend.whenPOST('/authors').respond(function(method, url, data, headers) {
      return [200, data];
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
});
