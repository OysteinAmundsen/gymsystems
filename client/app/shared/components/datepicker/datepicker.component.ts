import { Component, ElementRef, Inject, OnInit, forwardRef, Input, Output, EventEmitter, HostListener, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import * as moment from 'moment';
import { Logger } from 'app/services';

export interface CalendarDate {
  day: number;
  month: number;
  year: number;
  enabled: boolean;
  today: boolean;
  selected: boolean;
  momentObj: moment.Moment;
}

export interface IDateModel {
  hour: string;
  minute: string;
  day: string;
  month: string;
  year: string;
  formatted: string;
  momentObj: moment.Moment;
}

export class DateModel implements IDateModel{
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

export interface IDatePickerOptions {
  autoApply?: boolean;
  setTime?: boolean;
  style?: 'normal' | 'big' | 'bold';
  locale?: string;
  minDate?: Date;
  maxDate?: Date;
  initialDate?: Date;
  firstWeekdaySunday?: boolean;
  format?: string;
}

export class DatePickerOptions implements IDatePickerOptions {
  autoApply?: boolean;
  setTime?: boolean;
  style?: 'normal' | 'big' | 'bold';
  locale?: string;
  minDate?: Date;
  maxDate?: Date;
  initialDate?: Date;
  firstWeekdaySunday?: boolean;
  format?: string;

  constructor(obj?: IDatePickerOptions) {
    this.autoApply = (obj && obj.autoApply === true) ? true : false;
    this.setTime = (obj && obj.setTime === true) ? true : false;
    this.style = obj && obj.style ? obj.style : 'normal';
    this.locale = obj && obj.locale ? obj.locale : 'en';
    this.minDate = obj && obj.minDate ? obj.minDate : null;
    this.maxDate = obj && obj.maxDate ? obj.maxDate : null;
    this.initialDate = obj && obj.initialDate ? obj.initialDate : null;
    this.firstWeekdaySunday = obj && obj.firstWeekdaySunday ? obj.firstWeekdaySunday : false;
    this.format = obj && obj.format ? obj.format : 'YYYY-MM-DD' + (this.setTime ? ' HH:mm' : '');
  }
}

export const CALENDAR_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatepickerComponent),
  multi: true
};

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [CALENDAR_VALUE_ACCESSOR]
})
export class DatepickerComponent implements ControlValueAccessor, OnInit {
  @Input() options: DatePickerOptions;
  @Input() inputEvents: EventEmitter<{ type: string, data: string | DateModel }>;
  @Output() outputEvents: EventEmitter<{ type: string, data: string | DateModel }>;

  @ViewChild('dateInput') dateInput;

  date: DateModel;

  opened: boolean;
  show: 'year' | 'date' | 'time' = 'date';
  currentDate: moment.Moment;
  days: CalendarDate[];
  years: number[];

  minDate: moment.Moment | any;
  maxDate: moment.Moment | any;

