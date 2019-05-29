import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ConfigurationService } from 'app/shared/services/api';
import { IConfiguration } from 'app/model';
import { HttpClient } from '@angular/common/http';
import { BrowserService } from 'app/shared/browser.service';
import { SEOService } from 'app/shared/services/seo.service';

@Component({
  selector: 'app-advanced',
  templateUrl: './advanced.component.html',
  styleUrls: ['./advanced.component.scss']
})
export class AdvancedComponent implements OnInit {
  @ViewChild('area', { static: false }) textAreas: ElementRef;
  configuration: IConfiguration[];
  selected;
  isLoading = false;
  configForm: FormGroup = null;
  _defaultValues = null;
  get defaultValues() {
    if (this.configuration && !this._defaultValues) {
      const values = this.configuration.find(c => c.name === 'defaultValues').value;
      this._defaultValues = (typeof values === 'string' ? JSON.parse(values) : values);
    }
    return this._defaultValues;
  }
  get defaultValueKeys() {
    return this.configuration ? Object.keys(this.defaultValues) : null;
  }

  constructor(private browser: BrowserService, private config: ConfigurationService, private fb: FormBuilder, private seo: SEOService, private http: HttpClient) { }

  ngOnInit() {
    // SEO
    this.seo.setTitle('Advanced configuration', 'Configuring advanced system properties');

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

  backup() {
    this.http.get('/api/administration/backup', { responseType: 'arraybuffer' }).subscribe(res => {
      const blob = new Blob([res], { type: '' });
      const url = this.browser.window().URL.createObjectURL(blob);
      const pwa = this.browser.window().open(url);
      if (!pwa || pwa.closed || typeof pwa.closed === 'undefined') {
        alert('Please disable your Pop-up blocker and try again.');
      }
    });
  }
}
