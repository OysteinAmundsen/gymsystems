// FIXME:
// /* tslint:disable:no-unused-variable */
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReplaySubject } from 'rxjs';

// import { AppModuleTest } from 'app/app.module.spec';
// import { DisciplinesModule } from './disciplines.module';
// import { DisciplinesComponent } from './disciplines.component';
// import { TournamentEditorComponent } from '../tournament-editor/tournament-editor.component';

// import { ITournament } from 'app/model';

// class DummyParent {
//   tournamentSubject = new ReplaySubject<ITournament>(1);
//   constructor() {
//   }
// }

// describe('views.configure.tournament:DisciplinesComponent', () => {
//   let component: DisciplinesComponent;
//   let fixture: ComponentFixture<DisciplinesComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         AppModuleTest,
//         DisciplinesModule,
//       ],
//       providers: [
//         { provide: TournamentEditorComponent, useClass: DummyParent },
//       ]
//     })
//       .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(DisciplinesComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should be created', () => {
//     expect(component).toBeTruthy();
//   });
// });
