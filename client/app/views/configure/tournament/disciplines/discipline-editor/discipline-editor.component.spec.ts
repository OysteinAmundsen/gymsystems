/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app';

import { SharedModule } from 'app/shared/shared.module';
import { ScoreSystemModule } from '../../score-system/score-system.module';

import { DisciplineEditorComponent } from './discipline-editor.component';

import { TournamentService, DisciplineService } from 'app/services/api';
import { TournamentServiceStub } from 'app/services/api/tournament.service.stub';
import { DisciplineServiceStub } from 'app/services/api/discipline.service.stub';
import { ErrorHandlerService } from 'app/services/config/ErrorHandler.service';
import { HttpInterceptor } from 'app/services/config/HttpInterceptor';

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
        ScoreSystemModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
          }
        }),
      ],
      declarations: [
        DisciplineEditorComponent
      ],
      providers: [
        ErrorHandlerService,
        { provide: Http, useClass: HttpInterceptor },
        { provide: TournamentService, useClass: TournamentServiceStub },
        { provide: DisciplineService, useClass: DisciplineServiceStub },
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
