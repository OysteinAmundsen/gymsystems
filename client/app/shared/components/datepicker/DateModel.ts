import * as moment from 'moment';

export interface IDateModel {
  hour: string;
  minute: string;
  day: string;
  month: string;
  year: string;
  formatted: string;
  momentObj: moment.Moment;
}

export class DateModel implements IDateModel {
  hour: string;
  minute: string;
  day: string;
  month: string;
  year: string;
  formatted: string;
  momentObj: moment.Moment;

  constructor(obj?: IDateModel) {
    this.minute = obj && obj.minute ? obj.minute : null;
    this.hour = obj && obj.hour ? obj.hour : null;
    this.day = obj && obj.day ? obj.day : null;
    this.month = obj && obj.month ? obj.month : null;
    this.year = obj && obj.year ? obj.year : null;
    this.formatted = obj && obj.formatted ? obj.formatted : null;
    this.momentObj = obj && obj.momentObj ? obj.momentObj : null;
  }
}
