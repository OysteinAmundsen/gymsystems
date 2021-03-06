import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PubSub } from 'graphql-subscriptions';
import * as moment from 'moment';

import { ScoreDto } from './dto/score.dto';
import { Score } from './score.model';
import { ScoreGroupService } from '../score-group/score-group.service';
import { Operation, ScoreGroup } from '../score-group/score-group.model';
import { Tournament } from '../tournament/tournament.model';
import { TeamInDiscipline } from '../schedule/team-in-discipline.model';
import { TotalByScoreGroup } from './dto/total-by-scoregroup.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ScoreService {
  localCache: { [id: string]: Score[] } = {};
  localCahcePromise: { [id: string]: Promise<Score[]> } = {};
  cacheCreation: moment.Moment;

  constructor(
    @InjectRepository(Score) private readonly scoreRepository: Repository<Score>,
    @Inject('PubSubInstance') private readonly pubSub: PubSub,
    private readonly scoreGroupService: ScoreGroupService
  ) { }

  async save(score: ScoreDto): Promise<Score> {
    const entity = await this.scoreRepository.findOne({ judgeIndex: score.judgeIndex, participantId: score.participantId, scoreGroupId: score.scoreGroupId });
    if (entity) {
      score = Object.assign(entity, score);
    }
    score.updated = new Date();
    const result = await this.scoreRepository.save(plainToClass(Score, score));
    this.invalidateCache();
    if (result) {
      this.pubSub.publish(result.id ? 'scoreModified' : 'scoreCreated', { score: result });
    }
    delete result.participant;
    delete result.scoreGroup;
    return result;
  }


  async saveAll(scores: ScoreDto[]): Promise<Score[]> {
    return Promise.all(scores.map(score => this.save(score))).then(results => {
      this.pubSub.publish('teamInDisciplineModified', { teamInDiscipline: scores[0].participantId });
      return results;
    });
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.scoreRepository.delete({ id: id });
    this.invalidateCache();
    if (result.raw.affectedRows > 0) {
      this.pubSub.publish('scoreDeleted', { scoreId: id });
    }
    return result.raw.affectedRows > 0;
  }

  async removeAllByParticipant(id: number): Promise<boolean> {
    const scoreIds = await this.findByParticipantId(id);
    const result = await this.scoreRepository.delete({ participantId: +id });
    this.invalidateCache();
    if (result.raw.affectedRows > 0) {
      this.pubSub.publish('scoreDeleted', { scoreId: scoreIds.map(s => s.id) });
    }
    return result.raw.affectedRows > 0;
  }

  invalidateCache() {
    this.localCache = {};
    this.localCahcePromise = {};
  }

  findOneById(id: number): Promise<Score> {
    return this.scoreRepository.findOne({ id: id });
  }

  findByParticipantId(id: number): Promise<Score[]> {
    if (this.localCahcePromise['p' + id] == null || !this.cacheCreation || this.cacheCreation.add(1, 'minutes').isBefore(moment())) {
      this.cacheCreation = moment();
      this.localCahcePromise['p' + id] = this.scoreRepository
        .find({ where: { participantId: id }, order: { scoreGroupId: 'ASC', judgeIndex: 'ASC' } })
        .then(score => this.localCache['p' + id] = score);
    }
    return this.localCahcePromise['p' + id];
  }
  async findByParticipant(participant: TeamInDiscipline): Promise<Score[]> {
    if (!participant.scores) {
      participant.scores = await this.findByParticipantId(participant.id);
    }
    return participant.scores;
  }

  findByTournamentId(id: number): Promise<Score[]> {
    if (this.localCahcePromise['t' + id] == null || !this.cacheCreation || this.cacheCreation.add(1, 'minutes').isBefore(moment())) {
      this.cacheCreation = moment();
      this.localCahcePromise['t' + id] = this.scoreRepository
        .find({ where: { tournamentId: id }, order: { participantId: 'ASC', scoreGroupId: 'ASC', judgeIndex: 'ASC' } })
        .then(groups => this.localCache['t' + id] = groups);
    }
    return this.localCahcePromise['t' + id];
  }
  findByTournament(tournament: Tournament): Promise<Score[]> {
    return this.findByTournamentId(tournament.id);
  }

  async getTotalScore(participant: TeamInDiscipline): Promise<string> {
    const byScoreGroup = await this.getTotalByScoreGroup(participant);
    return byScoreGroup.reduce((prev, curr) => prev += curr.total, 0).toFixed(3);
  }

  async getTotalByScoreGroup(participant: TeamInDiscipline): Promise<TotalByScoreGroup[]> {
    const allScores = participant.scores ? participant.scores : (await this.findByTournamentId(participant.tournamentId));
    const sg = await this.scoreGroupService.findByDisciplineId(participant.disciplineId);
    return sg.map((curr: ScoreGroup) => {
      const isAdd = curr.operation === Operation.Addition;
      const scores = allScores.filter(s => s.participantId === participant.id && s.scoreGroupId === curr.id);
      return {
        group: curr,
        total: scores.length ? (scores.reduce((p, score) => (isAdd ? p += score.value : p -= score.value), 0) / scores.length) : 0
      }
    });
  }

  findAll(): Promise<Score[]> {
    return this.scoreRepository.find();
  }
}
