import { Injectable } from '@nestjs/common';
import mysqldump, { DumpReturn } from 'mysqldump'
import { isObject, isArray } from 'lodash';
import { Parser } from 'json2csv';
import * as ormData from 'api/../../ormconfig.js';

export interface ExportOptions {
  data: any;
  fields?: string[];
}

export const exportDelimeter = ';';

@Injectable()
export class ExportService {

  async dumpDb(): Promise<DumpReturn> {
    return await mysqldump({
      connection: {
        host: ormData[0].host,
        user: ormData[0].username,
        password: ormData[0].password,
        database: ormData[0].database,
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
  }
}
