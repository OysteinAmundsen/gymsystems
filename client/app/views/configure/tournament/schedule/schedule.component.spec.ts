import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app';
import { DragulaModule } from 'ng2-dragula';
import { ReplaySubject } from 'rxjs/Rx';

import { ScheduleComponent } from './schedule.component';
import { SharedModule } from 'app/shared/shared.module';
import { ScheduleService, DivisionService, DisciplineService, TeamsService, ConfigurationService } from 'app/services/api';

import { dummyTournament } from 'app/services/api/tournament.service.stub';
import { DivisionServiceStub } from 'app/services/api/division.service.stub';
import { DisciplineServiceStub } from 'app/services/api/discipline.service.stub';
import { TeamsServiceStub } from 'app/services/api/teams.service.stub';
import { ScheduleServiceStub } from 'app/services/api/schedule.service.stub';
import { ConfigurationServiceStub } from 'app/services/api/configuration.service.stub';
import { ErrorHandlerService } from 'app/services/config/ErrorHandler.service';
import { HttpInterceptor } from 'app/services/config/HttpInterceptor';
import { TournamentEditorComponent } from '../tournament-editor/tournament-editor.component';
import { ITournament } from 'app/services/model/ITournament';

class DummyParent {
  tournamentSubject = new ReplaySubject<ITournament>(1);
  constructor() {
    this.tournamentSubject.next(dummyTournament);
  }
}
describe('ScheduleComponent', () => {
  let component: ScheduleComponent;
  let fixture: ComponentFixture<ScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        DragulaModule,
        HttpModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
          }
        }),
      ],
      declarations: [ ScheduleComponent ],
      providers: [
        ErrorHandlerService,
        { provide: Http, useClass: HttpInterceptor },
        { provide: TournamentEditorComponent, useClass: DummyParent },
        { provide: DivisionService, useClass: DivisionServiceStub },
        { provide: DisciplineService, useClass: DisciplineServiceStub },
        { provide: TeamsService, useClass: TeamsServiceStub },
        { provide: ScheduleService, useClass: ScheduleServiceStub },
        { provide: ConfigurationService, useClass: ConfigurationServiceStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
