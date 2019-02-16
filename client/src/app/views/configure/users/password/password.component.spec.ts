import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { GraphService } from "app/shared/services/graph.service";
import { MatDialogRef, MatFormFieldModule, MatInputModule } from "@angular/material";
import { PasswordComponent } from "./password.component";
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { HelpBlockComponent } from 'app/shared/components';
import { of } from 'rxjs';

describe("PasswordComponent", () => {
  let component: PasswordComponent;
  let fixture: ComponentFixture<PasswordComponent>;

  beforeEach(() => {
    const graphServiceStub = { post: () => of({}) };
    const matDialogRefStub = { close: () => ({}) };

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
      ],
      declarations: [PasswordComponent, HelpBlockComponent],
      providers: [
        { provide: GraphService, useValue: graphServiceStub },
        { provide: MatDialogRef, useValue: matDialogRefStub }
      ]
    });
    fixture = TestBed.createComponent(PasswordComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      const formBuilderStub: FormBuilder = fixture.debugElement.injector.get(FormBuilder);
      spyOn(formBuilderStub, "group");
      component.ngOnInit();
      expect(formBuilderStub.group).toHaveBeenCalled();
    });
  });

  describe("save", () => {
    it("makes expected calls", () => {
      const graphServiceStub: GraphService = fixture.debugElement.injector.get(GraphService);
      spyOn(component, "close");
      spyOn(graphServiceStub, "post").and.callThrough();
      component.ngOnInit(); // To initialize the form
      component.save();
      expect(component.close).toHaveBeenCalled();
      expect(graphServiceStub.post).toHaveBeenCalled();
    });
  });
});
