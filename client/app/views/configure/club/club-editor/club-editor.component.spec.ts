import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from 'app/shared/shared.module';

import { ClubEditorComponent } from './club-editor.component';
import { ClubService, UserService } from "app/services/api";

import { ClubServiceStub } from "app/services/api/club.service.stub";
import { UserServiceStub } from "app/services/api/user.service.stub";

describe('ClubEditorComponent', () => {
  let component: ClubEditorComponent;
  let fixture: ComponentFixture<ClubEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        HttpModule,
        FormsModule,
        RouterTestingModule,
      ],
      declarations: [ ClubEditorComponent ],
      providers: [
        { provide: ClubService, useClass: ClubServiceStub },
        { provide: UserService, useClass: UserServiceStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
