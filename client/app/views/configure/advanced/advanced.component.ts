import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ConfigurationService } from 'app/services/api';

@Component({
  selector: 'app-advanced',
  templateUrl: './advanced.component.html',
  styleUrls: ['./advanced.component.scss']
})
export class AdvancedComponent implements OnInit {
  @ViewChild('area') textAreas: ElementRef;
  configuration;
  selected;
  get defaultValues() {
    return this.configuration ? this.configuration.find(c => c.name === 'defaultValues').value : null;
  }
  get defaultValueKeys() {
    return this.configuration ? Object.keys(this.defaultValues) : null;
  }

  get executionTime() {
    return this.configuration ? this.configuration.find(c => c.name === 'scheduleExecutionTime').value : null;
  }
  set executionTime(value) {
    let execIndex = this.configuration.findIndex(c => c.name === 'scheduleExecutionTime');
    if (execIndex == -1) {
      this.configuration.push({name: 'scheduleExecutionTime', value: value});
    }
    else {
      this.configuration[execIndex].value = value;
    }
  }

  constructor(private config: ConfigurationService, private title: Title) {
    title.setTitle('Advanced configuration | GymSystems');
  }

  ngOnInit() {
    this.config.all().subscribe(res => {
      this.configuration = res;
      this.selected = this.defaultValueKeys[0];
    });
  }

  getRows(v) {
    if (Array.isArray(v)) { return 2 + (Object.keys(v[0]).length + 2) * v.length; }
    return 2 + Object.keys(v).length;
  }

  valueChanged(key, $event) {
    this.defaultValues[key] = $event;
    this.save();
  }

  save() {
    this.config.save(this.configuration).subscribe(res => this.configuration = res);
  }
}
