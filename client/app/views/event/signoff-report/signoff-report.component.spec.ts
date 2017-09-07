/* import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';

import { AppModule } from 'app/app.module';
import { EventModule } from '../event.module';
import { EventComponent } from '../event.component';
import { SignoffReportComponent } from './signoff-report.component';

import { ScheduleService, TeamsService, ScoreService, ConfigurationService } from 'app/services/api';

import { DummyParent } from 'app/views/event/list/list.component.spec';
import { ScheduleServiceStub } from 'app/services/api/schedule/schedule.service.stub';
import { TeamsServiceStub } from 'app/services/api/teams/teams.service.stub';
import { ScoreServiceStub } from 'app/services/api/score/score.service.stub';
import { ConfigurationServiceStub } from 'app/services/api/configuration/configuration.service.stub';

describe('SignoffReportComponent', () => {
  let component: SignoffReportComponent;
  let fixture: ComponentFixture<SignoffReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        EventModule,
        RouterTestingModule,
      ],
      providers: [
        {provide: EventComponent, useClass: DummyParent},
        {provide: ScheduleService, useClass: ScheduleServiceStub},
        {provide: ConfigurationService, useClass: ConfigurationServiceStub},
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
