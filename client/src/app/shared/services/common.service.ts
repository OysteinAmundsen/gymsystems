import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { ITournament } from 'app/model/ITournament';
import { ITeamInDiscipline, ParticipationType } from 'app/model';

@Injectable({ providedIn: 'root' })
export class CommonService {

  constructor() { }

  static makeId(len: number) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < len; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  static omit(obj, properties: string[]) {
    return Object.keys(obj)
      .filter(k => !properties.includes(k))
      .map(k => Object.assign({}, { [k]: obj[k] }))
      .reduce((res, o) => Object.assign(res, o), {});
  }

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

  /**
   *
   */
  static stringHash(participant: ITeamInDiscipline, toType?: ParticipationType): string {
    return (participant.team.name
      + participant.divisionName
      + participant.disciplineName
      + (toType ? toType : participant.type))
      .replace(' ', '_');
  }

}
