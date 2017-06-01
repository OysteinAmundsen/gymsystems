import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MarkdownToHtmlModule } from 'markdown-to-html-pipe';

import { InfoComponent } from './info.component';
import { SharedModule } from 'app/shared/shared.module';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app';
import { ConfigurationService, TournamentService } from 'app/services/api';
import { ConfigurationServiceStub } from 'app/services/api/configuration.service.stub';
import { TournamentServiceStub, dummyTournament } from 'app/services/api/tournament.service.stub';
import { ErrorHandlerService } from 'app/services/config/ErrorHandler.service';
import { HttpInterceptor } from 'app/services/config/HttpInterceptor';
import { TournamentEditorComponent } from '../tournament-editor/tournament-editor.component';
import { ReplaySubject } from 'rxjs/Rx';
import { ITournament } from 'app/services/model/ITournament';

class DummyParent {
  tournamentSubject = new ReplaySubject<ITournament>(1);
  constructor() {
    this.tournamentSubject.next(dummyTournament);
  }
}
describe('InfoComponent', () => {
  let component: InfoComponent;
  let fixture: ComponentFixture<InfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        RouterTestingModule,
        HttpModule,
        MarkdownToHtmlModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
          }
        }),

      ],
      declarations: [ InfoComponent ],
      providers: [
        ErrorHandlerService,
        { provide: Http, useClass: HttpInterceptor },
        { provide: TournamentEditorComponent, useClass: DummyParent },
        { provide: ConfigurationService, useClass: ConfigurationServiceStub },
        { provide: TournamentService, useClass: TournamentServiceStub },
        {
          provide: ActivatedRoute, useValue: {
            parent: {
              params: Observable.of({ id: 1 })
            }
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
