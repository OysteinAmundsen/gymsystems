import { getConnectionManager, Repository } from 'typeorm';
import { Body, Delete, EmptyResultCode, Get, JsonController, Param, Post, Put, Res, UseBefore, Req } from 'routing-controllers';
import { Service, Container } from 'typedi';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { Logger } from '../utils/Logger';

import { RequireRoleOrganizer, RequireRoleSecretariat } from '../middlewares/RequireAuth';
import { isSameClubAsMe, isAllSameClubAsMe } from '../validators/CreatedByValidator';

import { SSEService } from '../services/SSEService';
import { UserController } from '../controllers/UserController';

import { TournamentParticipant } from '../model/TournamentParticipant';
import { Role } from '../model/User';

/**
 *
 */
@Service()
@JsonController('/schedule')
export class ScheduleController {
  public repository: Repository<TournamentParticipant>;

  constructor() {
    this.repository = getConnectionManager().get().getRepository(TournamentParticipant);
  }

  @Get()
  all() {
    return this.repository.find();
  }

  @Get('/tournament/:id')
  @EmptyResultCode(404)
  getByTournament( @Param('id') id: number): Promise<TournamentParticipant[]> {
    return this.repository.createQueryBuilder('tournament_participant')
      .where('tournament_participant.tournament=:id', { id: id })
      .innerJoinAndSelect('tournament_participant.tournament', 'tournament')
      .leftJoinAndSelect('tournament_participant.discipline', 'discipline')
      .leftJoinAndSelect('tournament_participant.team', 'team')
      .leftJoinAndSelect('tournament_participant.scores', 'scores')
      .leftJoinAndSelect('discipline.scoreGroups', 'scoreGroups')
      .leftJoinAndSelect('team.divisions', 'division')
      .leftJoinAndSelect('scores.scoreGroup', 'scoresScoreGroup')
      .orderBy('tournament_participant.startNumber', 'ASC')
      .addOrderBy('scoreGroups.operation', 'ASC')
      .addOrderBy('scoreGroups.type', 'ASC')
      .getMany();
  }

  @Get('/:id')
  @EmptyResultCode(404)
  get( @Param('id') id: number): Promise<TournamentParticipant> {
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
  @UseBefore(RequireRoleSecretariat)
  async start(@Param('id') id: number, @Res() res: Response, @Req() req: Request) {
    const participant = await this.getParticipantPlain(id);
    participant.startTime = new Date();
    return this.update(id, participant, res, req);
  }

  @Post('/:id/stop')
  @UseBefore(RequireRoleSecretariat)
  async stop(@Param('id') id: number, @Res() res: Response, @Req() req: Request) {
    const participant = await this.getParticipantPlain(id);
    participant.endTime = new Date();
    return this.update(id, participant, res, req);
  }

  @Post('/:id/publish')
  @UseBefore(RequireRoleSecretariat)
  async publish(@Param('id') id: number, @Res() res: Response, @Req() req: Request) {
    const participant = await this.getParticipantPlain(id);
    participant.publishTime = new Date();
    return this.update(id, participant, res, req);
  }

  getParticipantPlain(id: number): Promise<TournamentParticipant> {
    return this.repository.createQueryBuilder('tournament_participant')
      .where('tournament_participant.id=:id', { id: id })
      .innerJoinAndSelect('tournament_participant.tournament', 'tournament')
      .leftJoinAndSelect('tournament.createdBy', 'user')
      .leftJoinAndSelect('user.club', 'club')
      .getOne();
  }

  @Post()
  @UseBefore(RequireRoleOrganizer)
  async create( @Body() participant: TournamentParticipant | TournamentParticipant[], @Res() res: Response, @Req() req: Request) {
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
  @UseBefore(RequireRoleOrganizer)
  async update( @Param('id') id: number, @Body() participant: TournamentParticipant, @Res() res: Response, @Req() req: Request) {
    const sseService = Container.get(SSEService);
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
  @UseBefore(RequireRoleOrganizer)
  async remove( @Param('id') participantId: number, @Res() res: Response, @Req() req: Request) {
    const participant = await this.repository.findOneById(participantId);
    const sameClub = await isSameClubAsMe(participant.tournament, req);

    if (!sameClub) {
      res.status(403);
      return {code: 403, message: 'You are not authorized to remove participants in a tournament not run by your club.'};
    }
    return this.removeMany([participant], res, req);
  }

  @Delete('/many')
  @EmptyResultCode(200)
  @UseBefore(RequireRoleOrganizer)
  async removeMany( @Body() participant: TournamentParticipant[], @Res() res: Response, @Req() req: Request) {
    const sameClub = await isAllSameClubAsMe(participant.map(p => p.tournament), req);
    if (!sameClub) {
      res.status(403);
      return {code: 403, message: 'You are not authorized to create participants in a tournament not run by your club.'};
    }
    return this.repository.remove(participant)
      .catch(err => {
        Logger.log.error(err);
        return { code: err.code, message: err.message };
      });
  }
}
