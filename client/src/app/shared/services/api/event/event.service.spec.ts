import { TestBed } from '@angular/core/testing';
import { HttpCacheService } from '../../../interceptors/http-cache.service';
import { EventService } from './event.service';

describe('services.api:EventService', () => {
  let service: EventService;
  beforeEach(() => {
    const httpCacheServiceStub = { invalidateAll: () => ({}) };
    TestBed.configureTestingModule({
      providers: [
        EventService,
        { provide: HttpCacheService, useValue: httpCacheServiceStub }
      ]
    });
    service = TestBed.get(EventService);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  it('url defaults to: /api/sse', () => {
    expect(service.url).toEqual('/api/sse');
  });
  it('reconnectCount defaults to: 0', () => {
    expect(service.reconnectCount).toEqual(0);
  });
});
