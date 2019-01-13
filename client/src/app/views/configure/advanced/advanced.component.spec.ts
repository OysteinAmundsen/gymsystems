import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Meta } from "@angular/platform-browser";
import { ReactiveFormsModule } from "@angular/forms";
import { ConfigurationService } from "app/shared/services/api";
import { AdvancedComponent } from "./advanced.component";
import { of } from 'rxjs';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';

describe("views.configure:AdvancedComponent", () => {
  let component: AdvancedComponent;
  let fixture: ComponentFixture<AdvancedComponent>;

  beforeEach(() => {
    const titleStub = { setTitle: () => ({}) };
    const metaStub = { updateTag: () => ({}) };
    const configurationServiceStub = {
      all: () => of([
        { name: 'scheduleExecutionTime', value: '5' },
        { name: 'scheduleTrainingTime', value: '3' },
        { name: 'defaultValues', value: '' }
      ]),
      save: () => of({})
    };
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
      ],
      declarations: [AdvancedComponent],
      providers: [
        { provide: Title, useValue: titleStub },
        { provide: Meta, useValue: metaStub },
        { provide: ConfigurationService, useValue: configurationServiceStub }
      ]
    });
    fixture = TestBed.createComponent(AdvancedComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it("isLoading defaults to: false", () => {
    expect(component.isLoading).toEqual(false);
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      const configurationServiceStub: ConfigurationService = fixture.debugElement.injector.get(ConfigurationService);
      spyOn(configurationServiceStub, "all").and.callThrough();
      component.ngOnInit();
      expect(configurationServiceStub.all).toHaveBeenCalled();
    });
  });

  describe("save", () => {
    it("makes expected calls", () => {
      component.ngOnInit();
      const configurationServiceStub: ConfigurationService = fixture.debugElement.injector.get(ConfigurationService);
      spyOn(configurationServiceStub, "save").and.callThrough();
      component.save();
      expect(configurationServiceStub.save).toHaveBeenCalled();
    });
  });
});
