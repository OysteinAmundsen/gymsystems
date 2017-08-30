import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app/app.module';
import { DragulaModule } from 'ng2-dragula';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { DivisionsComponent } from './divisions.component';
import { SharedModule } from 'app/shared/shared.module';
import { DivisionEditorComponent } from '../divisions';
import { TournamentService, DivisionService, ConfigurationService } from 'app/services/api';
import { TournamentServiceStub } from 'app/services/api/tournament/tournament.service.stub';
import { DivisionServiceStub } from 'app/services/api/division/division.service.stub';
import { ConfigurationServiceStub } from 'app/services/api/configuration/configuration.service.stub';

describe('views.configure.tournament:DivisionsComponent', () => {
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
