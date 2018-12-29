import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';

@Pipe({ name: 'utcDate' })
export class UtcDatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return moment.utc(value).format(args || 'DD.MM.YYYY');
  }
}
