# Angular Rest Support
Angular Rest Support is an AngularJS service that makes interacting with RESTful Api's a bit friendlier. Built on Angular's $http service, it provides a very easy way to transform requests and responses.

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
Angular Rest Support has certain methods that can be only be run at the config phase of the Angular lifecycle. To use these methods, inject the `arsHelperProvider` into your config:

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
Sets the base url for all API calls. If this is not set, api calls will be made to the same domain that the app is located.
#####Parameters
Param  | Type                | Description | Required
------ | ------------------- | ------------ | ------------
baseUrl| string | The base url to set | yes
#####Return Type
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
#####Return Type
string
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
#####Return Type
undefined
#####Example
```javascript
// Header will be sent for all requests
arsHelperProvider.setDefaultHeaders({ 'Authorization': 'Bearer 1a2b3c4d5e' });
// Header will be sent only for POST requests
arsHelperProvider.setDefaultHeaders({ 'Authorization': 'Bearer 1a2b3c4d5e' }, 'post');
```
