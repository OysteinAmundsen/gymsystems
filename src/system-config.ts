/***********************************************************************************************
 * User Configuration.
 **********************************************************************************************/
/** Map relative paths to URLs. */
const map: any = {
};

/** User packages configuration. */
const packages: any = {
};

////////////////////////////////////////////////////////////////////////////////////////////////
/***********************************************************************************************
 * Everything underneath this line is managed by the CLI.
 **********************************************************************************************/
const barrels: string[] = [
  // Angular specific barrels.
  '@angular/core',
  '@angular/common',
  '@angular/compiler',
  '@angular/http',
  '@angular/router',
  '@angular/platform-browser',
  '@angular/platform-browser-dynamic',

  // Thirdparty barrels.
  'rxjs',

  // App specific barrels.
  'app',
  'app/+login',
  'app/+home',
  'app/+add-score',
  'app/+lists',
  'app/+lists/+start',
  'app/+lists/+results',
  'app/+display',
  'app/+configure',
  'app/+configure/+score',
  'app/+configure/+lists',
  'app/+configure/+display',
  'app/+configure/+advanced',
  'app/+configure/+tournament',
  'app/+configure/+teams',
  'app/+configure/+divisions',
  'app/shared',
  'app/scoreboard',
  'app/scoreboard/score-group',
  'app/scoreboard/score',
  'app/fontawesome',
  'app/modal',
  'app/dialog',
  'app/+configure/+display/macro-dialog',
  /** @cli-barrel */
];

const cliSystemConfigPackages: any = {};
barrels.forEach((barrelName: string) => {
  cliSystemConfigPackages[barrelName] = { main: 'index' };
});

/** Type declaration for ambient System. */
declare var System: any;

// Apply the CLI SystemJS configuration.
System.config({
  map: {
    '@angular': 'vendor/@angular',
    'rxjs': 'vendor/rxjs',
    'main': 'main.js'
  },
  packages: cliSystemConfigPackages
});

// Apply the user's configuration.
System.config({ map, packages });
