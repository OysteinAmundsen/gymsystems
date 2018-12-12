// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { ReplaySubject } from 'rxjs';

// import { ScorecardsComponent } from './scorecards.component';
// import { AppModuleTest } from 'app/app.module.spec';
// import { TournamentModule } from '../tournament.module';
// import { TournamentEditorComponent } from '../tournament-editor/tournament-editor.component';
// import { dummyTournament } from 'app/services/api/tournament/tournament.service.stub';
// import { ITournament } from 'app/model';
// import { TeamsService, ScheduleService } from 'app/services/api';
// import { TeamsServiceStub } from 'app/services/api/teams/teams.service.stub';
// import { ScheduleServiceStub } from 'app/services/api/schedule/schedule.service.stub';

// class DummyParent {
//   tournamentSubject = new ReplaySubject<ITournament>(1);
//   constructor() {
//     this.tournamentSubject.next(dummyTournament);
//   }
// }
// describe('ScorecardsComponent', () => {
//   let component: ScorecardsComponent;
//   let fixture: ComponentFixture<ScorecardsComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         AppModuleTest,
//         TournamentModule,
//         RouterTestingModule,
//       ],
//       providers: [
//         { provide: TournamentEditorComponent, useClass: DummyParent },
//         { provide: TeamsService, useClass: TeamsServiceStub },
//         { provide: ScheduleService, useClass: ScheduleServiceStub }
//       ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ScorecardsComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