  private onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: any) => void = () => { };

  constructor( @Inject(ElementRef) public el: ElementRef) {
    this.opened = false;
    this.currentDate = moment();
    this.options = this.options || {};
    this.days = [];
    this.years = [];
    this.date = new DateModel({
      hour: null,
      minute: null,
      day: null,
      month: null,
      year: null,
      formatted: null,
      momentObj: null
    });

    this.generateYears();

    this.outputEvents = new EventEmitter<{ type: string, data: string | DateModel }>();

    if (!this.inputEvents) {
      return;
    }

    this.inputEvents.subscribe((event: { type: string, data: string | DateModel }) => {
      if (event.type === 'setDate') {
        this.value = event.data as DateModel;
      } else if (event.type === 'default') {
        if (event.data === 'open') {
          this.open();
        } else if (event.data === 'close') {
          this.close();
        }
      }
    });
  }

  get value(): DateModel {
    return this.date;
  }

  set value(date: DateModel) {
    if (!date) { return; }
    this.date = date;
    this.onChangeCallback(date);
  }

  modelChanged(value) {
    const date: moment.Moment = moment(value, this.options.format);

    if (this.value && date.isValid) {
      this.value.minute = date.format('mm');
      this.value.hour = date.format('HH');
      this.value.day = date.format('DD');
      this.value.month = date.format('MM');
      this.value.year = date.format('YYYY');
      this.value.momentObj = date;
      this.currentDate = date;
    } else {
      Logger.log('No value object created!');
    }
  }



  ngOnInit() {
    this.setup();
    this.outputEvents.emit({ type: 'default', data: 'init' });

    if (typeof window !== 'undefined') {
      const body = document.querySelector('body');
      body.addEventListener('click', e => {
        if (!this.opened || !e.target) { return; };
        if (this.el.nativeElement !== e.target && !this.el.nativeElement.contains((<any>e.target))) {
          this.close();
        }
      }, false);
    }

    if (this.inputEvents) {
      this.inputEvents.subscribe((e: any) => {
        if (e.type === 'action') {
          if (e.data === 'toggle') { this.toggle(); }
          if (e.data === 'close')  { this.close(); }
          if (e.data === 'open')   { this.open(); }
        }

        if (e.type === 'setDate') {
          if (!(e.data instanceof Date)) {
            throw new Error(`Input data must be an instance of Date!`);
          }
          const date: moment.Moment = moment.utc(e.data);
          if (!date) {
            throw new Error(`Invalid date: ${e.data}`);
          }
          this.value = this.modelFromDate(date);
        }
      });
    }
  }

  setup() {
    this.options = new DatePickerOptions(this.options);

    if (!this.date.formatted) {
      if (this.options.initialDate instanceof Date) {
        this.currentDate = moment.utc(this.options.initialDate);
        this.selectDate(null, this.currentDate);
      } else if (this.options.initialDate && (<IDateModel>this.options.initialDate).momentObj) {
        this.currentDate = (<IDateModel>this.options.initialDate).momentObj.clone();
        this.selectDate(null, this.currentDate);
      }
    }

    if (this.options.minDate instanceof Date) {
      this.minDate = moment.utc(this.options.minDate);
    } else if (this.options.minDate && (<IDateModel>this.options.minDate).momentObj) {
      this.minDate = (<IDateModel>this.options.minDate).momentObj.clone();
    } else {
      this.minDate = null;
    }

    if (this.options.maxDate instanceof Date) {
      this.maxDate = moment.utc(this.options.maxDate);
    } else if (this.options.maxDate && (<IDateModel>this.options.maxDate).momentObj) {
      this.maxDate = (<IDateModel>this.options.maxDate).momentObj.clone();
    } else {
      this.maxDate = null;
    }

    this.generateCalendar();
  }

  generateCalendar() {
    const date: moment.Moment = moment.utc(this.currentDate);
    const month = date.month();
    const year = date.year();
    let n = 1;
    const firstWeekDay = (this.options.firstWeekdaySunday) ? date.date(2).day() : date.date(1).day();

    if (firstWeekDay !== 1) {
      n -= (firstWeekDay + 6) % 7;
    }

    this.days = [];
    const selectedDate: moment.Moment = this.date.momentObj ? this.date.momentObj.clone() : null;
    for (let i = n; i <= date.endOf('month').date(); i += 1) {
      const currentDate: moment.Moment = moment().year(year).month(month).date(i);
      const today: boolean = (moment().isSame(currentDate, 'day') && moment().isSame(currentDate, 'month'));
      const selected: boolean = (selectedDate && selectedDate.isSame(currentDate, 'day'));
      let betweenMinMax = true;

      if (this.minDate != null && this.maxDate != null) {
        betweenMinMax = currentDate.isBetween(this.minDate.clone().subtract(1, 'day'), this.maxDate, 'day', '[]');
      } else if (this.minDate != null) {
        betweenMinMax = currentDate.isAfter(this.minDate.clone().subtract(1, 'day'), 'day');
      } else if (this.maxDate != null) {
        betweenMinMax = currentDate.isBefore(this.maxDate, 'day');
      }

      const day: CalendarDate = {
        day: i > 0 ? i : null,
        month: i > 0 ? month : null,
        year: i > 0 ? year : null,
        enabled: i > 0 ? betweenMinMax : false,
        today: i > 0 && today ? true : false,
        selected: i > 0 && selected ? true : false,
        momentObj: currentDate
      };

      this.days.push(day);
    }
  }

  modelFromDate(date: moment.Moment) {
    return {
      minute: date.format('mm'),
      hour: date.format('HH'),
      day: date.format('DD'),
      month: date.format('MM'),
      year: date.format('YYYY'),
      formatted: date.utc().format(this.options.format),
      momentObj: date.clone()
    };
  }

  selectDate(e: MouseEvent, date: moment.Moment) {
    if (e) { e.preventDefault(); }

    this.value = this.modelFromDate(date);
    this.generateCalendar();

    setTimeout(() => {
      this.outputEvents.emit({ type: 'dateChanged', data: this.value });
      this.dateInput.nativeElement.focus();
      this.dateInput.nativeElement.blur();
    });

    if (this.options.autoApply === true && this.opened === true) {
      this.opened = false;
    }
  }

  selectYear(e: MouseEvent, year: number) {
    e.preventDefault();

    setTimeout(() => {
      const date: moment.Moment = this.currentDate.year(year);
      this.value = this.modelFromDate(date);
      this.show = 'date';
      this.generateCalendar();
    });
  }

  generateYears() {
    const date: moment.Moment = this.options.minDate ? moment(this.options.minDate) : moment(moment().year() - 40);
    const toDate: moment.Moment = this.options.maxDate ? moment(this.options.maxDate) : moment(moment().year() + 40);
    const years = toDate.year() - date.year();

    for (let i = 0; i < years; i++) {
      this.years.push(date.year());
      date.add(1, 'year');
    }
  }

  /**
   * The method that writes a new value from the form model into the view or (if needed) DOM property.
   * This is where we want to update our model, as that’s the thing that is used in the view.
   *
   * @param date
   */
  writeValue(date: DateModel | Date) {
    if (!date) { return; }
    if (date instanceof DateModel) {
      this.date = date;
    } else if (date instanceof Date) {
      this.date = this.modelFromDate(moment(date));
    }
    this.currentDate = this.date.momentObj.clone();
    this.selectDate(null, this.currentDate);
  }

  /**
   * a method that registers a handler that should be called when something in the view has changed.
   * It gets a function that tells other form directives and form controls to update their values.
   * In other words, that’s the handler function we want to call whenever our value changes through the view.
   *
   * @param fn
   */
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  /**
   * Similiar to registerOnChange(), this registers a handler specifically for when a control
   * receives a touch event.
   *
   * @param fn
   */
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  prevMonth() {
    this.currentDate = this.currentDate.subtract(1, 'month');
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate = this.currentDate.add(1, 'month');
    this.generateCalendar();
  }

  today() {
    const currentDate = moment();
    if ((!this.minDate || currentDate.isAfter(this.minDate)) && (!this.maxDate || currentDate.isBefore(this.maxDate))) {
      this.currentDate = currentDate;
      this.selectDate(null, this.currentDate);
    }
  }

  toggle() {
    !this.opened ? this.open() : this.close();
  }

  open() {
    this.setup();
    this.opened = true;
    this.show = 'date';
    this.outputEvents.emit({ type: 'default', data: 'opened' });
  }

  close() {
    this.opened = false;
    this.outputEvents.emit({ type: 'default', data: 'closed' });
  }

  openYearPicker() {
    setTimeout(() => {
      this.show = 'year';
      setTimeout(() => this.el.nativeElement.querySelector('.selected').scrollIntoView());
    });
  }

  openTimePicker() {
    setTimeout(() => this.show = 'time');
  }
  openDatePicker() {
    setTimeout(() => this.show = 'date');
  }

  @HostListener('keydown', ['$event'])
  onKey(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown': this.open(); break;
      case 'ArrowUp': this.close(); break;
    }
    if (this.opened) {
      switch (event.key) {
        case 'ArrowLeft': event.preventDefault(); event.stopPropagation(); this.prevMonth(); break;
        case 'ArrowRight': event.preventDefault(); event.stopPropagation(); this.nextMonth(); break;
      }
    }
  }
}
