import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppModule } from 'app/app.module';
import { TournamentModule } from './tournament.module';
import { TournamentComponent } from './tournament.component';

import { TournamentService, UserService } from 'app/services/api';
import { TournamentServiceStub } from 'app/services/api/tournament/tournament.service.stub';
import { UserServiceStub } from 'app/services/api/user/user.service.stub';

describe('views.configure.tournament:TournamentComponent', () => {
  let component: TournamentComponent;
  let fixture: ComponentFixture<TournamentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        TournamentModule,
        RouterTestingModule,
      ],
      providers: [
        {provide: TournamentService, useClass: TournamentServiceStub},
        {provide: UserService, useClass: UserServiceStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
