/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app';

import { ScoreGroupEditorComponent } from './score-group-editor.component';
import { SharedModule } from 'app/shared/shared.module';
import { ScoreGroupService } from 'app/services/api';
import { ScoreGroupServiceStub } from 'app/services/api/scoregroup.service.stub';
import { ErrorHandlerService } from "app/services/config/ErrorHandler.service";
import { HttpInterceptor } from "app/services/config/HttpInterceptor";

describe('ScoreGroupEditorComponent', () => {
  let component: ScoreGroupEditorComponent;
  let fixture: ComponentFixture<ScoreGroupEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpModule,
        SharedModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
          }
        }),
      ],
      declarations: [ ScoreGroupEditorComponent ],
      providers: [
        ErrorHandlerService,
        { provide: Http, useClass: HttpInterceptor },
        { provide: ScoreGroupService, useClass: ScoreGroupServiceStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreGroupEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
