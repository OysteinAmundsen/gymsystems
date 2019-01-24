const dotenv = require('dotenv');
const fs = require('fs');

function readEnv() {
  const base = process.env;
  const env_filename = (base.NODE_ENV && fs.existsSync(`${base.NODE_ENV}.env`)) ? `${base.NODE_ENV}.env` : '.env';  // `{mode}.env` or just `.env`
  return Object.assign({}, base, fs.existsSync(env_filename) ? dotenv.parse(fs.readFileSync(env_filename)) : {});   // Concatenate .env file with system env IF exists.
}


const env = readEnv();
const runtime = env.RUNTIME;
const isProd = env.NODE_ENV === 'production';

module.exports = [
  {
    type: 'mysql',
    logging: isProd ? ['error'] : ['query', 'error'],
    logger: 'advanced-console',
    host: env.DB_HOSTNAME,
    port: 3306,
    entities: [`./**/**.model.${runtime}`],
    migrations: [`./**/migrations/*.${runtime}`],
    cache: true,
    synchronize: true,
    migrationsRun: true,
    cli: {
      entitiesDir: './src/api/graph',
      migrationsDir: './src/migrations'
    },
    username: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE
  }
]
