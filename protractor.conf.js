// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts
let path = require('path');
let fs = require('fs');
let typeorm = require('typeorm');

const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './e2e/**/*.e2e-spec.ts'
    // './e2e/**/home.e2e-spec.ts',
    // './e2e/**/login.e2e-spec.ts',
    // './e2e/**/register.e2e-spec.ts',
    // './e2e/**/configure.e2e-spec.ts',
    // './e2e/**/users.e2e-spec.ts',
    // './e2e/**/tournament.e2e-spec.ts'
  ],
  capabilities:
    { 'browserName': 'chrome', chromeOptions: {
        prefs: {
          'credentials_enable_service': false,
          'profile': { 'password_manager_enabled': false }
        },
        args: [
          '--disable-cache',
          '--disable-application-cache',
          '--disable-offline-load-stale-cache',
          '--disk-cache-size=0',
          '--v8-cache-options=off'
        ]
      }
    },
  //   ,
  //   { 'browserName': 'firefox'},
  //   { 'browserName': 'internet explorer', 'platform': 'ANY', 'version': '11'},
  // ],
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  onPrepare() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));

    // Setup database connection for setUp and tearDown tasks
    const config = JSON.parse(fs.readFileSync(path.join('.', 'ormconfig.json'), 'utf8'));
    const configuration = config.find((c) => c.name === 'test');
    configuration.name = 'default';
    return typeorm.createConnection(configuration).then(connection => {
      console.log('** Connected!!');
    });
  }
};
