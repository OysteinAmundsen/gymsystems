import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from "@ngx-translate/core";
import { ErrorHandlerService } from "app/shared/interceptors/error-handler.service";
import { GraphService } from "app/shared/services/graph.service";
import { SEOService } from "app/shared/services/seo.service";
import { RegisterComponent, Type } from "./register.component";
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe("views.home.RegisterComponent", () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(() => {
    const errorHandlerServiceStub = { setError: () => ({}) };
    const graphServiceStub = { saveData: () => of({}) };
    const seoServiceStub = { setTitle: () => ({}) };

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [RegisterComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
      ],
      providers: [
        { provide: ErrorHandlerService, useValue: errorHandlerServiceStub },
        { provide: GraphService, useValue: graphServiceStub },
        { provide: SEOService, useValue: seoServiceStub }
      ]
    });
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it("type defaults to: Type", () => {
    expect(component.type).toEqual(Type);
  });
});
