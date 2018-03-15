import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppModuleTest } from 'app/app.module.spec';
import { ConfigureSharedModule } from '../_shared.module';
import { MemberSelectorComponent } from './member-selector.component';

import { ClubService } from 'app/services/api';
import { ClubServiceStub } from 'app/services/api/club/club.service.stub';

describe('MemberSelectorComponent', () => {
  let component: MemberSelectorComponent;
  let fixture: ComponentFixture<MemberSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModuleTest,
        ConfigureSharedModule,
        RouterTestingModule
      ],
      providers: [
        {provide: ClubService, useClass: ClubServiceStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
