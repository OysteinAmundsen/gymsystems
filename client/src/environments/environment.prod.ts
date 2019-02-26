export const environment = {
  production: true,
  wsUrl: 'www.gymsystems.org',
  allowRegistrations: false,
  // Should not have an api key open like this, I know,
  // but it is limited to this particular domain anyway and
  // I don't have that many ways of sneaking it into the client.
  // I would rather avoid making an extra roundtrip to the server
  // just to fetch this from system environment.
  geoApiKey: 'AIzaSyDIYbCDSYzEF6naFvgkjv297hX7cqS3mBs'
};
