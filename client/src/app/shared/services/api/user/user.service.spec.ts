import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { IUser } from 'app/model';
import { UserService } from './user.service';
import { of } from 'rxjs';
import { GraphService } from 'app/shared/services/graph.service';

describe('shared.services.api:UserService', () => {
  let service: UserService;
  const iUserStub = <IUser>{ id: {} };

  beforeEach(() => {
    const httpClientStub = {
      get: () => of({}),
      put: () => of({}),
      post: () => of({}),
      delete: () => of({})
    };
    const graphServiceStub = { get: () => of({}) };

    const httpResponseStub = {
      body: {},
      headers: { has: () => ({}), get: () => ({}) }
    };
    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: HttpClient, useValue: httpClientStub },
        { provide: HttpResponse, useValue: httpResponseStub },
        { provide: GraphService, useValue: graphServiceStub }
      ]
    });
    service = TestBed.get(UserService);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
});
