import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app/app.module';
import { DragulaModule } from 'ng2-dragula';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { DivisionsComponent } from './divisions.component';
import { SharedModule } from 'app/shared/shared.module';
import { DivisionEditorComponent } from '../divisions';
import { TournamentService, DivisionService, ConfigurationService } from 'app/services/api';
import { TournamentServiceStub } from 'app/services/api/tournament.service.stub';
import { DivisionServiceStub } from 'app/services/api/division.service.stub';
import { ConfigurationServiceStub } from 'app/services/api/configuration.service.stub';

describe('DivisionsComponent', () => {
  let component: DivisionsComponent;
  let fixture: ComponentFixture<DivisionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        DragulaModule,
        HttpModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
          }
        }),
      ],
      declarations: [
        DivisionsComponent,
        DivisionEditorComponent
      ],
      providers: [
        {provide: TournamentService, useClass: TournamentServiceStub},
        {provide: DivisionService, useClass: DivisionServiceStub},
        {provide: ConfigurationService, useClass: ConfigurationServiceStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
