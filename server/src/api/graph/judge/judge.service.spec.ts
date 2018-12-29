import { Test, TestingModule } from '@nestjs/testing';
import { JudgeService } from './judge.service';
import { Repository } from 'typeorm';
import { Judge } from './judge.model';
import { PubSub } from 'graphql-subscriptions';

export class JudgeRepository extends Repository<Judge> { }

describe('JudgeService', () => {
  let service: JudgeService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JudgeService,
        { provide: 'JudgeRepository', useClass: JudgeRepository },
        { provide: 'PubSubInstance', useValue: new PubSub() }
      ],
    }).compile();
    service = module.get<JudgeService>(JudgeService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
