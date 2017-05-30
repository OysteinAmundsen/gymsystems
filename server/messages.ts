import * as chalk from 'chalk';

/**
 * Human friendly error messages.
 * Because understanding is important!
 */
export let ERROR_MESSAGES: any = {
  ECONNREFUSED: `${chalk.red.bold('Connection refused!')}

${chalk.cyan.underline('Tip:')}
     Did you forget to start the database?
     Before you try and run the server standalone, ${chalk.white.bold('Please run:')}
       ${chalk.yellow('./docker-build')} \n\n`,

  ER_DBACCESS_DENIED_ERROR: `${chalk.red.bold('Database access denied!')}

${chalk.cyan.underline('Tip:')}
     Check the database configuration settings in ${chalk.yellow.bold('./ormconfig.json')}
     If that seems ok, check if there's something wrong with your 'db' docker image.\n\n`,

  EACCES: `${chalk.red.bold('Permission denied!')}

${chalk.cyan.underline('Tip:')}
     You could try running with elevated privileges.\n\n`,

  EADDRINUSE: `${chalk.red.bold('Address is in use!')}

${chalk.cyan.underline('Tip:')}
     Check if anything else occupies ${chalk.yellow.bold('port 3000')} on your machine.\n
        ${chalk.white.bold('netstat -aon | find "3000"')}
        ${chalk.white.bold('taskkill /F /pid <processId>')}\n\n`

};
