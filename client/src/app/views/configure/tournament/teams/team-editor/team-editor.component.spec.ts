// FIXME:
// /* tslint:disable:no-unused-variable */
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { Component } from '@angular/core';

// import { RouterTestingModule } from '@angular/router/testing';
// import { ReplaySubject } from 'rxjs';

// import { AppModuleTest } from 'app/app.module.spec';
// import { TournamentModule } from '../../tournament.module';
// import { TeamsComponent } from '../teams.component';
// import { TeamEditorComponent } from './team-editor.component';
// import { TournamentEditorComponent } from '../../tournament-editor/tournament-editor.component';

// import { ErrorHandlerService } from 'app/shared/services/http/ErrorHandler.service';
// import { ITeam, ITournament, IClub, IUser, Role, Classes } from 'app/model';
// import { UserService, ConfigurationService } from 'app/shared/services/api';
// import { MediaService } from 'app/shared/services/media.service';

// import { UserServiceStub } from 'app/shared/services/api/user/user.service.stub';
// import { ConfigurationServiceStub } from 'app/shared/services/api/configuration/configuration.service.stub';

// const club: IClub = <IClub>{
//   id: 0,
//   name: 'HAUGESUND TURNFORENING'
// };
// const user: IUser = <IUser>{
//   id: 0,
//   name: 'admin',
//   email: 'admin@admin.no',
//   role: Role.Admin,
//   club: club
// };
// class DummyParent {
//   tournamentSubject = new ReplaySubject<ITournament>(1);
//   constructor() { }
// }
// @Component({
//   selector: 'app-cmp',
//   template: `<app-team-editor [team]='selected'></app-team-editor>`
// })
// class WrapperComponent {
//   selected: ITeam = <ITeam>{
//     id: 0, class: Classes.TeamGym, name: 'Haugesund-1', divisions: [], disciplines: [], gymnasts: [], club: club, tournament: <ITournament>{
//       id: 0, createdBy: user, club: user.club, name: 'Landsturnstevnet 2017', description_no: 'Test tekst', description_en: 'Test text',
//       schedule: [], disciplines: [], divisions: []
//     },
//   };
// }
// describe('views.configure.tournament:TeamEditorComponent', () => {
//   let component: TeamEditorComponent;
//   let fixture: ComponentFixture<WrapperComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         AppModuleTest,
//         TournamentModule,
//         RouterTestingModule,
//       ],
//       declarations: [
//         WrapperComponent
//       ],
//       providers: [
//         MediaService,
//         ErrorHandlerService,
//         TeamsComponent,
//         { provide: TournamentEditorComponent, useClass: DummyParent },
//         { provide: ConfigurationService, useClass: ConfigurationServiceStub },
//         { provide: UserService, useClass: UserServiceStub },
//       ]
//     })
//       .overrideModule(TournamentModule, {
//         set: {
//           exports: [
//             TeamEditorComponent
//           ]
//         }
//       })
//       .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(WrapperComponent);
//     component = fixture.debugElement.children[0].componentInstance;
//     fixture.detectChanges();
//   });

//   it('should be created', () => {
//     expect(component).toBeTruthy();
//   });
// });
