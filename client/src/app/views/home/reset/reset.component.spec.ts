import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { GraphService } from "app/shared/services/graph.service";
import { Router } from "@angular/router";
import { ResetComponent } from "./reset.component";
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';

describe("ResetComponent", () => {
  let component: ResetComponent;
  let fixture: ComponentFixture<ResetComponent>;

  beforeEach(() => {
    const graphServiceStub = { post: () => of({}) };

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ResetComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
      ],
      providers: [
        { provide: GraphService, useValue: graphServiceStub }
      ]
    });
    fixture = TestBed.createComponent(ResetComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  describe("reset", () => {
    it("makes expected calls", () => {
      const graphServiceStub = fixture.debugElement.injector.get(GraphService);
      const routerStub = fixture.debugElement.injector.get(Router);
      spyOn(graphServiceStub, "post").and.callFake(() => of(true));
      spyOn(routerStub, "navigate");

      component.ngOnInit();
      spyOn(component.form, "getRawValue").and.callFake(() => ({ username: 'Test', email: 'test@test.no' }));

      component.reset();
      expect(graphServiceStub.post).toHaveBeenCalled();
      expect(routerStub.navigate).toHaveBeenCalled();
    });
  });
});
