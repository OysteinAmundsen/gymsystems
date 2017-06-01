import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app';

import { DivisionEditorComponent } from './division-editor.component';
import { SharedModule } from 'app/shared/shared.module';
import { DivisionService } from 'app/services/api';
import { DivisionServiceStub } from 'app/services/api/division.service.stub';
import { ErrorHandlerService } from "app/services/config/ErrorHandler.service";
import { HttpInterceptor } from "app/services/config/HttpInterceptor";

describe('DivisionEditorComponent', () => {
  let component: DivisionEditorComponent;
  let fixture: ComponentFixture<DivisionEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        SharedModule,
        HttpModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
          }
        }),
      ],
      declarations: [ DivisionEditorComponent ],
      providers: [
        ErrorHandlerService,
        { provide: Http, useClass: HttpInterceptor },
        { provide: DivisionService, useClass: DivisionServiceStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
