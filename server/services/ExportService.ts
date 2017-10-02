import { Request, Response } from 'express';

import * as moment from 'moment';
import * as _ from 'lodash';
const json2csv: any = require('json2csv');

import { Logger } from '../utils/Logger';

export interface ExportOptions {
  data: any;
  fields?: string[];
  name: string;
}

export class ExportService {
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
      Logger.log.error(err);
    };
  }
}
