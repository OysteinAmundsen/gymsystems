import { Test, TestingModule } from '@nestjs/testing';
import { GymnastService } from './gymnast.service';
import { Repository } from 'typeorm';
import { Gymnast } from './gymnast.model';
import { PubSub } from 'graphql-subscriptions';

export class GymnastRepository extends Repository<Gymnast> { }

describe('GymnastService', () => {
  let service: GymnastService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GymnastService,
        { provide: 'GymnastRepository', useClass: GymnastRepository },
        { provide: 'PubSubInstance', useValue: new PubSub() }
      ],
    }).compile();
    service = module.get<GymnastService>(GymnastService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
