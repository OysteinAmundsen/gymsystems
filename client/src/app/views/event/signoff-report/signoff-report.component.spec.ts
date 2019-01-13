/* import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';

import { SharedModule } from 'app/shared/shared.module';
import { EventModule } from '../event.module';
import { EventComponent } from '../event.component';
import { SignoffReportComponent } from './signoff-report.component';

import { ScheduleService, TeamsService, ScoreService, ConfigurationService } from 'app/shared/services/api';

import { DummyParent } from 'app/views/event/list/list.component.spec';
import { ScheduleServiceStub } from 'app/shared/services/api/schedule/schedule.service.stub';
import { TeamsServiceStub } from 'app/shared/services/api/teams/teams.service.stub';
import { ScoreServiceStub } from 'app/shared/services/api/score/score.service.stub';
import { ConfigurationServiceStub } from 'app/shared/services/api/configuration/configuration.service.stub';

describe('SignoffReportComponent', () => {
  let component: SignoffReportComponent;
  let fixture: ComponentFixture<SignoffReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        EventModule,
        RouterTestingModule,
      ],
      providers: [
        {provide: EventComponent, useClass: DummyParent},
        {provide: ScheduleService, useClass: ScheduleServiceStub},
        {provide: ConfigurationService, useClass: ConfigurationServiceStub},
        {provide: TournamentService, useClass: TournamentServiceStub},
        {provide: TeamsService, useClass: TeamsServiceStub},
        {provide: ScoreService, useClass: ScoreServiceStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignoffReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
 */
