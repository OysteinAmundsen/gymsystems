import { parse } from 'dotenv';
import { existsSync, readFileSync } from 'fs';
import { Injectable } from '@nestjs/common';

/**
 * Read system environment and concatenate with .env file if exists.
 */
export function readEnv() {
  const base = process.env;
  const env_filename = (base.NODE_ENV && existsSync(`${base.NODE_ENV}.env`)) ? `${base.NODE_ENV}.env` : '.env';  // `{mode}.env` or just `.env`
  return Object.assign({}, base, existsSync(env_filename) ? parse(readFileSync(env_filename)) : {});   // Concatenate .env file with system env IF exists.
}

@Injectable()
export class Config {
  public static readonly QueryCache = 60000;
  public static readonly IP: string = '0.0.0.0';
  public static readonly Port: number = 3000;
  public static readonly ServerUrl: string = `http://${Config.IP}:${Config.Port}`;
  public static readonly GlobalRoutePrefix: string = 'api';
  public static readonly DocsRoute: string = '/docs';
  public static readonly GraphRoute: string = `/graph`;
  public static readonly SubscribeRoute: string = `/ws`;
  public static readonly ApiUrl: string = `http://localhost:${Config.Port}/${Config.GlobalRoutePrefix}`;
  public static readonly JwtHeaderName: string = 'Authorization';

  public static readonly redLog: string = '\x1b[31m';
  public static readonly greenLog: string = '\x1b[32m';
  public static readonly yellowLog: string = '\x1b[33m';
  public static readonly magentaLog: string = '\x1b[35m';
  public static readonly cyanLog: string = '\x1b[36m';
  private static readonly env: { [key: string]: string } = readEnv();

  public static isProd() {
    return Config.env['NODE_ENV'] === 'prod' || Config.env['NODE_ENV'] === 'production';
  }

  isProd(): boolean {
    return Config.isProd();
  }

  get(key: string): string {
    return Config.env[key];
  }
}
