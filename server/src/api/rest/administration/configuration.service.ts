import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Configuration } from './configuration.model';
import { Repository } from 'typeorm';

@Injectable()
export class ConfigurationService {
  constructor(@InjectRepository(Configuration) private readonly configurationRepository: Repository<Configuration>) { }

  getAll(): Promise<Configuration[]> {
    return this.configurationRepository.find();
  }

  getOneById(id: string): Promise<Configuration> {
    return this.configurationRepository.findOneOrFail({ name: id });
  }

  save(configuration: Configuration): Promise<Configuration> {
    return this.configurationRepository.save(configuration);
  }

  remove(id: string): any {
    return this.configurationRepository.delete({ name: id });
  }
}
