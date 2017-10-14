import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ConfigurationService } from 'app/services/api';
import { IConfiguration } from 'app/model';

@Component({
  selector: 'app-advanced',
  templateUrl: './advanced.component.html',
  styleUrls: ['./advanced.component.scss']
})
export class AdvancedComponent implements OnInit {
  @ViewChild('area') textAreas: ElementRef;
  configuration: IConfiguration[];
  selected;
  isLoading = false;
  configForm: FormGroup = null;
  get defaultValues() {
    return this.configuration ? this.configuration.find(c => c.name === 'defaultValues').value : null;
  }
  get defaultValueKeys() {
    return this.configuration ? Object.keys(this.defaultValues) : null;
  }

  constructor(private config: ConfigurationService, private fb: FormBuilder, private title: Title, private meta: Meta) {
    // SEO
    title.setTitle('Advanced configuration | GymSystems');
    meta.updateTag({property: 'og:title', content: 'Advanced configuration | GymSystems'});
    meta.updateTag({property: 'og:description', content: 'Configuring advanced system properties'});
  }

  ngOnInit() {
    this.isLoading = true;
    this.configForm = this.fb.group({
      'executionTime'        : [0],
      'trainingTime'         : [0],

      // Age limits
      // 'agelimit.aspirant.min': [0, [Validators.min(0), Validators.max(99), Validators.maxLength(2)]],
      // 'agelimit.aspirant.max': [0, [Validators.min(0), Validators.max(99), Validators.maxLength(2)]],
      // 'agelimit.rekrutt.min' : [0, [Validators.min(0), Validators.max(99), Validators.maxLength(2)]],
      // 'agelimit.rekrutt.max' : [0, [Validators.min(0), Validators.max(99), Validators.maxLength(2)]],
      // 'agelimit.junior.min'  : [0, [Validators.min(0), Validators.max(99), Validators.maxLength(2)]],
      // 'agelimit.junior.max'  : [0, [Validators.min(0), Validators.max(99), Validators.maxLength(2)]],
      // 'agelimit.senior.min'  : [0, [Validators.min(0), Validators.max(99), Validators.maxLength(2)]],
      // 'agelimit.senior.max'  : [0, [Validators.min(0), Validators.max(99), Validators.maxLength(2)]]
    });

    this.config.all().subscribe(res => {
      this.configuration = res;
      this.selected = this.defaultValueKeys[0];
      setTimeout(() => this.isLoading = false);

      const executionTime = this.configuration.find(c => c.name === 'scheduleExecutionTime');
      const trainingTime = this.configuration.find(c => c.name === 'scheduleTrainingTime');
      // const ageLimits = this.configuration.find(c => c.name === 'ageLimits');

      this.configForm.setValue({
        'executionTime'        : executionTime ? executionTime.value : 0,
        'trainingTime'         : trainingTime ? trainingTime.value : 0,

        // Age limits
        // 'agelimit.aspirant.min': ageLimits ? ageLimits.value.aspirant.min : 0,
        // 'agelimit.aspirant.max': ageLimits ? ageLimits.value.aspirant.max : 0,
        // 'agelimit.rekrutt.min' : ageLimits ? ageLimits.value.rekrutt.min  : 0,
        // 'agelimit.rekrutt.max' : ageLimits ? ageLimits.value.rekrutt.max  : 0,
        // 'agelimit.junior.min'  : ageLimits ? ageLimits.value.junior.min   : 0,
        // 'agelimit.junior.max'  : ageLimits ? ageLimits.value.junior.max   : 0,
        // 'agelimit.senior.min'  : ageLimits ? ageLimits.value.senior.min   : 0,
        // 'agelimit.senior.max'  : ageLimits ? ageLimits.value.senior.max   : 0
      });
    });
  }

  getRows(v) {
    if (Array.isArray(v)) { return 2 + (Object.keys(v[0]).length + 2) * v.length; }
    return 2 + Object.keys(v).length;
  }

  valueChanged(key, $event) {
    if (!this.isLoading) {
      this.defaultValues[key] = $event;
      this.save();
    }
  }

  save() {
    const newConfig = <IConfiguration[]>[
      {name: 'scheduleExecutionTime', value: this.configForm.value.executionTime },
      {name: 'scheduleTrainingTime', value: this.configForm.value.trainingTime },
      // {name: 'ageLimits', value: {
      //   aspirant: {min: this.configForm.value['agelimit.aspirant.min'], max: this.configForm.value['agelimit.aspirant.max']},
      //   rekrutt: {min: this.configForm.value['agelimit.rekrutt.min'], max: this.configForm.value['agelimit.rekrutt.max']},
      //   junior: {min: this.configForm.value['agelimit.junior.min'], max: this.configForm.value['agelimit.junior.max']},
      //   senior: {min: this.configForm.value['agelimit.senior.min'], max: this.configForm.value['agelimit.senior.max']},
      // }},
      {name: 'defaultValues', value: this.defaultValues }
    ]
    this.config.save(newConfig).subscribe(res => this.configuration = res);
  }
}
