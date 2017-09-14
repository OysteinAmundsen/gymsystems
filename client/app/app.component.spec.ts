import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { TournamentService, UserService } from './services/api';

import { UserServiceStub } from './services/api/user/user.service.stub';
import { TournamentServiceStub } from './services/api/tournament/tournament.service.stub';
import { ErrorHandlerService } from './services/config/ErrorHandler.service';

import { AppComponent } from './app.component';
import { AppModuleTest } from 'app/app.module.spec';

describe('views:AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        AppModuleTest
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
