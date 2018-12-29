import { TestBed } from "@angular/core/testing";
import { OrderByPipe } from "./order-by.pipe";
describe("OrderByPipe", () => {
  let pipe: OrderByPipe;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [OrderByPipe] });
    pipe = TestBed.get(OrderByPipe);
  });
  it("can load instance", () => {
    expect(pipe).toBeTruthy();
  });
  it("orders values ascending", () => {
    const value: any[] = [{ name: "C" }, { name: "A" }];
    const args = 'name';
    expect(pipe.transform(value, args)).toEqual([{ name: "A" }, { name: "C" }]);
  });
  it("orders values descending", () => {
    const value: any[] = [{ name: "A" }, { name: "C" }];
    const args = '~name';
    expect(pipe.transform(value, args)).toEqual([{ name: "C" }, { name: "A" }]);
  });
});
