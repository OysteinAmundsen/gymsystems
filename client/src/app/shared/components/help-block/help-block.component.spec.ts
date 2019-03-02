import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { HelpBlockComponent } from "./help-block.component";

describe("shared.components:HelpBlockComponent", () => {
  let component: HelpBlockComponent;
  let fixture: ComponentFixture<HelpBlockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [HelpBlockComponent]
    });
    fixture = TestBed.createComponent(HelpBlockComponent);
    component = fixture.componentInstance;
  });
  it("can load instance", () => {
    expect(component).toBeTruthy();
  });
});
