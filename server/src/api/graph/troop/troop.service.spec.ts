import { Test, TestingModule } from '@nestjs/testing';
import { TroopService } from './troop.service';
import { Repository } from 'typeorm';
import { Troop } from './troop.model';
import { PubSub } from 'graphql-subscriptions';

export class TroopRepository extends Repository<Troop> { }

describe('TroopService', () => {
  let service: TroopService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TroopService,
        { provide: 'TroopRepository', useClass: TroopRepository },
        { provide: 'PubSubInstance', useValue: new PubSub()}
      ],
    }).compile();
    service = module.get<TroopService>(TroopService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
