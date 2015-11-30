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

    // Mock Data
    $httpBackend.whenGET('/authors').respond(200, dataBuilder.allAuthors);
  });

  describe('When calling a GET end-point', function() {
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
});
