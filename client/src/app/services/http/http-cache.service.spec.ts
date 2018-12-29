import { TestBed } from "@angular/core/testing";
import { HttpCacheService } from "./http-cache.service";

describe("HttpCacheService", () => {
  let service: HttpCacheService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [HttpCacheService] });
    service = TestBed.get(HttpCacheService);
  });
  it("can load instance", () => {
    expect(service).toBeTruthy();
  });
});
