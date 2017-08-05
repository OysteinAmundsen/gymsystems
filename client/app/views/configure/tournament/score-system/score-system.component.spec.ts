/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app/app.module';

import { ScoreSystemComponent } from './score-system.component';
import { ScoreGroupEditorComponent } from './score-group-editor/score-group-editor.component';
import { SharedModule } from 'app/shared/shared.module';
import { ScoreGroupService, ConfigurationService } from 'app/services/api';
import { ScoreGroupServiceStub } from 'app/services/api/scoregroup/scoregroup.service.stub';
import { ConfigurationServiceStub } from 'app/services/api/configuration/configuration.service.stub';

describe('ScoreComponent', () => {
  let component: ScoreSystemComponent;
  let fixture: ComponentFixture<ScoreSystemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        HttpModule,
        RouterTestingModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
      ],
      declarations: [
        ScoreSystemComponent,
        ScoreGroupEditorComponent
      ],
      providers: [
        {provide: ScoreGroupService, useClass: ScoreGroupServiceStub},
        {provide: ConfigurationService, useClass: ConfigurationServiceStub},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
