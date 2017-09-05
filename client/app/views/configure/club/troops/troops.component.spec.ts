import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app/app.module';
import { SharedModule } from 'app/shared/shared.module';

import { TroopsComponent } from './troops.component';
import { UserService, ClubService, ConfigurationService } from 'app/services/api';
import { UserServiceStub } from 'app/services/api/user/user.service.stub';
import { TroopEditorComponent } from './troop-editor/troop-editor.component';
import { DragulaModule } from 'ng2-dragula';
import { ClubServiceStub } from 'app/services/api/club/club.service.stub';
import { ClubEditorComponent } from 'app/views/configure/club/club-editor/club-editor.component';
import { MemberSelectorComponent } from '../../_shared/member-selector/member-selector.component';
import { ConfigurationServiceStub } from 'app/services/api/configuration/configuration.service.stub';

describe('views.configure.club:TroopsComponent', () => {
  let component: TroopsComponent;
  let fixture: ComponentFixture<TroopsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientModule,
        DragulaModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
      ],
      declarations: [
        TroopsComponent,
        TroopEditorComponent,
        MemberSelectorComponent
      ],
      providers: [
        ClubEditorComponent,
        { provide: ConfigurationService, useClass: ConfigurationServiceStub },
        { provide: UserService, useClass: UserServiceStub },
        { provide: ClubService, useClass: ClubServiceStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TroopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
