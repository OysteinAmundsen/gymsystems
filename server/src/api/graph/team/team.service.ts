import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';

import { TeamDto } from './dto/team.dto';
import { Config } from '../../common/config';
import { Team } from './team.model';
import { Tournament } from '../tournament/tournament.model';
import { Club } from '../club/club.model';
import { Discipline } from '../discipline/discipline.model';
import { Division, DivisionType } from '../division/division.model';
import { Gymnast } from '../gymnast/gymnast.model';
import { PubSub } from 'graphql-subscriptions';
import { DivisionService } from '../division/division.service';
import { plainToClass } from 'class-transformer';

@Injectable()
export class TeamService {
  localCache: { [id: string]: Team[] } = {};
  localCachePromise: { [id: string]: Promise<Team[]> } = {};
  cacheCreation: moment.Moment;

  constructor(
    @InjectRepository(Team) private readonly teamRepository: Repository<Team>,
    private readonly divisionService: DivisionService,
    @Inject('PubSubInstance') private readonly pubSub: PubSub
  ) { }

  invalidateCache(type?: string) {
    if (type) {
      delete this.localCachePromise[type];
      delete this.localCache[type];
    } else {
      this.localCachePromise = {};
      this.localCache = {};
    }
  }

  async save(team: TeamDto): Promise<Team> {
    if (team.id) {
      const entity = await this.teamRepository.findOne({ id: team.id });
      team = Object.assign(entity, team);
    }
    const result = await this.teamRepository.save(plainToClass(Team, team));
    this.invalidateCache();
    this.divisionService.invalidateCache(); // Because divisionCache is joined with teams
    if (result) {
      this.pubSub.publish(team.id ? 'teamModified' : 'teamCreated', { team: result });
    }
    // Remove relations from returned entity to allow a full reload
    delete result.club;
    delete result.tournament;
    delete result.disciplines;
    delete result.divisions;
    delete result.gymnasts;
    delete result.media;
    return result;
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.teamRepository.delete({ id: id });
    this.invalidateCache();
    if (result.raw.affectedRows > 0) {
      this.pubSub.publish('teamDeleted', { teamId: id });
    }
    return result.raw.affectedRows > 0;
  }

  async findOneById(id: number, tournamentId?: number): Promise<Team> {
    return tournamentId
      // tslint:disable-next-line:triple-equals
      ? (await this.findByTournamentId(tournamentId)).find(t => t.id == id)
      : this.teamRepository.findOne({ where: { id: id }, relations: ['disciplines', 'media'] });
  }

  async findOneByIdWithTournament(id: number): Promise<Team> {
    return this.teamRepository.findOne({ where: { id: id }, relations: ['tournament'] });
  }

  findByTournamentId(id: number): Promise<Team[]> {
    if (this.localCachePromise['t' + id] == null || !this.cacheCreation || this.cacheCreation.add(1, 'minutes').isBefore(moment())) {
      this.cacheCreation = moment();
      this.localCachePromise['t' + id] = this.teamRepository
        .find({ where: { tournamentId: id }, relations: ['disciplines', 'media'] })
        .then(teams => (this.localCache['t' + id] = teams));
    }
    return this.localCachePromise['t' + id];
  }

  findByTournament(tournament: Tournament): Promise<Team[]> {
    return this.findByTournamentId(tournament.id);
  }

  findByClubId(id: number): Promise<Team[]> {
    if (this.localCachePromise['c' + id] == null || !this.cacheCreation || this.cacheCreation.add(1, 'minutes').isBefore(moment())) {
      this.cacheCreation = moment();
      this.localCachePromise['c' + id] = this.teamRepository
        .find({ where: { clubId: id }, relations: ['disciplines', 'media'] })
        .then(teams => (this.localCache['c' + id] = teams));
    }
    return this.localCachePromise['c' + id];
  }
  findByClub(club: Club): Promise<Team[]> {
    return this.findByClubId(club.id);
  }

  async findByClubAndTournament(clubId: number, tournamentId: number): Promise<Team[]> {
    return (await this.findByClubId(clubId)).filter(c => c.tournamentId === tournamentId);
  }

  findByDiscipline(discipline: Discipline): Promise<Team[]> {
    if (this.localCachePromise['dis' + discipline.id] == null || !this.cacheCreation || this.cacheCreation.add(1, 'minutes').isBefore(moment())) {
      this.cacheCreation = moment();
      this.localCachePromise['dis' + discipline.id] = this.teamRepository
        .find({ where: { disciplines: [discipline] }, relations: ['disciplines', 'media'] })
        .then(teams => (this.localCache['dis' + discipline.id] = teams));
    }
    return this.localCachePromise['dis' + discipline.id];
  }

  findByDivision(division: Division): Promise<Team[]> {
    if (this.localCachePromise['div' + division.id] == null || !this.cacheCreation || this.cacheCreation.add(1, 'minutes').isBefore(moment())) {
      this.cacheCreation = moment();
      this.localCachePromise['div' + division.id] = this.teamRepository
        .createQueryBuilder('team')
        .leftJoin('team_divisions_division_id', 'tddid', 'team.id = tddid.teamId')
        .where('tddid.divisionId = :divisionId', { divisionId: division.id })
        .getMany()
        .then(teams => (this.localCache['div' + division.id] = teams));
    }
    return this.localCachePromise['div' + division.id];
  }

  findByGymnast(gymnast: Gymnast): Promise<Team[]> {
    if (this.localCachePromise['gym' + gymnast.id] == null || !this.cacheCreation || this.cacheCreation.add(1, 'minutes').isBefore(moment())) {
      this.cacheCreation = moment();
      this.localCachePromise['gym' + gymnast.id] = this.teamRepository.createQueryBuilder('team')
        .leftJoinAndSelect('team.gymnasts', 'gymnasts')
        .where('team.clubId = :clubId', { clubId: gymnast.clubId })
        .andWhere('gymnasts.id = :gymnastId', { gymnastId: gymnast.id })
        .getMany()
        .then(teams => (this.localCache['gym' + gymnast.id] = teams));
    }
    return this.localCachePromise['gym' + gymnast.id];
  }

  findAll(): Promise<Team[]> {
    return this.teamRepository.find();
  }

  async getDivisions(team: Team): Promise<Division[]> {
    if (!team.divisions) {
      team.divisions = await this.divisionService.findByTeam(team);
    }
    return team.divisions;
  }

  async getDivisionName(team: Team): Promise<string> {
    const divisions = await this.getDivisions(team);
    const ageDiv = divisions.find(d => d.type === DivisionType.Age);
    const genderDiv = divisions.find(d => d.type === DivisionType.Gender);
    return `${(genderDiv ? genderDiv.name : '')} ${(ageDiv ? ageDiv.name : '')}`;
  }

}
