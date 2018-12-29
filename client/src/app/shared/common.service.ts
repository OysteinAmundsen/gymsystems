import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { ITournament } from 'app/model/ITournament';

@Injectable({ providedIn: 'root' })
export class CommonService {

  constructor() { }

  /**
   *
   */
  static dateSpan(tournament: ITournament): string {
    const toDate = (date: moment.Moment) => moment(date).format('DD');
    if (tournament && tournament.startDate && tournament.endDate) {
      const start = moment(tournament.startDate);
      const end = moment(tournament.endDate);
      const month = end.isSame(start, 'month') ? end.format('MMM') : start.format('MMM') + '/' + end.format('MMM');
      const year = moment(tournament.endDate).format('YYYY');
      if (end.diff(start, 'days') > 1) {
        return `${toDate(start)}.-${toDate(end)}. ${month} ${year}`;
      }
      return `${toDate(start)}. ${month} ${year}`;
    }
    return '';
  }

  static compressString(str: string) {
    return str.replace(/#.+| +?|\r?\n|\r/gm, '');
  }
}
