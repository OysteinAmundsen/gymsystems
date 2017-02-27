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
      // .where('tournament_participant.tournament=:id', { id: id })
      .innerJoinAndSelect('tournament_participant.tournament', 'tournament')
      .leftJoinAndSelect('tournament_participant.discipline', 'discipline')
      .innerJoinAndSelect('tournament_participant.team', 'team')
      .leftJoinAndSelect('team.divisions', 'division')
      .leftJoinAndSelect('tournament_participant.scores', 'scores')
      .orderBy('tournament_participant.startNumber', 'ASC')
      .getMany();
  }

  @Get('/:id')
  @EmptyResultCode(404)
  get( @Param('id') id: number): Promise<TournamentParticipant> {
    return this.repository.createQueryBuilder('tournament_participant')
      .where('tournament_participant.id=:id', { id: id })
      .innerJoinAndSelect('tournament_participant.tournament', 'tournament')
      .leftJoinAndSelect('tournament_participant.discipline', 'discipline')
      .innerJoinAndSelect('tournament_participant.team', 'team')
      .leftJoinAndSelect('team.divisions', 'division')
      .leftJoinAndSelect('tournament_participant.scores', 'scores')
      .getOne();
  }

  @Post()
  create( @EntityFromBody() division: TournamentParticipant, @Res() res: Response) {
    return this.createMany([division], res);
  }

  @Post()
  createMany( @EntityFromBody() divisions: TournamentParticipant[], @Res() res: Response) {
    return this.repository.persist(divisions)
      .then(persisted => res.send(persisted))
      .catch(err => {
        Logger.log.error(err);
      });
  }

  @Put('/:id')
  update( @Param('id') id: number, @EntityFromBody() division: TournamentParticipant, @Res() res: Response) {
    return this.createMany([division], res);
  }

  @Delete('/:id')
  remove( @EntityFromParam('id') division: TournamentParticipant, @Res() res: Response) {
    return this.removeMany([division], res);
  }

  @Delete('/many')
  @EmptyResultCode(200)
  removeMany( @Body() divisions: TournamentParticipant[], @Res() res: Response) {
    return this.repository.remove(divisions)
      .then(result => res.send(result))
      .catch(err => {
        Logger.log.error(err);
      });
  }
}
