import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app';

import { SharedModule } from 'app/shared/shared.module';
import { UserEditorComponent } from './user-editor.component';
import { UserService, ClubService } from 'app/services/api';
import { Observable } from "rxjs/Observable";
import { IUser, Role } from "app/services/model/IUser";
import { IClub } from "app/services/model/IClub";

describe('UserEditorComponent', () => {
  let component: UserEditorComponent;
  let fixture: ComponentFixture<UserEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        HttpModule,
        FormsModule,
        RouterTestingModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
          }
        }),
      ],
      declarations: [ UserEditorComponent ],
      providers: [
        UserService,
        ClubService
      ]
    })
    .overrideComponent(UserEditorComponent, {
      set: {
        providers: [
          { provide: UserService, useClass: class DataStub {
              getMe(): Observable<IUser> {
                return Observable.of(user);
              }
              getById(id: number): Observable<IUser> {
                return Observable.of(user);
              }
            }
          },
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

const club: IClub = <IClub>{
  id          : 0,
  name        : 'HAUGESUND TURNFORENING'
}
const user: IUser = <IUser>{
  id    : 0,
  name  : 'admin',
  email : 'admin@admin.no',
  role  : Role.Admin,
  club  : club
};
