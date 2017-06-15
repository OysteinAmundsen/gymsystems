/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { Component } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app/app.module';

import { ScoreboardComponent } from './scoreboard.component';
import { ScoreGroupComponent } from '../score-group/score-group.component';
import { ScoreComponent } from '../score/score.component';
import { SharedModule } from 'app/shared/shared.module';
import { ScoreService, UserService } from 'app/services/api';
import { ITeamInDiscipline } from 'app/services/model/ITeamInDiscipline';
import { IDiscipline } from 'app/services/model/IDiscipline';
import { ITeam } from 'app/services/model/ITeam';
import { ITournament } from 'app/services/model/ITournament';
import { IScoreGroup } from 'app/services/model/IScoreGroup';
import { Operation } from 'app/services/model/Operation';

import { UserServiceStub } from 'app/services/api/user.service.stub';
import { ScoreServiceStub } from 'app/services/api/score.service.stub';
import { HttpInterceptor } from 'app/services/config/HttpInterceptor';
import { ErrorHandlerService } from 'app/services/config/ErrorHandler.service';

@Component({
 selector  : 'app-cmp',
 template  : `<app-scoreboard [participant]="item" (onClose)="closeEditor()"></app-scoreboard>`
})
class WrapperComponent {
  item: ITeamInDiscipline = <ITeamInDiscipline>{
    id: 0, startNumber: 0, team: <ITeam>{}, tournament: <ITournament>{}, scores: [], discipline: <IDiscipline>{
      id: 0, name: '', sortOrder: 0, tournament: <ITournament>{}, scoreGroups: [
        <IScoreGroup>{ id: 0, name: '', type: 'C', judges: 2, max: 5, min: 0, discipline: <IDiscipline>{ }, operation: Operation.Addition }
      ]
    },
  }
  constructor() {
  }
}
describe('ScoreboardComponent', () => {
  let component: ScoreboardComponent;
  let fixture: ComponentFixture<WrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
          }
        }),
      ],
      declarations: [
        WrapperComponent,
        ScoreboardComponent,
        ScoreGroupComponent,
        ScoreComponent
      ],
      providers: [
        ErrorHandlerService,
        { provide: Http, useClass: HttpInterceptor },
        { provide: ScoreService, useClass: ScoreServiceStub },
        { provide: UserService, useClass: UserServiceStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperComponent);
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
