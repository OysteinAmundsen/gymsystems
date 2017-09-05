/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppModule } from 'app/app.module';
import { DisciplinesModule } from './disciplines.module';
import { DisciplinesComponent } from './disciplines.component';

import { TournamentService, DisciplineService, ScoreGroupService, ConfigurationService } from 'app/services/api';

import { TournamentServiceStub } from 'app/services/api/tournament/tournament.service.stub';
import { DisciplineServiceStub } from 'app/services/api/discipline/discipline.service.stub';
import { ScoreGroupServiceStub } from 'app/services/api/scoregroup/scoregroup.service.stub';
import { ConfigurationServiceStub } from 'app/services/api/configuration/configuration.service.stub';

describe('views.configure.tournament:DisciplinesComponent', () => {
  let component: DisciplinesComponent;
  let fixture: ComponentFixture<DisciplinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        DisciplinesModule,
        RouterTestingModule,
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
