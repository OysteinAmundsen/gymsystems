const dotenv = require('dotenv');
const fs = require('fs');

const env = Object.assign({}, process.env, fs.existsSync(`${process.env.NODE_ENV || ''}.env`)
  ? dotenv.parse(fs.readFileSync(`${process.env.NODE_ENV || ''}.env`))
  : {}
);
const runtime = env.RUNTIME;
const isProd = env.NODE_ENV === 'production';

module.exports = [
  {
    type: 'mysql',
    logging: isProd ? ['error'] : ['query', 'error'],
    logger: 'advanced-console',
    host: env.HOSTNAME,
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
    username: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB
  }
]
