/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppModule } from 'app/app.module';
import { ScoreSystemModule } from '../score-system.module';
import { ScoreGroupEditorComponent } from './score-group-editor.component';

import { ScoreGroupService } from 'app/services/api';
import { ScoreGroupServiceStub } from 'app/services/api/scoregroup/scoregroup.service.stub';
import { ErrorHandlerService } from 'app/services/config';

describe('views.configure.tournament:ScoreGroupEditorComponent', () => {
  let component: ScoreGroupEditorComponent;
  let fixture: ComponentFixture<ScoreGroupEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        ScoreSystemModule,
        RouterTestingModule,
      ],
      providers: [
        ErrorHandlerService,
        { provide: ScoreGroupService, useClass: ScoreGroupServiceStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreGroupEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
