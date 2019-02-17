import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';
import { IConfiguration } from 'app/model';

describe('shared.services.api:ConfigurationService', () => {
  let service: ConfigurationService;
  const iConfigurationStub = <IConfiguration>{ name: {} };

  beforeEach(() => {
    const httpClientStub = {
      get: () => ({}),
      post: () => ({}),
      delete: () => ({})
    };
    TestBed.configureTestingModule({
      providers: [
        ConfigurationService,
        { provide: HttpClient, useValue: httpClientStub }
      ]
    });
    service = TestBed.get(ConfigurationService);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  it('url defaults to: /api/administration/configuration', () => {
    expect(service.url).toEqual('/api/administration/configuration');
  });

  describe('delete', () => {
    it('makes expected calls', () => {
      const httpClientStub: HttpClient = TestBed.get(HttpClient);
      spyOn(httpClientStub, 'delete');
      service.delete(iConfigurationStub);
      expect(httpClientStub.delete).toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('makes expected calls', () => {
      const httpClientStub: HttpClient = TestBed.get(HttpClient);
      spyOn(httpClientStub, 'post');
      service.save(iConfigurationStub);
      expect(httpClientStub.post).toHaveBeenCalled();
    });
  });

  describe('all', () => {
    it('makes expected calls', () => {
      const httpClientStub: HttpClient = TestBed.get(HttpClient);
      spyOn(httpClientStub, 'get');
      service.all();
      expect(httpClientStub.get).toHaveBeenCalled();
    });
  });

  describe('getByName', () => {
    it('makes expected calls', () => {
      const httpClientStub: HttpClient = TestBed.get(HttpClient);
      spyOn(httpClientStub, 'get');
      service.getByname('');
      expect(httpClientStub.get).toHaveBeenCalled();
    });
  });
});
