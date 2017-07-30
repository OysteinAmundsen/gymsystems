import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'app/app.module';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { SaveButtonComponent } from './save-button.component';
import { FaComponent } from 'app/shared/components/fontawesome/fa.component';
import { FaStackComponent } from 'app/shared/components/fontawesome/fa-stack.component';
import { HttpInterceptor } from 'app/services/config/HttpInterceptor';
import { ErrorHandlerService } from 'app/services/config/ErrorHandler.service';

describe('SaveButtonComponent', () => {
  let component: SaveButtonComponent;
  let fixture: ComponentFixture<SaveButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
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
      declarations: [
        FaComponent,
        FaStackComponent,
        SaveButtonComponent
      ],
      providers: [
        ErrorHandlerService,
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
