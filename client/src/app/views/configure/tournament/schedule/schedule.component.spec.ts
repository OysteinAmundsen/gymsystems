// FIXME:
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { ReplaySubject, of } from 'rxjs';

// import { AppModuleTest } from 'app/app.module.spec';
// import { TournamentModule } from '../tournament.module';
// import { ScheduleComponent } from './schedule.component';
// import { TournamentEditorComponent } from '../tournament-editor/tournament-editor.component';

// import { ITournament } from 'app/model/ITournament';
// import { ScheduleService, ConfigurationService } from 'app/shared/services/api';

// import { ConfigurationServiceStub } from 'app/shared/services/api/configuration/configuration.service.stub';
// import { ErrorHandlerService } from 'app/shared/services/http/ErrorHandler.service';
// import { IUser } from 'app/model';
// import { dummyAdmin } from 'app/shared/services/api/user/user.service.stub';
// import { GraphService } from 'app/shared/services/graph.service';
// import { GraphServiceApi } from 'app/shared/services/graph.service.api';


// class MockGraph implements GraphServiceApi {
//   getData(queryStr: string) { return of(); }
//   deleteData(type: string, id: number) { return of(); }
//   saveData(type: string, data: any, returnVal: string) { return of(); }
//   post(query: string) { return of(); }
//   delete(query: string) { return of(); }
// }


// class DummyParent {
//   tournamentSubject = new ReplaySubject<ITournament>(1);
//   user: IUser = dummyAdmin;
//   constructor() {
//   }
// }
// describe('views.configure.tournament:ScheduleComponent', () => {
//   let component: ScheduleComponent;
//   let fixture: ComponentFixture<ScheduleComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         AppModuleTest,
//         TournamentModule,
//         RouterTestingModule,
//       ],
//       providers: [
//         ErrorHandlerService,
//         { provide: TournamentEditorComponent, useClass: DummyParent },
//         { provide: GraphService, useClass: MockGraph },
//         ScheduleService,
//         { provide: ConfigurationService, useClass: ConfigurationServiceStub },
//       ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ScheduleComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should be created', () => {
//     expect(component).toBeTruthy();
//   });
// });
