import { Test, TestingModule } from '@nestjs/testing';
import { ConfigurationService } from './configuration.service';
import { Repository } from 'typeorm';
import { Configuration } from './configuration.model';

export class ConfigurationRepository extends Repository<Configuration> { }

describe('ConfigurationService', () => {
  let service: ConfigurationService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigurationService,
        { provide: 'ConfigurationRepository', useClass: ConfigurationRepository },
      ],
    }).compile();
    service = module.get<ConfigurationService>(ConfigurationService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
