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
  .module('yourapplication')
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
Angular Rest Support also has certain methods that can be only be called at the run phase of the Angular lifecycle. To use these methods, inject the `arsHelper` factory into your controller/service/factory:

```javascript
angular
  .module('yourapplication')
  .controller('yourcontroller', ['arsHelper', function(arsHelper) {
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
angular
  .module('yourapplication')
  .run(['arsHelper', 'yourErrorTransformer', function(arsHelper, yourErrorTransformer) {
    arsHelper.setDefaultErrorResponseTransformer(yourErrorTransformer);
  });
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
angular
  .module('yourapplication')
  .run(['arsHelper', 'yourRequestTransformer', function(arsHelper, yourRequestTransformer) {
    arsHelper.setDefaultRequestTransformer(yourRequestTransformer);
  });
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
angular
  .module('yourapplication')
  .run(['arsHelper', 'yourResponseTransformer', function(arsHelper, yourResponseTransformer) {
    arsHelper.setDefaultResponseTransformer(yourResponseTransformer);
  });
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
