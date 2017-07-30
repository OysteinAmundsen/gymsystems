import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app/app.module';
import { SharedModule } from 'app/shared/shared.module';

import { MembersComponent } from './members.component';
import { MemberEditorComponent } from './member-editor/member-editor.component';
import { ClubEditorComponent } from '../club-editor/club-editor.component';
import { ClubService, UserService } from 'app/services/api';
import { ClubServiceStub } from 'app/services/api/club.service.stub';
import { UserServiceStub } from 'app/services/api/user.service.stub';

describe('MembersComponent', () => {
  let component: MembersComponent;
  let fixture: ComponentFixture<MembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
      ],
      declarations: [ MembersComponent, MemberEditorComponent ],
      providers: [
        ClubEditorComponent,
        { provide: ClubService, useClass: ClubServiceStub },
        { provide: UserService, useClass: UserServiceStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
