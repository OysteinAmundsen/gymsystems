import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppModule } from 'app/app.module';
import { DivisionsModule } from './divisions.module';
import { DivisionsComponent } from './divisions.component';

import { TournamentService, DivisionService, ConfigurationService } from 'app/services/api';

import { TournamentServiceStub } from 'app/services/api/tournament/tournament.service.stub';
import { DivisionServiceStub } from 'app/services/api/division/division.service.stub';
import { ConfigurationServiceStub } from 'app/services/api/configuration/configuration.service.stub';

describe('views.configure.tournament:DivisionsComponent', () => {
  let component: DivisionsComponent;
  let fixture: ComponentFixture<DivisionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        DivisionsModule,
        RouterTestingModule,
      ],
      providers: [
        {provide: TournamentService, useClass: TournamentServiceStub},
        {provide: DivisionService, useClass: DivisionServiceStub},
        {provide: ConfigurationService, useClass: ConfigurationServiceStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
