import { Injectable } from '@nestjs/common';
import mysqldump, { DumpReturn } from 'mysqldump'
import { isObject, isArray } from 'lodash';
import { Parser } from 'json2csv';
import * as ormData from 'api/../../ormconfig.js';

export interface ExportOptions {
  data: any;
  fields?: string[];
  name: string;
}

export const exportDelimeter = ';';

@Injectable()
export class ExportService {

  async dumpDb(): Promise<DumpReturn> {
    return await mysqldump({
      connection: {
        host: ormData.host,
        user: ormData.username,
        password: ormData.password,
        database: ormData.database,
      },
      dumpToFile: './dbdump.sql', // destination file
      dump: {
        data: {
          maxRowsPerInsertStatement: 1000
        }
      }
    });
  }

  writeCSVExport(opt: ExportOptions): string {
    // Flatten data to only primitives.
    const data = opt.data.map((d: any) => {
      return Object.keys(d).reduce((prev: any, curr) => {
        if (!isObject(d[curr]) && !isArray(d[curr])) {
          prev[curr] = d[curr];
        }
        return prev;
      }, {});
    });

    // Set fields if not given
    const fields = opt.fields || Object.keys(opt.data[0]);

    // Write data to client
    const parser = new Parser({ fields, delimiter: exportDelimeter });
    return parser.parse(data);
    // try {
    //   res.charset = 'utf-8';
    //   res.status(200)
    //     .attachment(`${opt.name}.export_${now.format('YYYY.MM.DD')}.csv`)
    //     .contentType('text/csv')
    //     .send(parser.parse(data));
    // } catch (err) {
    //   Log.log.error(err);
    // }
  }
}
