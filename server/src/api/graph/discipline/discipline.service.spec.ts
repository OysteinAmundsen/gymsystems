import { Test, TestingModule } from '@nestjs/testing';
import { DisciplineService } from './discipline.service';
import { Repository } from 'typeorm';
import { Discipline } from './discipline.model';
import { PubSub } from 'graphql-subscriptions';

export class DisciplineRepository extends Repository<Discipline> { }

describe('DisciplineService', () => {
  let service: DisciplineService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DisciplineService,
        { provide: 'DisciplineRepository', useClass: DisciplineRepository },
        { provide: 'PubSubInstance', useValue: new PubSub() }
      ],
    }).compile();
    service = module.get<DisciplineService>(DisciplineService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
