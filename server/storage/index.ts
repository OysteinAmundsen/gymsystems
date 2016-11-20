import * as Promise from 'bluebird';
import * as Sequelize from 'sequelize';
import { Logger } from 'bunyan';

export interface SequelizeStorageConfig {
  database: string;
  username: string;
  password: string;
}

export interface StorageManager {
  init(force?: boolean): Promise<any>;
}

export class SequelizeStorageManager implements StorageManager {
  public sequelize: Sequelize.Sequelize;

  private log: Logger;
  private config: SequelizeStorageConfig;

  constructor(config: SequelizeStorageConfig, logger: Logger) {
    this.config = config;
    this.log = logger.child({ component: 'Storage' });

    this.sequelize = new Sequelize(this.config.database, this.config.username, this.config.password, { dialect: 'mysql' });
  }

  init(force?: boolean): Promise<any> {
    force = force || false;
    this.log.trace('Connecting to DB');
    return this.sequelize.sync({ force: force, logging: true });
  }
}
