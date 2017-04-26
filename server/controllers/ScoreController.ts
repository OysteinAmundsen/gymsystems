import { getConnectionManager, Repository } from 'typeorm';
import { Body, Delete, Get, JsonController, Param, Post, Put, UseBefore, Res } from 'routing-controllers';
import { EntityFromParam, EntityFromBody } from 'typeorm-routing-controllers-extensions';
import { Container, Service } from 'typedi';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { Logger } from '../utils/Logger';

import { SSEService } from '../services/SSEService';
import { RequireRoleSecretariat } from '../middlewares/RequireAuth';
import { ScheduleController } from './ScheduleController';

import { TournamentParticipant } from '../model/TournamentParticipant';
import { TournamentParticipantScore } from '../model/TournamentParticipantScore';

/**
 *
 */
@Service()
@JsonController('/score/participant')
export class ScoreController {
  private repository: Repository<TournamentParticipantScore>;

  constructor() {
    this.repository = getConnectionManager().get().getRepository(TournamentParticipantScore);
  }

  @Get('/:id')
  getByParticipant( @Param('id') participantId: number) {
    return this.repository.createQueryBuilder('tournament_participant_score')
      .where('tournament_participant_score.participant=:id', { id: participantId })
      .leftJoinAndSelect('tournament_participant_score.scoreGroup', 'scoresScoreGroup')
      .orderBy('scoresScoreGroups.operation', 'ASC')
      .addOrderBy('scoresScoreGroups.type', 'ASC')
      .getMany();
  }

  @Post('/:id')
  @UseBefore(RequireRoleSecretariat)
  createFromParticipant( @Param('id') participantId: number, @Body() scores: TournamentParticipantScore[], @Res() res: Response) {
    const scheduleRepository = Container.get(ScheduleController);
    const sseService = Container.get(SSEService);
    return scheduleRepository.getParticipantPlain(participantId)
      .then(p => {
        if (p.endTime == null) {
          p.endTime = new Date();
          scheduleRepository.update(p.id, p, res);
        }
        scores = scores.map(s => { s.participant = p; return s; });
        return this.repository.persist(scores)
          .then(s => {
            sseService.publish('Scores updated');
            return s;
          })
          .catch(err => Logger.log.error(err));
      })
      .catch(err => Logger.log.error(err));
  }

  @Put('/:id')
  @UseBefore(RequireRoleSecretariat)
  publishScore( @Param('id') participantId: number) {

  }

  @Delete('/:id')
  @UseBefore(RequireRoleSecretariat)
  removeFromParticipant( @Param('id') participantId: number, @Res() res: Response) {
    const scheduleRepository = Container.get(ScheduleController);
    const sseService = Container.get(SSEService);
    return scheduleRepository.getParticipantPlain(participantId)
      .then(p => {
        if (p.publishTime == null) { // Cannot delete if allready published
          p.endTime = null;
          p.startTime = null;
          p.publishTime = null;
          scheduleRepository.update(p.id, p, res);
          return this.repository.find({ participant: participantId })
            .then(scores => this.repository.remove(scores).then(s => {
              sseService.publish('Scores updated');
              return s;
            }))
            .catch(err => Logger.log.error(err));
        }
        return null;
      });
  }
}
