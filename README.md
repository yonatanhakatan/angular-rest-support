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
Angular Rest Support has certain methods that can be only be called at the config phase of the Angular lifecycle. To use these methods, inject the `arsHelperProvider` into your config:

```javascript
angular
  .module('yourApplication')
  .config(['arsHelperProvider', function(arsHelperProvider) {
    // arsHelperProvider method calls here
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
arsHelperProvider.setDefaultBaseUrl("http://abc.com/");
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
arsHelperProvider.getDefaultBaseUrl();
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
arsHelperProvider.setDefaultHeaders({ 'Authorization': 'Bearer 1a2b3c4d5e' });
// Header will be sent only for POST requests
arsHelperProvider.setDefaultHeaders({ 'Authorization': 'Bearer 1a2b3c4d5e' }, 'post');
```
### Run Phase
Angular Rest Support also has certain methods that can be only be called at the run phase of the Angular lifecycle. To use these methods, inject the `arsHelper` factory into your controller/service/factory/run:

```javascript
angular
  .module('yourapplication')
  .controller('yourController', ['arsHelper', function(arsHelper) {
    // arsHelper method calls here
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
arsHelper.setDefaultErrorResponseTransformer(yourErrorTransformer);
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
arsHelper.setDefaultRequestTransformer(yourRequestTransformer);
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
arsHelper.setDefaultResponseTransformer(yourResponseTransformer);
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
arsHelper.get("books")
// With request data
arsHelper.post("books", { type: 'hardback' })
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
arsHelper
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
arsHelper
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
arsHelper
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
arsHelper
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
arsHelper
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
arsHelper
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
arsHelper
  .get("books")
  .request()
  .then(function(success) {
    // success is an Angular $http response object. See https://docs.angularjs.org/api/ng/service/$http
  }, function(fail) {
    // fail is an Angular $http response object. See https://docs.angularjs.org/api/ng/service/$http
  });
```
