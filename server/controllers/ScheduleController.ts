import { getConnectionManager, Repository } from 'typeorm';
import { JsonController, Get, Post, Put, Delete, EmptyResultCode, Body, Param, Req, Res } from 'routing-controllers';
import { EntityFromParam, EntityFromBody } from 'typeorm-routing-controllers-extensions';
import { Service } from 'typedi';

import e = require('express');
import Request = e.Request;
import Response = e.Response;

import { Logger } from '../utils/Logger';
import { TournamentParticipant } from '../model/TournamentParticipant';

/**
 *
 */
@Service()
@JsonController('/schedule')
export class ScheduleController {
  private repository: Repository<TournamentParticipant>;

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

  @Post()
  create( @EntityFromBody() participant: TournamentParticipant, @Res() res: Response) {
    return this.createMany([participant], res);
  }

  @Post()
  createMany( @EntityFromBody() participants: TournamentParticipant[], @Res() res: Response) {
    return this.repository.persist(participants)
      .catch(err => Logger.log.error(err));
  }

  @Put('/:id')
  update( @Param('id') id: number, @EntityFromBody() participant: TournamentParticipant, @Res() res: Response) {
    return this.createMany([participant], res);
  }

  @Delete('/:id')
  remove( @EntityFromParam('id') participant: TournamentParticipant, @Res() res: Response) {
    return this.removeMany([participant], res);
  }

  @Delete('/many')
  @EmptyResultCode(200)
  removeMany( @Body() participant: TournamentParticipant[], @Res() res: Response) {
    return this.repository.remove(participant)
      .catch(err => Logger.log.error(err));
  }
}
