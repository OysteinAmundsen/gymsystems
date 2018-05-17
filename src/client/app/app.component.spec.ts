import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ServiceWorkerModule } from '@angular/service-worker';

import { TournamentService, UserService } from './services/api';

import { UserServiceStub } from './services/api/user/user.service.stub';
import { TournamentServiceStub } from './services/api/tournament/tournament.service.stub';
import { ErrorHandlerService } from './services/http/ErrorHandler.service';

import { AppComponent } from './app.component';
import { AppModuleTest } from 'app/app.module.spec';
import { environment } from '../environments/environment';

describe('views:AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        AppModuleTest,
        ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production}),
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
