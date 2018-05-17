import { getConnectionManager, Repository } from 'typeorm';
import { Body, Delete, OnUndefined, Get, JsonController, Param, Post, Put, Res, UseBefore, Req } from 'routing-controllers';
import { Service, Container } from 'typedi';
import { Request, Response } from 'express';

import { Log } from '../utils/Logger';

import { RequireRole } from '../middlewares/RequireAuth';
import { isSameClubAsMe, isAllSameClubAsMe } from '../validators/CreatedByValidator';

import { SSEController } from '../services/SSEController';
// import { SSEController } from '../controllers/SSEController';
import { UserController } from '../controllers/UserController';

import { TeamInDiscipline } from '../model/TeamInDiscipline';
import { Role } from '../model/User';
import { TournamentController } from './TournamentController';
import { ErrorResponse } from '../utils/ErrorResponse';
import { ScoreController } from './ScoreController';

/**
 * RESTful controller for all things related to `TeamInDiscipline`, which effectively
 * is a schedule entry.
 *
 * This controller is also a service, which means you can inject it
 * anywhere in your code:
 *
 * ```
 * import { Container } from 'typedi';
 * import { ScheduleController } from '/controllers/Schedulecontroller';
 *
 * var scheduleController = Container.get(ScheduleController);
 * ```
 */
@Service()
@JsonController('/schedule')
export class ScheduleController {
  public repository: Repository<TeamInDiscipline>;

  constructor() {
    this.repository = getConnectionManager().get().getRepository(TeamInDiscipline);
  }

  /**
   * Endpoint for retreiving all schedules.
   *
   * This is actually not very useful. It is more useful
   * to filter the schedule based on tournament, so we recommend to use
   * `GET /schedule/tournament/:id` instead
   *
   * **USAGE:**
   * GET /schedule
   */
  @Get()
  all() {
    return this.repository.find();
  }

  /**
   * Endpoint for retreiving the schedule for a tournament
   *
   * **USAGE:**
   * GET /schedule/tournament/:id
   *
   * @param id
   */
  @Get('/tournament/:id')
  @OnUndefined(404)
  getByTournament( @Param('id') id: number): Promise<TeamInDiscipline[]> {
    return this.repository.createQueryBuilder('participant')
      .where('participant.tournament=:id', { id: id })
      .leftJoinAndSelect('participant.discipline', 'discipline')
      .leftJoinAndSelect('participant.team', 'team')
      .leftJoinAndSelect('participant.scores', 'scores')
      .leftJoinAndSelect('discipline.scoreGroups', 'scoreGroups')
      .leftJoinAndSelect('scoreGroups.judges', 'judges')
      .leftJoinAndSelect('judges.judge', 'judge')
      .leftJoinAndSelect('team.media', 'media')
      .leftJoinAndSelect('media.discipline', 'media_discipline')
      .leftJoinAndSelect('media.team', 'media_team')
      .leftJoinAndSelect('team.divisions', 'division')
      .leftJoinAndSelect('scores.scoreGroup', 'scoresScoreGroup') // Used to calculate scoregroup total on client
      .orderBy('participant.sortNumber', 'ASC')
      .addOrderBy('scoreGroups.operation', 'ASC')
      .addOrderBy('scoreGroups.type', 'ASC')
      .getMany();
  }

  /**
   * Endpoint for retreiving one entry in the schedule
   *
   * **USAGE:**
   * GET /schedule/:id
   */
  @Get('/:id')
  @OnUndefined(404)
  get( @Param('id') id: number): Promise<TeamInDiscipline> {
    return this.repository.createQueryBuilder('participant')
      .where('participant.id=:id', { id: id })
      .leftJoinAndSelect('participant.discipline', 'discipline')
      .innerJoinAndSelect('participant.team', 'team')
      .leftJoinAndSelect('participant.scores', 'scores')
      .leftJoinAndSelect('discipline.scoreGroups', 'scoreGroups')
      .leftJoinAndSelect('scoreGroups.judges', 'judges')
      .leftJoinAndSelect('judges.judge', 'judge')
      .leftJoinAndSelect('team.divisions', 'division')
      .orderBy('scoreGroups.operation', 'ASC')
      .addOrderBy('scoreGroups.type', 'ASC')
      .getOne();
  }

  /**
   * Endpoint for starting the execution of a team in the schedule
   *
   * **USAGE:** (Secretariat only)
   * POST /schedule/:id/start
   *
   * @param id
   * @param res
   * @param req
   */
  @Post('/:id/start')
  @UseBefore(RequireRole.get(Role.Secretariat))
  async start(@Param('id') id: number, @Res() res: Response, @Req() req: Request) {
    const participant = await this.getParticipantPlain(id);
    participant.startTime = new Date();
    return this.update(id, participant, res, req);
  }

  /**
   * Endpoint for stopping the execution of a team in the schedule
   *
   * **USAGE:** (Secretariat only)
   * POST /schedule/:id/stop
   *
   * @param id
   * @param res
   * @param req
   */
  @Post('/:id/stop')
  @UseBefore(RequireRole.get(Role.Secretariat))
  async stop(@Param('id') id: number, @Res() res: Response, @Req() req: Request) {
    const participant = await this.getParticipantPlain(id);
    participant.endTime = new Date();
    return this.update(id, participant, res, req);
  }

