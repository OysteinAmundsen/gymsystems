import { Test, TestingModule } from '@nestjs/testing';
import { AdministrationController } from './administration.controller';
import { ExportService } from './export.service';
import { ConfigurationService } from './configuration.service';
import { Repository } from 'typeorm';
import { Configuration } from './configuration.model';

export class ConfigurationRepository extends Repository<Configuration> { }

describe('Administration Controller', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [AdministrationController],
      providers: [
        ExportService,
        ConfigurationService,
        { provide: 'ConfigurationRepository', useClass: ConfigurationRepository },
      ]
    }).compile();
  });
  it('should be defined', () => {
    const controller: AdministrationController = module.get<AdministrationController>(AdministrationController);
    expect(controller).toBeDefined();
  });
});
