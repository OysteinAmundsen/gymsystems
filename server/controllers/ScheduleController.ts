import { getConnectionManager, Repository } from 'typeorm';
import { Body, Delete, OnUndefined, Get, JsonController, Param, Post, Put, Res, UseBefore, Req } from 'routing-controllers';
import { Service, Container } from 'typedi';
import { Request, Response } from 'express';

import { Logger } from '../utils/Logger';

import { RequireRole } from '../middlewares/RequireAuth';
import { isSameClubAsMe, isAllSameClubAsMe } from '../validators/CreatedByValidator';

import { SSEController } from '../services/SSEController';
// import { SSEController } from '../controllers/SSEController';
import { UserController } from '../controllers/UserController';

import { TeamInDiscipline } from '../model/TeamInDiscipline';
import { Role } from '../model/User';

/**
 *
 */
@Service()
@JsonController('/schedule')
export class ScheduleController {
  public repository: Repository<TeamInDiscipline>;

  constructor() {
    this.repository = getConnectionManager().get().getRepository(TeamInDiscipline);
  }

  @Get()
  all() {
    return this.repository.find();
  }

  @Get('/tournament/:id')
  @OnUndefined(404)
  getByTournament( @Param('id') id: number): Promise<TeamInDiscipline[]> {
    return this.repository.createQueryBuilder('tournament_participant')
      .where('tournament_participant.tournament=:id', { id: id })
      .innerJoinAndSelect('tournament_participant.tournament', 'tournament')
      .leftJoinAndSelect('tournament_participant.discipline', 'discipline')
      .leftJoinAndSelect('tournament_participant.team', 'team')
      .leftJoinAndSelect('tournament_participant.scores', 'scores')
      .leftJoinAndSelect('discipline.scoreGroups', 'scoreGroups')
      .leftJoinAndSelect('team.media', 'media')
      .leftJoinAndSelect('media.discipline', 'media_discipline')
      .leftJoinAndSelect('media.team', 'media_team')
      .leftJoinAndSelect('team.divisions', 'division')
      .leftJoinAndSelect('scores.scoreGroup', 'scoresScoreGroup')
      .orderBy('tournament_participant.startNumber', 'ASC')
      .addOrderBy('scoreGroups.operation', 'ASC')
      .addOrderBy('scoreGroups.type', 'ASC')
      .getMany();
  }

  @Get('/:id')
  @OnUndefined(404)
  get( @Param('id') id: number): Promise<TeamInDiscipline> {
    return this.repository.createQueryBuilder('tournament_participant')
      .where('tournament_participant.id=:id', { id: id })
      .innerJoinAndSelect('tournament_participant.tournament', 'tournament')
      .leftJoinAndSelect('tournament_participant.discipline', 'discipline')
      .leftJoinAndSelect('discipline.scoreGroups', 'scoreGroups')
      .innerJoinAndSelect('tournament_participant.team', 'team')
      .leftJoinAndSelect('team.divisions', 'division')
      .leftJoinAndSelect('tournament_participant.scores', 'scores')
      .orderBy('scoreGroups.operation', 'ASC')
      .addOrderBy('scoreGroups.type', 'ASC')
      .getOne();
  }

  @Post('/:id/start')
  @UseBefore(RequireRole.get(Role.Secretariat))
  async start(@Param('id') id: number, @Res() res: Response, @Req() req: Request) {
    const participant = await this.getParticipantPlain(id);
    participant.startTime = new Date();
    return this.update(id, participant, res, req);
  }

  @Post('/:id/stop')
  @UseBefore(RequireRole.get(Role.Secretariat))
  async stop(@Param('id') id: number, @Res() res: Response, @Req() req: Request) {
    const participant = await this.getParticipantPlain(id);
    participant.endTime = new Date();
    return this.update(id, participant, res, req);
  }

  @Post('/:id/publish')
  @UseBefore(RequireRole.get(Role.Secretariat))
  async publish(@Param('id') id: number, @Res() res: Response, @Req() req: Request) {
    const participant = await this.getParticipantPlain(id);
    participant.publishTime = new Date();
    return this.update(id, participant, res, req);
  }

  getParticipantPlain(id: number): Promise<TeamInDiscipline> {
    return this.repository.createQueryBuilder('tournament_participant')
      .where('tournament_participant.id=:id', { id: id })
      .innerJoinAndSelect('tournament_participant.tournament', 'tournament')
      .leftJoinAndSelect('tournament.createdBy', 'user')
      .leftJoinAndSelect('user.club', 'club')
      .getOne();
  }

  @Post()
  @UseBefore(RequireRole.get(Role.Organizer))
  async create( @Body() participant: TeamInDiscipline | TeamInDiscipline[], @Res() res: Response, @Req() req: Request) {
    const participants = Array.isArray(participant) ? participant : [participant];
    const sameClub = await isAllSameClubAsMe(participants.map(p => p.tournament), req);
    if (!sameClub) {
      res.status(403);
      return {code: 403, message: 'You are not authorized to create participants in a tournament not run by your club.'};
    }

    return this.repository.persist(participants)
      .catch(err => {
        Logger.log.error(err);
        return { code: err.code, message: err.message };
      });
  }

  @Put('/:id')
  @UseBefore(RequireRole.get(Role.Organizer))
  async update( @Param('id') id: number, @Body() participant: TeamInDiscipline, @Res() res: Response, @Req() req: Request) {
    const sseService = Container.get(SSEController);
    const sameClub = await isSameClubAsMe(participant.tournament, req);
    if (!sameClub) {
      res.status(403);
      return {code: 403, message: 'You are not authorized to update participants in a tournament not run by your club.'};
    }
    return this.repository.persist(participant)
      .then(() => {
        sseService.publish('Participant updated');
        return this.get(id);
      })
      .catch(err => {
        Logger.log.error(err);
        return { code: err.code, message: err.message };
      });
  }

  @Delete('/:id')
  @UseBefore(RequireRole.get(Role.Organizer))
  async remove( @Param('id') participantId: number, @Res() res: Response, @Req() req: Request) {
    const participant = await this.repository.findOneById(participantId);
    return this.removeMany([participant], res, req);
  }

  @Delete('/tournament/:id')
  @OnUndefined(200)
  @UseBefore(RequireRole.get(Role.Organizer))
  async removeAllFromTournament( @Param('id') tournamentId: number, @Res() res: Response, @Req() req: Request) {
    const participants = await this.repository.createQueryBuilder('tournament_participant')
      .innerJoinAndSelect('tournament_participant.tournament', 'tournament')
      .leftJoinAndSelect('tournament.createdBy', 'user')
      .leftJoinAndSelect('user.club', 'club')
      .where('tournament_participant.tournament=:id', { id: tournamentId })
      .getMany();
    return this.removeMany(participants, res, req);
  }

  async removeMany(participants: TeamInDiscipline[], res: Response, req: Request) {
    const sameClub = await isAllSameClubAsMe(participants.map(p => p.tournament), req);
    if (!sameClub) {
      res.status(403);
      return {code: 403, message: 'You are not authorized to remove participants from a tournament not run by your club.'};
    }
    return this.repository.remove(participants)
      .catch(err => {
        Logger.log.error(err);
        return { code: err.code, message: err.message };
      });
  }
}
