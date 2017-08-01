/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
// import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app/app.module';

import { SharedModule } from 'app/shared/shared.module';
import { ConfigureDisplayComponent } from './configure-display.component';
import { MacroDialogComponent } from './macro-dialog/macro-dialog.component';
import { ConfigurationService } from 'app/services/api';
import { ConfigurationServiceStub } from 'app/services/api/configuration/configuration.service.stub';
import { HttpInterceptor, ErrorHandlerService } from 'app/services/config';

describe('ConfigureDisplayComponent', () => {
  let component: ConfigureDisplayComponent;
  let fixture: ComponentFixture<ConfigureDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        FormsModule,
        HttpModule,
        RouterTestingModule,
        ReactiveFormsModule,
        // HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
          }
        }),
      ],
      declarations: [
        ConfigureDisplayComponent,
        MacroDialogComponent
      ],
      providers: [
        ErrorHandlerService,
        { provide: Http, useClass: HttpInterceptor },
        { provide: ConfigurationService, useClass: ConfigurationServiceStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
