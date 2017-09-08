import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Http } from '@angular/http';
import { HttpInterceptor, ErrorHandlerService } from 'app/services/config';

import { AppModule } from 'app/app.module';
import { SharedModule } from 'app/shared/shared.module';
import { SaveButtonComponent } from './save-button.component';

describe('shared.components:SaveButtonComponent', () => {
  let component: SaveButtonComponent;
  let fixture: ComponentFixture<SaveButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        RouterTestingModule,
        SharedModule
      ],
      providers: [
        { provide: Http, useClass: HttpInterceptor }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
