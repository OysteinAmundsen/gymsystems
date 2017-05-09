/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app';

import { SharedModule } from 'app/shared/shared.module';
import { ConfigureDisplayComponent } from './configure-display.component';
import { MacroDialogComponent } from './macro-dialog/macro-dialog.component';
import { ConfigurationService } from 'app/services/api';
import { ConfigurationServiceStub } from 'app/services/api/configuration.service.stub';

describe('ConfigureDisplayComponent', () => {
  let component: ConfigureDisplayComponent;
  let fixture: ComponentFixture<ConfigureDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
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
        {provide: ConfigurationService, useClass: ConfigurationServiceStub},
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
