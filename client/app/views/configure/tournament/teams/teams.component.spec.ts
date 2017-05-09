/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app';

import { TeamsComponent } from './teams.component';
import { TeamEditorComponent } from './team-editor/team-editor.component';
import { SharedModule } from 'app/shared/shared.module';
import { TournamentService, UserService, TeamsService } from 'app/services/api';
import { IClub } from 'app/services/model/IClub';
import { IUser, Role } from 'app/services/model/IUser';
import { Observable } from "rxjs/Observable";

describe('TeamsComponent', () => {
  let component: TeamsComponent;
  let fixture: ComponentFixture<TeamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        SharedModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
          }
        }),
      ],
      declarations: [
        TeamsComponent,
        TeamEditorComponent
      ],
      providers: [
        TeamsService,
        UserService,
        TournamentService
      ]
    })
    .overrideComponent(TeamsComponent, {
      set: {
        providers: [
          { provide: UserService, useClass: class DataStub {
              public getMe(): Observable<IUser> {
                return Observable.of(<IUser>{
                  id: 0, name: '', email: '', role: Role.Admin, club: <IClub>{ id: 0, name: '' }
                });
              }
            }
          },
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
