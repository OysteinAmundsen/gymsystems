import { Test, TestingModule } from '@nestjs/testing';
import { DivisionService } from './division.service';
import { Repository } from 'typeorm';
import { Division } from './division.model';
import { PubSub } from 'graphql-subscriptions';

export class DivisionRepository extends Repository<Division> { }

describe('DivisionService', () => {
  let service: DivisionService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DivisionService,
        { provide: 'DivisionRepository', useClass: DivisionRepository },
        { provide: 'PubSubInstance', useValue: new PubSub() }
      ],
    }).compile();
    service = module.get<DivisionService>(DivisionService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
