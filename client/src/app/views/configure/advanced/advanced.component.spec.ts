/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppModuleTest } from 'app/app.module.spec';
import { AdvancedModule } from './advanced.module';
import { AdvancedComponent } from './advanced.component';

import { ConfigurationService } from 'app/services/api';
import { ConfigurationServiceStub } from 'app/services/api/configuration/configuration.service.stub';

describe('views.configure:AdvancedComponent', () => {
  let component: AdvancedComponent;
  let fixture: ComponentFixture<AdvancedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModuleTest,
        AdvancedModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: ConfigurationService, useClass: ConfigurationServiceStub },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
