import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PubSub } from 'graphql-subscriptions';

import { TroopDto } from './dto/troop.dto';
import { Troop } from './troop.model';
import { Club } from '../club/club.model';
import { Gymnast } from '../gymnast/gymnast.model';
import { Config } from '../../common/config';

@Injectable()
export class TroopService {
  constructor(
    @InjectRepository(Troop) private readonly troopRepository: Repository<Troop>,
    @Inject('PubSubInstance') private readonly pubSub: PubSub) { }

  async save(troop: TroopDto): Promise<Troop> {
    const result = await this.troopRepository.save(<Troop>troop);
    if (result) {
      this.pubSub.publish(troop.id ? 'troopModified' : 'troopCreated', { troop: result });
    }
    return result;
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.troopRepository.delete({ id: id });
    if (result.affected > 0) {
      this.pubSub.publish('troopDeleted', { troopId: id });
    }
    return result.affected > 0;
  }

  findOneById(id: number): Promise<Troop> {
    return this.troopRepository.findOne({ id: id });
  }
  findByClubId(id: number): Promise<Troop[]> {
    return this.troopRepository.find({ where: { clubId: id }, cache: Config.QueryCache });
  }
  findByClub(club: Club): Promise<Troop[]> {
    return this.findByClubId(club.id);
  }
  findByGymnast(gymnast: Gymnast): Promise<Troop[]> {
    return this.troopRepository.find({ where: { gymnasts: [gymnast] }, cache: Config.QueryCache });
  }
  findTroopCountByClub(club: Club): Promise<number> {
    return this.troopRepository.count({ where: { clubId: club.id } });
  }

  async findAll(clubId: number, name?: string): Promise<Troop[]> {
    let troops: Troop[];
    if (name || clubId) {
      const query = this.troopRepository.createQueryBuilder('troop')
        .leftJoinAndSelect('troop.gymnasts', 'gymnasts')
        .where('1=1');
      if (clubId) {
        query.andWhere('troop.clubId = :clubId', { clubId: clubId });
      }
      if (name) {
        query.andWhere(`lower(troop.name) like :name`, { name: `%${name.toLowerCase()}%` });
      }
      troops = await query.getMany();
    } else {
      troops = await this.troopRepository.find({ relations: ['gymnasts'] });
    }
    return troops;
  }
}
