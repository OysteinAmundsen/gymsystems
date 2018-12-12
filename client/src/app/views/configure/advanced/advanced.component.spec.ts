/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppModuleTest } from 'app/app.module.spec';
import { AdvancedModule } from './advanced.module';
import { AdvancedComponent } from './advanced.component';

import { ConfigurationService, TournamentService, DivisionService } from 'app/services/api';
import { ConfigurationServiceStub } from 'app/services/api/configuration/configuration.service.stub';
import { TournamentServiceStub } from 'app/services/api/tournament/tournament.service.stub';
import { DivisionServiceStub } from 'app/services/api/division/division.service.stub';

describe('views.configure:AdvancedComponent', () => {
  let component: AdvancedComponent;
  let fixture: ComponentFixture<AdvancedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModuleTest,
        AdvancedModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: ConfigurationService, useClass: ConfigurationServiceStub },
        { provide: TournamentService, useClass: TournamentServiceStub },
        { provide: DivisionService, useClass: DivisionServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
