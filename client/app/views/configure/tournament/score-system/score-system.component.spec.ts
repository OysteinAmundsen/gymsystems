/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppModule } from 'app/app.module';
import { ScoreSystemModule } from './score-system.module';
import { ScoreSystemComponent } from './score-system.component';

import { ScoreGroupService, ConfigurationService } from 'app/services/api';
import { ScoreGroupServiceStub } from 'app/services/api/scoregroup/scoregroup.service.stub';
import { ConfigurationServiceStub } from 'app/services/api/configuration/configuration.service.stub';

describe('views.configure.tournament:ScoreSystemComponent', () => {
  let component: ScoreSystemComponent;
  let fixture: ComponentFixture<ScoreSystemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        ScoreSystemModule,
        RouterTestingModule,
      ],
      providers: [
        {provide: ScoreGroupService, useClass: ScoreGroupServiceStub},
        {provide: ConfigurationService, useClass: ConfigurationServiceStub},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
