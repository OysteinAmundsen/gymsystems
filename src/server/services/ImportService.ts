import { Request, Response } from 'express';
import * as moment from 'moment';
import * as _ from 'lodash';
import * as fs from 'fs';
import * as path from 'path';

const Json2csvParser: any = require('json2csv').Parser;

import { Log } from '../utils/Logger';

export class ImportService {
  /**
   *
   * @param opt
   * @param res
   */
  static importCSV(csv: string) {
  }
}
