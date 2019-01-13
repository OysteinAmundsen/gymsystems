import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ConfigurationService } from 'app/shared/services/api';
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
    return this.configuration ? this.configuration.find(c => c.name === 'defaultValues').value : {};
  }
  get defaultValueKeys() {
    return this.configuration ? Object.keys(this.defaultValues) : null;
  }

  constructor(private config: ConfigurationService, private fb: FormBuilder, private title: Title, private meta: Meta) {
  }

  ngOnInit() {
    // SEO
    this.title.setTitle('GymSystems | Advanced configuration');
    this.meta.updateTag({ property: 'og:title', content: 'GymSystems | Advanced configuration' });
    this.meta.updateTag({ property: 'og:description', content: 'Configuring advanced system properties' });
    this.meta.updateTag({ property: 'description', content: 'Configuring advanced system properties' });

    this.isLoading = true;
    this.configForm = this.fb.group({
      'executionTime': [0],
      'trainingTime': [0],
    });

    this.config.all().subscribe(res => {
      this.configuration = res;
      this.selected = this.defaultValueKeys[0];
      setTimeout(() => this.isLoading = false);

      const executionTime = this.configuration.find(c => c.name === 'scheduleExecutionTime');
      const trainingTime = this.configuration.find(c => c.name === 'scheduleTrainingTime');

      this.configForm.setValue({
        'executionTime': executionTime ? executionTime.value : 0,
        'trainingTime': trainingTime ? trainingTime.value : 0,
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
      { name: 'scheduleExecutionTime', value: this.configForm.value.executionTime },
      { name: 'scheduleTrainingTime', value: this.configForm.value.trainingTime },
      { name: 'defaultValues', value: this.defaultValues }
    ];
    this.config.save(newConfig).subscribe(res => this.configuration = res);
  }
}
