import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PubSub } from 'graphql-subscriptions';

import { TroopDto } from './dto/troop.dto';
import { Troop } from './troop.model';
import { Club } from '../club/club.model';
import { Gymnast } from '../gymnast/gymnast.model';
import { Config } from '../../common/config';
import { Division } from '../division/division.model';
import moment = require('moment');
import { plainToClass } from 'class-transformer';

@Injectable()
export class TroopService {
  localCache: { [id: string]: Troop[] } = {};
  localCachePromise: { [id: string]: Promise<Troop[]> } = {};
  cacheCreation: moment.Moment;

  constructor(
    @InjectRepository(Troop) private readonly troopRepository: Repository<Troop>,
    @Inject('PubSubInstance') private readonly pubSub: PubSub) { }

  async save(troop: TroopDto): Promise<Troop> {
    if (troop.id) {
      const entity = await this.troopRepository.findOne({ id: troop.id });
      troop = Object.assign(entity, troop);
    }
    const result = await this.troopRepository.save(plainToClass(Troop, troop));
    this.invalidateCache();
    if (result) {
      this.pubSub.publish(troop.id ? 'troopModified' : 'troopCreated', { troop: result });
    }
    delete result.club;
    delete result.divisions;
    delete result.gymnasts;

    return result;
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.troopRepository.delete({ id: id });
    this.invalidateCache();
    if (result.raw.affectedRows > 0) {
      this.pubSub.publish('troopDeleted', { troopId: id });
    }
    return result.raw.affectedRows > 0;
  }

  findOneById(id: number): Promise<Troop> {
    return this.troopRepository.findOne({ id: id });
  }
  findByClubId(id: number): Promise<Troop[]> {
    return this.troopRepository.find({ where: { clubId: id } });
  }
  findByClub(club: Club): Promise<Troop[]> {
    return this.findByClubId(club.id);
  }
  findByGymnast(gymnast: Gymnast): Promise<Troop[]> {
    return this.troopRepository.createQueryBuilder('troop')
      .leftJoinAndSelect('troop.gymnasts', 'gymnasts')
      .where('troop.clubId = :clubId', { clubId: gymnast.clubId })
      .andWhere('gymnasts.id = :gymnastId', { gymnastId: gymnast.id })
      .cache(1000)
      .getMany();
  }
  findTroopCountByClub(club: Club): Promise<number> {
    return this.troopRepository.count({ where: { clubId: club.id } });
  }

  findByDivision(division: Division): Promise<Troop[]> {
    if (this.localCachePromise['div' + division.id] == null || !this.cacheCreation || this.cacheCreation.add(1, 'minutes').isBefore(moment())) {
      this.cacheCreation = moment();
      this.localCachePromise['div' + division.id] = this.troopRepository
        .createQueryBuilder('troop')
        .leftJoin('troop_divisions_division_id', 'tddid', 'troop.id = tddid.troopId')
        .where('tddid.divisionId = :divisionId', { divisionId: division.id })
        .getMany()
        .then(troops => (this.localCache['div' + division.id] = troops));
    }
    return this.localCachePromise['div' + division.id];
  }

  invalidateCache() {
    this.localCachePromise = {};
    this.localCache = {};
  }

  findAll(clubId: number, name?: string): Promise<Troop[]> {
    const query = this.troopRepository.createQueryBuilder('troop')
      .leftJoinAndSelect('troop.gymnasts', 'gymnasts');
    if (clubId) { query.andWhere('troop.clubId = :clubId', { clubId: clubId }); }
    if (name) { query.andWhere(`lower(troop.name) like :name`, { name: `%${name.toLowerCase()}%` }); }
    return query.getMany();
  }
}
