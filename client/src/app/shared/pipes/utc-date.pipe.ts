import { Pipe, PipeTransform } from '@angular/core';

import { utc } from 'moment';

@Pipe({ name: 'utcDate' })
export class UtcDatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return utc(value).format(args || 'DD.MM.YYYY');
  }
}
