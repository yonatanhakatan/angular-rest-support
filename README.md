# Angular Rest Support
Angular Rest Support is an AngularJS service that makes interacting with RESTful API's a bit friendlier. Built on Angular's $http service, it provides a very easy way to transform requests and responses.

## Dependencies
Angular Rest Support depends on AngularJS (v1.3.7 +)

## Installation / Setup
Angular Rest Support can be installed using [Bower](http://bower.io)   
```bash
bower install angular-rest-support
```

Add the library to your html page
```html
<script src="path-to-folder/angular-rest-support/dist/angular-rest-support.min.js"></script>
```

Add the Angular Rest Support module as a dependency to your application
```javascript
angular
  .module('yourapplication', ['ars']);
```

## Usage

### Config Phase
Angular Rest Support has certain methods that can be only be called at the config phase of the Angular lifecycle. To use these methods, inject the `arsProvider` into your config:

```javascript
angular
  .module('yourApplication')
  .config(['arsProvider', function(arsProvider) {
    // arsProvider method calls here
  }]);
```

The available provider methods are as follows:
####setDefaultBaseUrl(baseUrl)
___
#####Description
Sets the base url for all API calls. If this is not set, API calls will be made to the same domain that the app is located.
#####Parameters
Param  | Type                | Description | Required
------ | ------------------- | ------------ | ------------
baseUrl| string | The base url to set | yes
#####Returns
undefined
#####Example
```javascript
arsProvider.setDefaultBaseUrl("http://abc.com/");
```
####getDefaultBaseUrl()
___
#####Description
Gets the base url for all API calls
#####Parameters
none
#####Returns
The base url (string)
#####Example
```javascript
arsProvider.getDefaultBaseUrl();
```

####setDefaultHeaders(headers, httpMethod)
___
#####Description
Sets the default headers for all API calls.
#####Parameters
Param  | Type                | Description | Required
------ | ------------------- | ------------ | ------------
headers| Object | The headers to send in requests, in the format:<br>```{ 'header-key': 'header-value' }```  | yes
httpMethod | string | You can restrict the headers to only be sent for certain http method types<br>For example: "get" or "post" | no
#####Returns
undefined
#####Example
```javascript
// Header will be sent for all requests
arsProvider.setDefaultHeaders({ 'Authorization': 'Bearer 1a2b3c4d5e' });
// Header will be sent only for POST requests
arsProvider.setDefaultHeaders({ 'Authorization': 'Bearer 1a2b3c4d5e' }, 'post');
```
### Run Phase
Angular Rest Support also has certain methods that can be only be called at the run phase of the Angular lifecycle. To use these methods, inject the `ars` factory into your controller/service/factory/run:

```javascript
angular
  .module('yourapplication')
  .controller('yourController', ['ars', function(ars) {
    // ars method calls here
  }]);
```

There are some transformer methods which are suited to being called in your app's run call:

####setDefaultErrorResponseTransformer(defaultErrorResponseTransformer)
___
#####Description
Sets the default error response transformer for all requests. See the Transformers section for more.
#####Parameters
Param  | Type                | Description | Required
------ | ------------------- | ------------ | ------------
defaultErrorResponseTransformer| Object | The error transformer to use for all errors that are returned from the API | yes
#####Returns
The Angular Rest Support factory (Object)
#####Example
```javascript
ars.setDefaultErrorResponseTransformer(yourErrorTransformer);
```

####setDefaultRequestTransformer(defaultRequestTransformer)
___
#####Description
Sets the default request transformer for all requests. See the Transformers section for more.
#####Parameters
Param  | Type                | Description | Required
------ | ------------------- | ------------ | ------------
defaultRequestTransformer| Object | The request transformer to use for all request data that is sent to the API | yes
#####Returns
The Angular Rest Support factory (Object)
#####Example
```javascript
ars.setDefaultRequestTransformer(yourRequestTransformer);
```

####setDefaultResponseTransformer(defaultResponseTransformer)
___
#####Description
Sets the default response transformer for all requests. See the Transformers section for more.
#####Parameters
Param  | Type                | Description | Required
------ | ------------------- | ------------ | ------------
defaultResponseTransformer| Object | The response transformer to use for all response data that is returned from the API | yes
#####Returns
The Angular Rest Support factory (Object)
#####Example
```javascript
ars.setDefaultResponseTransformer(yourResponseTransformer);
```

###Preparing requests

To begin interacting with your API, you need to prepare the request with one of the following methods:

####delete(relativeUrl, requestData)
####get(relativeUrl, requestData)
####patch(relativeUrl, requestData)
####put(relativeUrl, requestData)
####post(relativeUrl, requestData)
___
#####Description
These methods all follow the same structure, and prepare a request with the corresponding HTTP method type i.e. DELETE, GET, PATCH, PUT and POST
#####Parameters
Param  | Type                | Description | Required
------ | ------------------- | ------------ | ------------
relativeUrl| string | The relative url to call. This will be appended to the base url. | yes
requestData| Object | The data to send with the request. In the case of GET requests, this will be converted to url params. | no
#####Returns
An Angular Rest Support request (Object)
#####Example
```javascript
// Without request data
ars.get("books")
// With request data
ars.post("books", { type: 'hardback' })
```
### Post-Prep
Once you have prepared the request, you can call any of these methods:

####setBaseUrl(baseUrl)
___
#####Description
Sets the base url for the request. If this is not set, the base url will revert to the default base url set with setDefaultBaseUrl().
#####Parameters
Param  | Type                | Description | Required
------ | ------------------- | ------------ | ------------
baseUrl| string | The base url to set for the request | yes
#####Returns
An Angular Rest Support request (Object)
#####Example
```javascript
ars
  .get("books")
  .setBaseUrl("http://xyz.com/");
```

####setCache(cache)
___
#####Description
Sets the cache for the request. Only applies to GET requests.
#####Parameters
Param  | Type                | Description | Required
------ | ------------------- | ------------ | ------------
cache| boolean or $cacheFactory Object | If true, a default $http cache will be used to cache the request. If it's a $cacheFactory object, then that will be used for caching.  | yes
#####Returns
An Angular Rest Support request (Object)
#####Example
```javascript
ars
  .get("books")
  .setCache(true);
```

####setHeaders(headers)
___
#####Description
Sets the headers for the request.
#####Parameters
Param  | Type                | Description | Required
------ | ------------------- | ------------ | ------------
headers| Object | The headers to send for the request, in the format:<br>```{ 'header-key': 'header-value' }```  | yes
#####Returns
An Angular Rest Support request (Object)
#####Example
```javascript
ars
  .get("books")
  .setHeaders({ 'Content-Type': 'application/vnd.api+json' });
```

####setErrorResponseTransformer(errorResponseTransformer)
___
#####Description
Sets the error response transformer for the request. See the Transformers section for more.
#####Parameters
Param  | Type                | Description | Required
------ | ------------------- | ------------ | ------------
errorResponseTransformer| Object | The error transformer to use for any errors that are returned from the API for the request | yes
#####Returns
An Angular Rest Support request (Object)
#####Example
```javascript
ars
  .get("books")
  .setErrorResponseTransformer(yourErrorTransformer);
```

####setRequestTransformer(requestTransformer)
___
#####Description
Sets the request transformer for the request. See the Transformers section for more.
#####Parameters
Param  | Type                | Description | Required
------ | ------------------- | ------------ | ------------
requestTransformer| Object | The request transformer to use for any request data that is sent to the API for the request | yes
#####Returns
An Angular Rest Support request (Object)
#####Example
```javascript
ars
  .post("books", { type: 'hardback' })
  .setRequestTransformer(yourRequestTransformer);
```

####setResponseTransformer(responseTransformer)
___
#####Description
Sets the response transformer for the request. See the Transformers section for more.
#####Parameters
Param  | Type                | Description | Required
------ | ------------------- | ------------ | ------------
responseTransformer| Object | The response transformer to use for any response data that is returned from the API for the request | yes
#####Returns
An Angular Rest Support request (Object)
#####Example
```javascript
ars
  .get("books")
  .setResponseTransformer(yourResponseTransformer);
```

### Performing the request
Once you are ready to actually call the API, there is one method left to call:
####request()
___
#####Description
Performs the request to make the actual call to your API.
#####Parameters
none
#####Returns
A Promise (Object)
#####Example
```javascript
ars
  .get("books")
  .request()
  .then(function(success) {
    // success is an Angular $http response object. See https://docs.angularjs.org/api/ng/service/$http
  }, function(fail) {
    // fail is an Angular $http response object. See https://docs.angularjs.org/api/ng/service/$http
  });
```

### Transformers
You can set set default transformers which will be applied to all requests made with Angular Rest Support. You can also set them on a per-request basis. These transformers can be applied to request data that is sent to your API and also to response data and error response data that is returned from your API.

One of the benefits of using transformers is you can decouple the structure of your API's response data from how your app actually manipulates the data. As an example, if your API is returning data formatted to the (JSON API spec)[http://jsonapi.org/] but you decided to switch to a different spec sometime in the future, you would just need to update your transformers to work with the new response. No need to keep changing your code to match the response. 

Your transformer can be a Service or a Factory, there is just one rule, it **must** contain a method named **transform**. The transform method will receive the raw data as an argument, which will be the request data in the case of request transformers or the response data from the api in the case of response and error response transformers.

#####Example 1 (Response Transformers):

If your API is returning this:
```json
{
  "data": {
    "id": "1",
    "type": "books",
    "attributes": {
        "title": "Book 1",
        "page_count": 200
    }
  }
}
```

Your response transformer could look like this:

```javascript
angular
  .module('yourApplication')
  .service('yourTransformer', function() {
    this.transform = transform;

    function transform(rawData) {
      // rawData is the whole response object that is being returned from the API
      var rawItem = rawData.data;
      return {
        id: rawItem.id,
        title: rawItem.attributes.title,
        pageCount: rawItem.attributes.page_count
      };
    }

  });
    
```

You can then set the transformer in your request:

```javascript
ars
  .get("books")
  .setResponseTransformer(yourTransformer)
  .request()
  .then(function(success) { 
    var bookTitle = success.data.title;
  });
```

#####Example 2 (Request Transformers):

If your API is expecting to receive data in this format:
```json
{
  "data": {
    "type": "books",
    "attributes": {
        "title": "Book Name",
        "page_count": some_number
    }
  }
}
```

Your request transformer could look like this:

```javascript
angular
  .module('yourApplication')
  .service('yourTransformer', function() {
    this.transform = transform;

    function transform(rawData) {
      // rawData is the request data that you want to send to the API
      var request = {
        "data": {
          "type": "books",
          "attributes": {
            "title": rawData.title,
            "page_count": rawData.pageCount
          }
        }
      };
      return request;
    }

  });
    
```

You can then set the transformer in your request:

```javascript
ars
  .post("books", { title: "Book 2", pageCount: 300  })
  .setRequestTransformer(yourTransformer)
  .request();
```
