import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MultirangeComponent } from "./multirange.component";

describe("shared.components:MultirangeComponent", () => {
  let component: MultirangeComponent;
  let fixture: ComponentFixture<MultirangeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [MultirangeComponent]
    });
    fixture = TestBed.createComponent(MultirangeComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it("min defaults to: 0", () => {
    expect(component.min).toEqual(0);
  });

  it("max defaults to: 100", () => {
    expect(component.max).toEqual(100);
  });

  it('can set value pairs', () => {
    component.value = "10,12";
    expect(component.valueLow).toEqual(10);
    expect(component.valueHigh).toEqual(12);
    expect(component.value).toEqual("10,12");
  });

  it('can determine lowest and highest value even if they are reversed', () => {
    component.value = "12,10";
    expect(component.valueLow).toEqual(10);
    expect(component.valueHigh).toEqual(12);
    expect(component.value).toEqual("10,12");
  });

  it('can properly pad numbers in tooltip', () => {
    component.value = "4,6";
    expect(component.tooltip).toEqual("04 - 06");
  })
});
