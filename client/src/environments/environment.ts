// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  wsUrl: 'localhost:3000/api/graph',
  allowRegistrations: false,
  // Should not have an api key open like this, I know,
  // but it is limited to this particular domain anyway and
  // I don't have that many ways of sneaking it into the client.
  // I would rather avoid making an extra roundtrip to the server
  // just to fetch this from system environment.
  geoApiKey: 'AIzaSyDIYbCDSYzEF6naFvgkjv297hX7cqS3mBs'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error';  // Included with Angular CLI.
