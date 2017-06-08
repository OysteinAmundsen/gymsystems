import { getConnectionManager, Connection, Repository } from 'typeorm';
import { Body, Delete, OnUndefined, Get, JsonController, Param, Post, Put, Res, UseBefore, Req, QueryParam } from 'routing-controllers';
import { Service } from 'typedi';
import { Request, Response } from 'express';

import { RequireRole } from '../middlewares/RequireAuth';
import { Logger } from '../utils/Logger';

import { Club } from '../model/Club';
import { Role } from '../model/User';
import { ClubContestant } from "../model/ClubContestant";

/**
 *
 */
@Service()
@JsonController('/clubs')
export class ClubController {
  public repository: Repository<Club>;
  private conn: Connection;

  constructor() {
    this.conn = getConnectionManager().get();
    this.repository = this.conn.getRepository(Club);
  }

  @Get()
  all(@Req() req: Request, name?: string) {
    const n = name || req.query['name'];
    const query = this.repository.createQueryBuilder('club');
    if (n) {
      query.where('club.name like :name', {name: `%${n}%`});
    }
    return query.getMany();
  }

  @Get('/:clubId')
  @OnUndefined(404)
  get( @Param('clubId') clubId: number): Promise<Club> {
    return this.repository.findOneById(clubId);
  }

  @Post()
  create( @Body() club: Club, @Res() res: Response): Promise<Club> {
    return this.repository.persist(club)
      .catch(err => {
        Logger.log.error(err);
        return { code: err.code, message: err.message };
      });
  }

  @Put('/:clubId')
  update( @Param('clubId') clubId: number, @Body() club: Club, @Res() res: Response): Promise<Club> {
    return this.repository.persist(club)
      .catch(err => {
        Logger.log.error(err);
        return { code: err.code, message: err.message };
      });
  }

  @Delete('/:clubId')
  @UseBefore(RequireRole.get(Role.Admin))
  async remove( @Param('clubId') clubId: number, @Res() res: Response) {
    const club = await this.repository.findOneById(clubId);
    return this.repository.remove(club)
      .catch(err => Logger.log.error(err));
  }


  // Club members
  @Get('/:clubId/members')
  getMembers(@Param('clubId') clubId: number): Promise<ClubContestant[]> {
    return this.conn.getRepository(ClubContestant)
      .createQueryBuilder('contestant')
      .where('contestant.club = :id', {id: clubId})
      .getMany();
  }

  @Post('/:clubId/members')
  addMember(@Param('clubId') clubId: number, @Body() member: ClubContestant): Promise<ClubContestant> {
    return this.conn.getRepository(ClubContestant)
      .persist(member)
      .catch(err => Logger.log.error(err));
  }

  @Delete('/:clubId/members/:id')
  async removeMember(@Param('clubId') clubId: number, @Param('id') memberId: number) {
    const memberRepository = this.conn.getRepository(ClubContestant);
    const member = await memberRepository.findOneById(memberId);
    return memberRepository
      .remove(member)
      .catch(err => Logger.log.error(err));
  }
}
