import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IUser } from 'app/model';
import { UserService } from './user.service';
import { of } from 'rxjs';
import { GraphService } from 'app/shared/services/graph.service';

describe('shared.services.UserService', () => {
  let service: UserService;
  const iUserStub = <IUser>{ id: {} };

  beforeEach(() => {
    const graphServiceStub = { get: () => of({}) };

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        UserService,
        { provide: GraphService, useValue: graphServiceStub }
      ]
    });
    service = TestBed.get(UserService);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
});
