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

@Injectable()
export class TeamService {
  localCache: { [id: string]: Team[] } = {};
  localCahcePromise: { [id: string]: Promise<Team[]> } = {};
  cacheCreation: moment.Moment;

  constructor(
    @InjectRepository(Team) private readonly teamRepository: Repository<Team>,
    private readonly divisionService: DivisionService,
    @Inject('PubSubInstance') private readonly pubSub: PubSub
  ) { }


  async save(team: TeamDto): Promise<Team> {
    if (team.id) {
      const entity = await this.teamRepository.findOne({ id: team.id });
      team = Object.assign(entity, team);
    }
    const result = await this.teamRepository.save(<Team>team);
    if (result) {
      this.localCahcePromise = {};
      this.localCache = {};
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
    if (result.affected > 0) {
      this.localCahcePromise = {};
      this.localCache = {};
      this.pubSub.publish('teamDeleted', { teamId: id });
    }
    return result.affected > 0;
  }

  async findOneById(id: number, tournamentId?: number): Promise<Team> {
    return tournamentId
      // tslint:disable-next-line:triple-equals
      ? (await this.findByTournamentId(tournamentId)).find(t => t.id == id)
      : this.teamRepository.findOne({ where: { id: id }, relations: ['disciplines', 'media'], cache: Config.QueryCache });
  }

  async findOneByIdWithTournament(id: number): Promise<Team> {
    return this.teamRepository.findOne({ where: { id: id }, relations: ['tournament'] });
  }

  findByTournamentId(id: number): Promise<Team[]> {
    if (this.localCahcePromise['t' + id] == null || !this.cacheCreation || this.cacheCreation.add(1, 'minutes').isBefore(moment())) {
      this.cacheCreation = moment();
      this.localCahcePromise['t' + id] = this.teamRepository
        .find({ where: { tournamentId: id }, cache: Config.QueryCache, relations: ['disciplines', 'media'] })
        .then(teams => (this.localCache['t' + id] = teams));
    }
    return this.localCahcePromise['t' + id];
  }

  findByTournament(tournament: Tournament): Promise<Team[]> {
    return this.findByTournamentId(tournament.id);
  }

  findByClubId(id: number): Promise<Team[]> {
    if (this.localCahcePromise['c' + id] == null || !this.cacheCreation || this.cacheCreation.add(1, 'minutes').isBefore(moment())) {
      this.cacheCreation = moment();
      this.localCahcePromise['c' + id] = this.teamRepository
        .find({ where: { clubId: id }, cache: Config.QueryCache, relations: ['disciplines', 'media'] })
        .then(teams => (this.localCache['c' + id] = teams));
    }
    return this.localCahcePromise['c' + id];
  }
  findByClub(club: Club): Promise<Team[]> {
    return this.findByClubId(club.id);
  }

  async findByClubAndTournament(clubId: number, tournamentId: number): Promise<Team[]> {
    return (await this.findByClubId(clubId)).filter(c => c.tournamentId === tournamentId);
  }

  findByDiscipline(discipline: Discipline): Promise<Team[]> {
    if (this.localCahcePromise['dis' + discipline.id] == null || !this.cacheCreation || this.cacheCreation.add(1, 'minutes').isBefore(moment())) {
      this.cacheCreation = moment();
      this.localCahcePromise['dis' + discipline.id] = this.teamRepository
        .find({ where: { disciplines: [discipline] }, cache: Config.QueryCache, relations: ['disciplines', 'media'] })
        .then(teams => (this.localCache['dis' + discipline.id] = teams));
    }
    return this.localCahcePromise['dis' + discipline.id];
  }

  findByDivision(division: Division): Promise<Team[]> {
    if (this.localCahcePromise['div' + division.id] == null || !this.cacheCreation || this.cacheCreation.add(1, 'minutes').isBefore(moment())) {
      this.cacheCreation = moment();
      this.localCahcePromise['div' + division.id] = this.teamRepository
        .createQueryBuilder('team')
        .leftJoin('team_divisions_division_id', 'tddid', 'team.id = tddid.teamId')
        .where('tddid.divisionId = :divisionId', { divisionId: division.id })
        .cache(Config.QueryCache)
        .getMany()
        .then(teams => (this.localCache['div' + division.id] = teams));
    }
    return this.localCahcePromise['div' + division.id];
  }

  findByGymnast(gymnast: Gymnast): Promise<Team[]> {
    if (this.localCahcePromise['gym' + gymnast.id] == null || !this.cacheCreation || this.cacheCreation.add(1, 'minutes').isBefore(moment())) {
      this.cacheCreation = moment();
      this.localCahcePromise['gym' + gymnast.id] = this.teamRepository.createQueryBuilder('team')
        .leftJoinAndSelect('team.gymnasts', 'gymnasts')
        .where('team.clubId = :clubId', { clubId: gymnast.clubId })
        .andWhere('gymnasts.id = :gymnastId', { gymnastId: gymnast.id })
        .cache(Config.QueryCache)
        .getMany()
        .then(teams => (this.localCache['gym' + gymnast.id] = teams));
    }
    return this.localCahcePromise['gym' + gymnast.id];
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
