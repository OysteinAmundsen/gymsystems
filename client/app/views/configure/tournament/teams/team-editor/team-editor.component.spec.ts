/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app';

import { TeamEditorComponent } from './team-editor.component';
import { TeamsService, TournamentService, ClubService, UserService, DivisionService, DisciplineService } from 'app/services/api';
import { SharedModule } from 'app/shared/shared.module';
import { ITeam } from "app/services/model/ITeam";
import { ITournament } from "app/services/model/ITournament";
import { IClub } from "app/services/model/IClub";
import { IUser, Role } from "app/services/model/IUser";
import { Observable } from "rxjs/Observable";

describe('TeamEditorComponent', () => {
  let component: TeamEditorComponent;
  let fixture: ComponentFixture<TestCmpWrapper>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        SharedModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
          }
        }),
      ],
      declarations: [ TestCmpWrapper, TeamEditorComponent ],
      providers: [
        TeamsService,
        TournamentService,
        ClubService,
        UserService,
        DivisionService,
        DisciplineService
      ]
    })
    .overrideComponent(TeamEditorComponent, {
      set: {
        providers: [
          { provide: UserService, useClass: class DataStub {
              public getMe(): Observable<IUser> {
                return Observable.of(user);
              }
            }
          },
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCmpWrapper);
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

const club: IClub = <IClub>{
  id          : 0,
  name        : 'HAUGESUND TURNFORENING'
}
const user: IUser = <IUser>{
  id    : 0,
  name  : 'admin',
  email : 'admin@admin.no',
  role  : Role.Admin,
  club  : club
};

@Component({
 selector  : 'test-cmp',
 template  : '<app-team-editor [team]="selected" (teamChanged)="onChange($event)"></app-team-editor>'
})
class TestCmpWrapper {

    selected: ITeam = {
      id          : 0,
      name        : 'Haugesund-1',
      divisions   : [],
      disciplines : [],
      tournament  : <ITournament>{
        id          : 0,
        createdBy   : user,
        name        : 'Landsturnstevnet 2017',
        description : 'Test text',
        location    : 'Haugesund',
        schedule    : [],
        disciplines : [],
        divisions   : []
      },
      club        : club
    }
}
