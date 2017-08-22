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
import { Score } from '../model/Score';
import { Role } from '../model/User';
import { ErrorResponse } from '../utils/ErrorResponse';
import { OkResponse } from '../utils/OkResponse';

/**
 * RESTful controller for all things related to `Score`s.
 *
 * This controller is also a service, which means you can inject it
 * anywhere in your code:
 *
 * ```
 * import { Container } from 'typedi';
 * import { ScoreController } from '/controllers/Scorecontroller';
 *
 * var scoreController = Container.get(ScoreController);
 * ```
 */
@Service()
@JsonController('/score/participant')
export class ScoreController {
  private repository: Repository<Score>;

  constructor() {
    this.repository = getConnectionManager().get().getRepository(Score);
  }

  /**
   * Endpoint for fetching the scores for a team in a discipline
   * **USAGE:**
   * GET /score/participant/:id
   *
   * @param participantId
   */
  @Get('/:id')
  getByParticipant( @Param('id') participantId: number) {
    return this.repository.createQueryBuilder('tournament_participant_score')
      .where('tournament_participant_score.participant=:id', { id: participantId })
      .leftJoinAndSelect('tournament_participant_score.scoreGroup', 'scoresScoreGroup')
      .orderBy('scoresScoreGroups.operation', 'ASC')
      .addOrderBy('scoresScoreGroups.type', 'ASC')
      .getMany();
  }

  /**
   * Endpoint for setting points for a team in a discipline
   *
   * **USAGE:** (Secretariat only)
   * POST /score/participant/:id
   *
   * @param participantId
   * @param scores
   * @param res
   * @param req
   */
  @Post('/:id')
  @UseBefore(RequireRole.get(Role.Secretariat))
  async createFromParticipant( @Param('id') participantId: number, @Body() scores: Score[], @Res() res: Response, @Req() req: Request) {
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

  /**
   * Endpoint for removing scores from a team in a discipline
   *
   * **USAGE:** (Secretariat only)
   * DELETE /score/participant/:id
   *
   * @param participantId
   * @param res
   * @param req
   */
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

  /**
   * Endpoint for rolling back tournament execution to a specific point in the schedule
   *
   * **USAGE:** (Organizer only)
   * GET /score/participant/:id/rollback
   *
   * @param participantId
   * @param res
   * @param req
   */
  @Get('/:id/rollback')
  @UseBefore(RequireRole.get(Role.Organizer))
  async rollbackToParticipant( @Param('id') participantId: number, @Res() res: Response, @Req() req: Request) {
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

    const schedule = await scheduleRepository.getByTournament(p.tournament.id);
    const idx = schedule.findIndex(i => i.id === p.id);
    const itemsToRollback = schedule.slice(idx).filter(i => i.startTime != null);
    return Promise.all(itemsToRollback.map(i => {
      i.endTime = null;
      i.startTime = null;
      i.publishTime = null;
      return this.repository.remove(i.scores).then(s => {
        i.scores = [];
        return scheduleRepository.repository.persist(i);
      })
    })).then(() => {
      sseService.publish('Scores updated');
      return new OkResponse();
    });
  }
}
