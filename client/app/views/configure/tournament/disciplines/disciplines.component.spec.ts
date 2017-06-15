/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DragulaModule } from 'ng2-dragula';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app/app.module';

import { SharedModule } from 'app/shared/shared.module';
import { ScoreSystemModule } from '../score-system/score-system.module';

import { DisciplinesComponent } from './disciplines.component';
import { DisciplineEditorComponent } from './discipline-editor/discipline-editor.component';

import { TournamentService, DisciplineService, ScoreGroupService, ConfigurationService } from 'app/services/api';
import { TournamentServiceStub } from 'app/services/api/tournament.service.stub';
import { DisciplineServiceStub } from 'app/services/api/discipline.service.stub';
import { ScoreGroupServiceStub } from 'app/services/api/scoregroup.service.stub';
import { ConfigurationServiceStub } from 'app/services/api/configuration.service.stub';

describe('ConfigureDisciplinesComponent', () => {
  let component: DisciplinesComponent;
  let fixture: ComponentFixture<DisciplinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        RouterTestingModule,
        DragulaModule,
        ScoreSystemModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
          }
        }),
      ],
      declarations: [
        DisciplinesComponent,
        DisciplineEditorComponent
      ],
      providers: [
        {provide: TournamentService, useClass: TournamentServiceStub},
        {provide: DisciplineService, useClass: DisciplineServiceStub},
        {provide: ScoreGroupService, useClass: ScoreGroupServiceStub},
        {provide: ConfigurationService, useClass: ConfigurationServiceStub},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisciplinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
