import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, SelectQueryBuilder } from 'typeorm';

import { Config } from '../../common/config';
import { TeamInDiscipline, ParticipationType } from './team-in-discipline.model';
import { Tournament } from '../tournament/tournament.model';
import { DivisionType } from '../division/division.model';
import { TeamInDisciplineDto } from './dto/team-in-discipline.dto';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(TeamInDiscipline) private readonly scheduleRepository: Repository<TeamInDiscipline>,
    @Inject('PubSubInstance') private readonly pubSub: PubSub) { }

  save(participant: TeamInDisciplineDto): any {
    const result = this.scheduleRepository.save(<TeamInDiscipline>participant);
    if (result) {
      this.pubSub.publish(participant.id ? 'teamInDisciplineModified' : 'teamInDisciplineCreated', { teamInDiscipline: result });
    }
    return result;
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.scheduleRepository.delete({ id: id });
    if (result.affected > 0) {
      this.pubSub.publish('teamInDisciplineDeleted', { teamInDisciplineId: id });
    }
    return (result.affected > 0);
  }

  findOneById(id: number): Promise<TeamInDiscipline> {
    return this.scheduleRepository.findOne({ id: id });
  }

  private getFindQuery(type?: ParticipationType, scorable?: boolean): SelectQueryBuilder<TeamInDiscipline> {
    const query = this.scheduleRepository.createQueryBuilder('schedule')
      .orderBy('sortNumber', 'ASC');
    if (type) { query.andWhere('schedule.type = :scheduleType', { scheduleType: type }); }
    if (scorable !== undefined) {
      query.leftJoin('schedule.team', 'team')
        .leftJoin('team.divisions', 'divisions')
        .andWhere('divisions.type = :type', { type: DivisionType.Age })
        .andWhere('divisions.scorable = :scorable', { scorable: scorable });
    }
    return query;
  }

  findAll(type?: ParticipationType, scorable?: boolean): Promise<TeamInDiscipline[]> {
    return this.getFindQuery(type, scorable).getMany();
  }

  findByTournamentId(tournamentId: number, type?: ParticipationType, scorable?: boolean): any {
    return this.getFindQuery(type, scorable)
      .andWhere('schedule.tournamentId = :id', { id: tournamentId })
      .getMany();
  }

  findByTournament(tournament: Tournament, type?: ParticipationType): Promise<TeamInDiscipline[]> {
    return this.findByTournamentId(tournament.id, type);
  }
}
