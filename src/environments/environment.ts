// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  configId: "frontEndApp1",
  configSecret: 12345,
  configjwt: "some12345",
  configRefresh: "refresh_token",
  congfigGrant: "password",
  url: "http://localhost:9001/micro/zuul",
  firebase: {
    apiKey: "AIzaSyBWN-BnkblQ6GvWgIYaFZd56RjN8xwCaIc",
    authDomain: "userimgsionmicromultirenter.firebaseapp.com",
    projectId: "userimgsionmicromultirenter",
    storageBucket: "userimgsionmicromultirenter.appspot.com",
    messagingSenderId: "782040709393",
    appId: "1:782040709393:web:7b0dc6ec99e495dff574b0",
  },
  stripeApiKeyPublic:
    "pk_test_51HKKJsFEOxZLmvASfbB8PUqkGXcnBMLKPkL6pPGNMrSXDJWCyiIUnphVg6raljAgkddDrfY4oa0zQCFtswgGlaZd00kX8RJwqH",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
