import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { TeamInDiscipline, ParticipationType } from './team-in-discipline.model';
import { Tournament } from '../tournament/tournament.model';
import { DivisionType } from '../division/division.model';
import { TeamInDisciplineDto } from './dto/team-in-discipline.dto';
import { PubSub } from 'graphql-subscriptions';
import { UserService } from '../user/user.service';
import { ClubService } from '../club/club.service';
import { ScoreService } from '../score/score.service';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly userService: UserService,
    private readonly scoreService: ScoreService,
    @InjectRepository(TeamInDiscipline) private readonly scheduleRepository: Repository<TeamInDiscipline>,
    @Inject('PubSubInstance') private readonly pubSub: PubSub) { }

  async save(participant: TeamInDisciplineDto): Promise<TeamInDiscipline> {
    if (participant.id) {
      const entity = await this.scheduleRepository.findOne({ id: participant.id });
      participant = Object.assign(entity, participant);
    }
    const result = await this.scheduleRepository.save(<TeamInDiscipline>participant);
    if (result) {
      this.pubSub.publish(participant.id ? 'teamInDisciplineModified' : 'teamInDisciplineCreated', { teamInDiscipline: result });
    }
    delete result.divisions;
    delete result.scores;
    delete result.team;
    delete result.tournament;
    delete result.discipline;

    return result;
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.scheduleRepository.delete({ id: id });
    if (result.affected > 0) {
      this.pubSub.publish('teamInDisciplineDeleted', { teamInDisciplineId: id });
    }
    return (result.affected > 0);
  }

  async removeByTournament(tournamentId: number): Promise<boolean> {
    const result = await this.scheduleRepository.delete({ tournamentId: tournamentId });
    if (result.affected > 0) {
      this.pubSub.publish('teamInDisciplineDeleted', { tournamentId: tournamentId });
    }
    return (result.affected > 0);
  }

  async rollbackTo(tournamentId: number, participantId: number): Promise<boolean> {
    const me = await this.userService.getAuthenticatedUser();
    const p = await this.scheduleRepository.findOne(participantId);

    ClubService.enforceSame(me.clubId);

    let schedule = await this.findByTournamentId(tournamentId);
    schedule = schedule.sort((a, b) => a.sortNumber < b.sortNumber ? -1 : 1);
    const idx = schedule.findIndex(i => i.id === p.id);
    const itemsToRollback = schedule.slice(idx).filter(i => i.startTime != null);
    return Promise.all(itemsToRollback.map(i => {
      i.endTime = null;
      i.startTime = null;
      i.publishTime = null;
      return this.scoreService.removeAllByParticipant(participantId).then(s => {
        i.scores = [];
        return this.scheduleRepository.save(i);
      })
    })).then(() => {
      // sseService.publish('Scores updated');
      // return new OkResponse();
      return true;
    });
  }

  async publish(id: number): Promise<TeamInDiscipline> {
    const p = await this.scheduleRepository.findOne(id);
    p.publishTime = new Date();
    return this.scheduleRepository.save(p);
  }

  async stop(id: number): Promise<TeamInDiscipline> {
    const p = await this.scheduleRepository.findOne(id);
    p.endTime = new Date();
    return this.scheduleRepository.save(p);
  }

  async start(id: number): Promise<TeamInDiscipline> {
    const p = await this.scheduleRepository.findOne(id);
    p.startTime = new Date();
    return this.scheduleRepository.save(p);
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

  countByTournament(tournament: Tournament): Promise<number> {
    return this.scheduleRepository.count({ where: { tournamentId: tournament.id } });
  }
}
