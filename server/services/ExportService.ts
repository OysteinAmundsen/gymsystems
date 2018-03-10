import { Request, Response } from 'express';

import * as moment from 'moment';
import * as _ from 'lodash';
import * as mysqlDump from 'mysqldump';
import * as fs from 'fs';
import * as path from 'path';

const json2csv: any = require('json2csv');

import { Log } from '../utils/Logger';

export interface ExportOptions {
  data: any;
  fields?: string[];
  name: string;
}

export class ExportService {
  /**
   *
   * @param arg0
   */
  static writeExport(res: Response): any {
    const ormData = JSON.parse(fs.readFileSync('./ormconfig.json', 'UTF-8'))[0];
    console.log(ormData);
    mysqlDump({
        host: ormData.host,
        user: ormData.username,
        password: ormData.password,
        database: ormData.database,
        ifNotExist: true,
        data: true,
        dest: './dbdump.sql' // destination file
    }, function (err) {
        res.status(200)
          .attachment('dbdump.sql')
          .sendFile(path.resolve('./dbdump.sql'));
    });
  }

  /**
   *
   * @param opt
   * @param res
   */
  static writeCSVExport(opt: ExportOptions, res: Response) {
    // Flatten data to only primitives.
    opt.data = opt.data.map((d: any) => {
      return Object.keys(d).reduce((prev: any, curr) => {
        if (!_.isObject(d[curr]) && !_.isArray(d[curr])) {
          prev[curr] = d[curr];
        }
        return prev;
      }, {});
    });

    // Set fields if not given
    opt.fields = opt.fields || Object.keys(opt.data[0]);

    // Write data to client
    const now = moment();
    try {
      res.charset = 'utf-8';
      res.status(200)
        .attachment(`${opt.name}.export_${now.format('YYYY.MM.DD')}.csv`)
        .contentType('text/csv')
        .send(json2csv({ data: opt.data, fields: opt.fields, del: ';' }));
    } catch (err) {
      Log.log.error(err);
    }
  }
}
