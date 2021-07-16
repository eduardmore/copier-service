// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  config: {
    apiKey: "AIzaSyCVcGNFocLfrALJCOcXUDV0JXCtY2TB7Bs", //ok ma google-service diverso?? OK
    authDomain: "copier-service-app.firebaseapp.com", //prova
    databaseURL: "https://copier-service-app.firebaseio.com", //OK
    projectId: "copier-service-app", //ok OK
    storageBucket: "copier-service-app.appspot.com", //ok
    messagingSenderId: "282663090238", //ok OK
    // appId: "1:282663090238:android:b6c369589482226c40796f" //ok OK
    appId: "1:282663090238:web:bc57b0bf1c70f2ee40796f",
    measurementId: "G-N7VYJS4S6W"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
