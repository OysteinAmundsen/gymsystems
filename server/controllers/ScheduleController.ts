import { getConnectionManager, Repository } from 'typeorm';
import { Body, Delete, EmptyResultCode, Get, JsonController, Param, Post, Put, Res, UseBefore } from 'routing-controllers';
import { Service, Container } from 'typedi';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { Logger } from '../utils/Logger';
import { RequireRoleOrganizer } from '../middlewares/RequireAuth';
import { TournamentParticipant } from '../model/TournamentParticipant';
import { SSEService } from "../services/SSEService";

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

  getParticipantPlain(id: number): Promise<TournamentParticipant> {
    return this.repository.findOneById(id);
  }

  @Post()
  @UseBefore(RequireRoleOrganizer)
  create( @Body() participant: TournamentParticipant | TournamentParticipant[], @Res() res: Response): Promise<TournamentParticipant[]> {
    const participants = Array.isArray(participant) ? participant : [participant];
    return this.repository.persist(participants)
      .catch(err => {
        Logger.log.error(err);
        return { code: err.code, message: err.message };
      });
  }

  @Put('/:id')
  @UseBefore(RequireRoleOrganizer)
  update( @Param('id') id: number, @Body() participant: TournamentParticipant, @Res() res: Response) {
    const sseService = Container.get(SSEService);
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
  async remove( @Param('id') participantId: number, @Res() res: Response) {
    const participant = await this.repository.findOneById(participantId);
    return this.removeMany([participant], res);
  }

  @Delete('/many')
  @EmptyResultCode(200)
  @UseBefore(RequireRoleOrganizer)
  removeMany( @Body() participant: TournamentParticipant[], @Res() res: Response) {
    return this.repository.remove(participant)
      .catch(err => {
        Logger.log.error(err);
        return { code: err.code, message: err.message };
      });
  }
}
