import * as chalk from 'chalk';

/**
 * Human friendly error messages.
 * Because understanding is important!
 */
export let ERROR_MESSAGES: any = {
  ECONNREFUSED: `${chalk.default.red.bold('Connection refused!')}

${chalk.default.cyan.underline('Tip:')}
     Did you forget to start the database?
     Before you try and run the server standalone, ${chalk.default.white.bold('Please run:')}
       ${chalk.default.yellow('./docker-build')} \n\n`,

  ER_DBACCESS_DENIED_ERROR: `${chalk.default.red.bold('Database access denied!')}

${chalk.default.cyan.underline('Tip:')}
     Check the database configuration settings in ${chalk.default.yellow.bold('./ormconfig.json')}
     If that seems ok, check if there's something wrong with your 'db' docker image.\n\n`,

  EACCES: `${chalk.default.red.bold('Permission denied!')}

${chalk.default.cyan.underline('Tip:')}
     You could try running with elevated privileges.\n\n`,

  EADDRINUSE: `${chalk.default.red.bold('Address is in use!')}

${chalk.default.cyan.underline('Tip:')}
     Check if anything else occupies ${chalk.default.yellow.bold('port 3000')} on your machine.\n
        ${chalk.default.white.bold('netstat -aon | find "3000"')}
        ${chalk.default.white.bold('taskkill /F /pid <processId>')}\n\n`

};
