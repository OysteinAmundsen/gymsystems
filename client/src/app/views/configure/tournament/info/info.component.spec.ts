// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { ActivatedRoute } from '@angular/router';
// import { ReplaySubject, of } from 'rxjs';

// import { AppModuleTest } from 'app/app.module.spec';
// import { TournamentModule } from '../tournament.module';
// import { InfoComponent } from './info.component';
// import { TournamentEditorComponent } from '../tournament-editor/tournament-editor.component';

// import { ITournament } from 'app/model';
// import { ConfigurationService } from 'app/shared/services/api';

// import { ConfigurationServiceStub } from 'app/shared/services/api/configuration/configuration.service.stub';

// class DummyParent {
//   tournamentSubject = new ReplaySubject<ITournament>(1);
//   constructor() {  }
// }
// describe('views.configure.tournament:InfoComponent', () => {
//   let component: InfoComponent;
//   let fixture: ComponentFixture<InfoComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         AppModuleTest,
//         TournamentModule,
//         RouterTestingModule,
//       ],
//       providers: [
//         { provide: TournamentEditorComponent, useClass: DummyParent },
//         { provide: ConfigurationService, useClass: ConfigurationServiceStub },
//         {
//           provide: ActivatedRoute, useValue: {
//             parent: {
//               params: of({ id: 1 })
//             }
//           }
//         }
//       ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(InfoComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should be created', () => {
//     expect(component).toBeTruthy();
//   });
// });
