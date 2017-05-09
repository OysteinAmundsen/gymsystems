/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app';

import { SharedModule } from 'app/shared/shared.module';
import { DisciplineEditorComponent } from './discipline-editor.component';
import { ScoreSystemComponent, ScoreGroupEditorComponent } from '../score-system';
import { TournamentService, DisciplineService } from 'app/services/api';
import { TournamentServiceStub } from 'app/services/api/tournament.service.stub';
import { DisciplineServiceStub } from 'app/services/api/discipline.service.stub';

describe('DisciplineEditorComponent', () => {
  let component: DisciplineEditorComponent;
  let fixture: ComponentFixture<DisciplineEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
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
      declarations: [
        DisciplineEditorComponent ,
        ScoreSystemComponent, ScoreGroupEditorComponent,
      ],
      providers: [
        {provide: TournamentService, useClass: TournamentServiceStub},
        {provide: DisciplineService, useClass: DisciplineServiceStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisciplineEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
