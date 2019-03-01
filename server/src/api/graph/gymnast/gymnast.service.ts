import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PubSub } from 'graphql-subscriptions';

import { Config } from '../../common/config';
import { Gymnast } from './gymnast.model';
import { Club } from '../club/club.model';
import { Tournament } from '../tournament/tournament.model';
import { Troop } from '../troop/troop.model';
import { Team } from '../team/team.model';
import { GymnastDto } from './dto/gymnast.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class GymnastService {
  constructor(
    @InjectRepository(Gymnast) private readonly gymnastRepository: Repository<Gymnast>,
    @Inject('PubSubInstance') private readonly pubSub: PubSub) { }

  /**
   *
   * @param gymnast The gymnast data to persist
   */
  async save(gymnast: GymnastDto): Promise<Gymnast> {
    if (gymnast.id) {
      const entity = await this.gymnastRepository.findOne({ id: gymnast.id });
      gymnast = Object.assign(entity, gymnast);
    }
    const result = await this.gymnastRepository.save(plainToClass(Gymnast, gymnast));
    if (result) {
      this.pubSub.publish(gymnast.id ? 'gymnastModified' : 'gymnastCreated', { gymnast: result });
    }

    delete result.club;
    delete result.team;
    delete result.troop;

    return result;
  }

  saveAll(members: Gymnast[]): Promise<Gymnast[]> {
    return Promise.all(members.map(m => this.save(<GymnastDto>m)));
  }

  /**
   *
   * @param id The id of the gymnast to remove
   */
  async remove(id: number): Promise<boolean> {
    const result = await this.gymnastRepository.delete({ id: id });
    if (result.raw.affectedRows > 0) {
      this.pubSub.publish('gymnastDeleted', { gymnastId: id });
    }
    return result.raw.affectedRows > 0;
  }

  findOneById(id: number): Promise<Gymnast> {
    return this.gymnastRepository.findOne({ id: id });
  }
  findAll(): Promise<Gymnast[]> {
    return this.gymnastRepository.find();
  }
  findByClubId(id: number): any {
    return this.gymnastRepository.find({ where: { clubId: id }, cache: Config.QueryCache })
  }
  findByClub(club: Club): Promise<Gymnast[]> {
    return this.findByClubId(club.id);
  }
  findByLodgingInTournament(tournament: Tournament): Promise<Gymnast[]> {
    return this.gymnastRepository.find({ where: { lodging: [tournament] }, cache: Config.QueryCache })
  }
  findByTransportInTournament(tournament: Tournament): Promise<Gymnast[]> {
    return this.gymnastRepository.find({ where: { transport: [tournament] }, cache: Config.QueryCache })
  }
  findByBanquetInTournament(tournament: Tournament): Promise<Gymnast[]> {
    return this.gymnastRepository.find({ where: { banquet: [tournament] }, cache: Config.QueryCache })
  }
  findByTeamId(teamId: number): Promise<Gymnast[]> {
    return this.gymnastRepository.createQueryBuilder('gymnast')
      .leftJoin('gymnast_team_team_id', 'gttid', 'gymnast.id = gttid.gymnastId')
      .where('gttid.teamId = :teamId', { teamId: teamId })
      .orderBy({ birthYear: 'ASC', gender: 'ASC' })
      .cache(Config.QueryCache)
      .getMany();
  }
  findByTeam(team: Team): Promise<Gymnast[]> {
    return this.findByTeamId(team.id);
  }
  findByTroopId(troopId: number): Promise<Gymnast[]> {
    return this.gymnastRepository.createQueryBuilder('gymnast')
      .leftJoin('gymnast_troop_troop_id', 'gttid', 'gymnast.id = gttid.gymnastId')
      .where('gttid.troopId = :troopId', { troopId: troopId })
      .orderBy({ birthYear: 'ASC', gender: 'ASC' })
      .cache(Config.QueryCache)
      .getMany();
  }
  findByTroop(troop: Troop): Promise<Gymnast[]> {
    return this.findByTroopId(troop.id);
  }
}
