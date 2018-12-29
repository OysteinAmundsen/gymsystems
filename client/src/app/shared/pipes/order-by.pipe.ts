import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'orderBy' })
export class OrderByPipe implements PipeTransform {

  transform(records: any[], args?: string): any {
    const direction = (args.substring(0, 1) === '~' ? -1 : 1);
    const property = args.replace('~', '');
    if (!records || !records.length) {
      return records;
    }
    return records.sort((a, b) => {
      if (a[property] < b[property]) {
        return -1 * direction;
      } else if (a[property] > b[property]) {
        return 1 * direction;
      } else {
        return 0;
      }
    });
  }
}
