import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from './app.module';

import { TournamentService, UserService } from './services/api';

import { UserServiceStub } from './services/api/user/user.service.stub';
import { TournamentServiceStub } from './services/api/tournament/tournament.service.stub';
import { ErrorHandlerService } from './services/config/ErrorHandler.service';

import { AppComponent } from './app.component';

describe('views:AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        RouterTestingModule
      ],
      providers: [
        {provide: UserService, useClass: UserServiceStub },
        {provide: TournamentService, useClass: TournamentServiceStub },
        ErrorHandlerService,
      ]
    });
    TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', async(() => {
    expect(component).toBeTruthy();
  }));
});