  /**
   * Endpoint for publishing scores
   *
   * **USAGE:** (Secretariat only)
   * POST /schedule/:id/publish
   *
   * @param id
   * @param res
   * @param req
   */
  @Post('/:id/publish')
  @UseBefore(RequireRole.get(Role.Secretariat))
  async publish(@Param('id') id: number, @Res() res: Response, @Req() req: Request) {
    const participant = await this.getParticipantPlain(id);
    participant.publishTime = new Date();
    return this.update(id, participant, res, req);
  }

  /**
   *
   *
   * @param id
   */
  getParticipantPlain(id: number): Promise<TeamInDiscipline> {
    return this.repository.createQueryBuilder('participant')
      .where('participant.id=:id', { id: id })
      .innerJoinAndSelect('participant.tournament', 'tournament')
      .leftJoinAndSelect('tournament.createdBy', 'user')
      .leftJoinAndSelect('tournament.club', 'club')
      .getOne();
  }

  /**
   * Endpoint for creating entries in the schedule
   *
   * **USAGE:** (Organizer only)
   * POST /schedule
   *
   * @param participant
   * @param res
   * @param req
   */
  @Post()
  @UseBefore(RequireRole.get(Role.Organizer))
  async create( @Body() participant: TeamInDiscipline | TeamInDiscipline[], @Res() res: Response, @Req() req: Request) {
    const participants = Array.isArray(participant) ? participant : [participant];
    const item = participants.find(p => p.tournament && p.tournament.id != null);
    const tournamentId = (item) ? item.tournament.id : null;
    const tournamentRepository = Container.get(TournamentController);
    const tournament = await tournamentRepository.get(tournamentId);
    const sameClub = await isSameClubAsMe(tournament, req);
    if (!sameClub) {
      res.status(403);
      return new ErrorResponse(403, 'You are not authorized to create participants in a tournament not run by your club.');
    }

    return this.repository.save(participants)
      .catch(err => {
        Log.log.error(`Error creating schedule participants`, err);
        return new ErrorResponse(err.code, err.message);
      });
  }

  /**
   * Endpoint for updating one entry in the schedule
   *
   * **USAGE:** (Organizer only)
   * PUT /schedule/:id
   *
   * @param id
   * @param participant
   * @param res
   * @param req
   */
  @Put('/:id')
  @UseBefore(RequireRole.get(Role.Organizer))
  async update( @Param('id') id: number, @Body() participant: TeamInDiscipline, @Res() res: Response, @Req() req: Request) {
    const sseService = Container.get(SSEController);
    const sameClub = await isSameClubAsMe(participant.tournament, req);
    if (!sameClub) {
      res.status(403);
      return new ErrorResponse(403, 'You are not authorized to update participants in a tournament not run by your club.');
    }
    return this.repository.save(participant)
      .then(() => {
        sseService.publish('Participant updated');
        return this.get(id);
      })
      .catch(err => {
        Log.log.error(`Error updating participant ${id} in schedule`, err);
        return new ErrorResponse(err.code, err.message);
      });
  }

  /**
   * Endpoint for removing one entry in the schedule
   *
   * **USAGE:** (Organizer only)
   * DELETE /schedule/:id
   *
   * @param participantId
   * @param res
   * @param req
   */
  @Delete('/:id')
  @UseBefore(RequireRole.get(Role.Organizer))
  async remove( @Param('id') participantId: number, @Res() res: Response, @Req() req: Request) {
    const participant = await this.repository.createQueryBuilder('participant')
      .innerJoinAndSelect('participant.tournament', 'tournament')
      .leftJoinAndSelect('tournament.createdBy', 'user')
      .leftJoinAndSelect('tournament.club', 'club')
      .where('participant.id=:id', {id: participantId})
      .getOne();
    return this.removeMany([participant], res, req);
  }

  /**
   * Endpoint for erasing the entire schedule for a tournament
   *
   * **USAGE:** (Organizer only)
   * DELETE /schedule/tournament/:id
   *
   * @param tournamentId
   * @param res
   * @param req
   */
  @Delete('/tournament/:id')
  @OnUndefined(200)
  @UseBefore(RequireRole.get(Role.Organizer))
  async removeAllFromTournament( @Param('id') tournamentId: number, @Res() res: Response, @Req() req: Request) {
    // Remove potential scores
    const schedule = await this.getByTournament(tournamentId);
    return this.removeMany(schedule, res, req);
  }

  async removeAllFromDiscipline(disciplineId: number) {
    const participants = await this.repository.createQueryBuilder('participant')
      .innerJoinAndSelect('participant.tournament', 'tournament')
      .leftJoinAndSelect('tournament.createdBy', 'user')
      .leftJoinAndSelect('tournament.club', 'club')
      .where('participant.discipline=:id', { id: disciplineId })
      .getMany();
    return this.removeMany(participants, null, null, true);
  }

  async removeMany(participants: TeamInDiscipline[], res?: Response, req?: Request, force = false) {
    if (!force) {
      const sameClub = await isAllSameClubAsMe(participants.map(p => p.tournament), req);
      if (!sameClub) {
        res.status(403);
        return new ErrorResponse(403, 'You are not authorized to remove participants from a tournament not run by your club.');
      }
    }
    const scoreCtrl = Container.get(ScoreController);
    participants.forEach(s => scoreCtrl.removeFromParticipant(s.id, res, req));

    return this.repository.remove(participants)
      .catch(err => {
        Log.log.error(`Error removing participants in schedule`, err);
        res.status(400);
        return new ErrorResponse(err.code, err.sqlMessage);
      });
  }
}
