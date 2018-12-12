import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';

const env = Object.assign({}, process.env, fs.existsSync(`${process.env.NODE_ENV || ''}.env`)
  ? dotenv.parse(fs.readFileSync(`${process.env.NODE_ENV || ''}.env`))
  : {}
);

@Injectable()
export class Config {
  public static readonly QueryCache = 60000;
  public static readonly IP: string = '0.0.0.0';
  public static readonly Port: number = 3000;
  public static readonly ServerUrl: string = `http://${Config.IP}:${Config.Port}`;
  public static readonly GlobalRoutePrefix: string = 'api';
  public static readonly DocsRoute: string = '/docs';
  public static readonly GraphRoute: string = `/graph`;
  public static readonly ApiUrl: string = `http://localhost:${Config.Port}/${Config.GlobalRoutePrefix}`;
  public static readonly JwtHeaderName: string = 'Authorization';

  public static readonly redLog: string = '\x1b[31m';
  public static readonly greenLog: string = '\x1b[32m';
  public static readonly yellowLog: string = '\x1b[33m';
  public static readonly magentaLog: string = '\x1b[35m';
  public static readonly cyanLog: string = '\x1b[36m';

  private readonly envConfig: { [key: string]: string } = env;

  public static isProd() {
    return env['NODE_ENV'] === 'prod' || env['NODE_ENV'] === 'production';
  }

  isProd(): boolean {
    return Config.isProd();
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
