/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppModule } from 'app/app.module';
import { DisciplinesModule } from '../disciplines.module';
import { DisciplineEditorComponent } from './discipline-editor.component';

import { TournamentService, DisciplineService } from 'app/services/api';
import { TournamentServiceStub } from 'app/services/api/tournament/tournament.service.stub';
import { DisciplineServiceStub } from 'app/services/api/discipline/discipline.service.stub';

describe('views.configure.tournament:DisciplineEditorComponent', () => {
  let component: DisciplineEditorComponent;
  let fixture: ComponentFixture<DisciplineEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        DisciplinesModule,
        RouterTestingModule,
      ],
      providers: [
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
