import { getConnectionManager, Repository } from 'typeorm';
import { Body, Delete, Get, JsonController, Param, Post, Put, UseBefore, Res, Req } from 'routing-controllers';
import { Container, Service } from 'typedi';
import { Request, Response } from 'express';

import { Logger } from '../utils/Logger';

import { RequireRole } from '../middlewares/RequireAuth';
import { isSameClubAsMe } from '../validators/CreatedByValidator';

// import { SSEController } from './SSEController';
import { SSEController } from '../services/SSEController';
import { ScheduleController } from './ScheduleController';
import { UserController } from '../controllers/UserController';

import { TeamInDiscipline } from '../model/TeamInDiscipline';
import { TeamInDisciplineScore } from '../model/TeamInDisciplineScore';
import { Role } from '../model/User';
import { ErrorResponse } from '../utils/ErrorResponse';

/**
 *
 */
@Service()
@JsonController('/score/participant')
export class ScoreController {
  private repository: Repository<TeamInDisciplineScore>;

  constructor() {
    this.repository = getConnectionManager().get().getRepository(TeamInDisciplineScore);
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
  @UseBefore(RequireRole.get(Role.Secretariat))
  async createFromParticipant( @Param('id') participantId: number, @Body() scores: TeamInDisciplineScore[], @Res() res: Response, @Req() req: Request) {
    const scheduleRepository = Container.get(ScheduleController);
    const sseService = Container.get(SSEController);
    const p = await scheduleRepository.getParticipantPlain(participantId);

    if (p.endTime == null) {
      // Force endtime when scores arrive
      p.endTime = new Date();
      scheduleRepository.update(p.id, p, res, req);
    }

    const sameClub = await isSameClubAsMe(p.tournament, req);
    if (!sameClub) {
      res.status(403);
      return new ErrorResponse(403, 'You are not authorized to add scores in a tournament not run by your club.');
    }

    scores = scores.map(s => { s.participant = p; return s; });
    return this.repository.persist(scores)
      .then(s => {
        sseService.publish('Scores updated');
        return s;
      })
      .catch(err => Logger.log.error(err));
  }

  @Delete('/:id')
  @UseBefore(RequireRole.get(Role.Secretariat))
  async removeFromParticipant( @Param('id') participantId: number, @Res() res: Response, @Req() req: Request) {
    const scheduleRepository = Container.get(ScheduleController);
    const sseService = Container.get(SSEController);
    const userService = Container.get(UserController);
    const me = await userService.me(req);
    const p = await scheduleRepository.getParticipantPlain(participantId);

    const sameClub = await isSameClubAsMe(p.tournament, req);
    if (!sameClub) {
      res.status(403);
      return new ErrorResponse(403, 'You are not authorized to remove scores in a tournament not run by your club.');
    }

    if (me.role >= Role.Organizer || p.publishTime == null) { // Cannot delete if allready published, unless you're the Organizer
      p.endTime = null;
      p.startTime = null;
      p.publishTime = null;
      scheduleRepository.update(p.id, p, res, req);
      return this.repository.find({ participant: participantId }) // Next-gen TypeORM: .find({ participant: {id: participantId} })
        .then(scores => this.repository.remove(scores).then(s => {
          sseService.publish('Scores updated');
          return s;
        }))
        .catch(err => Logger.log.error(err));
    }

    res.status(400);
    return new ErrorResponse(400, 'Scores are allready published.');
  }
}
