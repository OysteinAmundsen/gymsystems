import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { DisplayService } from './display.service';

describe('shared.services.api:DisplayService', () => {
  let service: DisplayService;

  beforeEach(() => {
    const httpClientStub = { get: () => ({}) };
    TestBed.configureTestingModule({
      providers: [
        DisplayService,
        { provide: HttpClient, useValue: httpClientStub }
      ]
    });
    service = TestBed.get(DisplayService);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('makes expected calls', () => {
      const httpClientStub: HttpClient = TestBed.get(HttpClient);
      spyOn(httpClientStub, 'get');
      service.getAll(1);
      expect(httpClientStub.get).toHaveBeenCalled();

      service.getAll(1, 2);
      expect(httpClientStub.get).toHaveBeenCalledWith('/api/display/1', { params: { current: 2 } })
    });
  });

  describe('getDisplay', () => {
    it('makes expected calls', () => {
      const httpClientStub: HttpClient = TestBed.get(HttpClient);
      spyOn(httpClientStub, 'get');
      service.getDisplay(1, 2);
      expect(httpClientStub.get).toHaveBeenCalledWith('/api/display/1/2', { responseType: 'text' })
    });
  });

});
