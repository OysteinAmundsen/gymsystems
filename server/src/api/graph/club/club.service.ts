import { Injectable, HttpService, Inject, ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PubSub } from 'graphql-subscriptions';
import moment, { Moment } from 'moment';

import { ClubDto } from './dto/club.dto';
import { Club } from './club.model';
import { Config } from '../../common/config';
import { Role } from '../user/user.model';
import { RequestContext } from '../../common/middleware/request-context.model';

@Injectable()
export class ClubService {
  localCache: Club[] = [];
  localCahcePromise: Promise<Club[]>;
  cacheCreation: Moment;

  static enforceSame(clubId: number): void {
    const me = RequestContext.currentUser();
    if (me && me.role < Role.Admin && me.clubId !== clubId) {
      throw new ForbiddenException('You do not belong to this club');
    }
  }

  constructor(
    @InjectRepository(Club) private readonly clubRepository: Repository<Club>,
    @Inject('PubSubInstance') private readonly pubSub: PubSub,
    private readonly http: HttpService
  ) { }

  /**
   * Hold all clubs in-memory.
   */
  private async getAllFromCache(): Promise<Club[]> {
    if (this.localCahcePromise == null || !this.cacheCreation || this.cacheCreation.add(10, 'minutes').isBefore(moment())) {
      this.cacheCreation = moment();
      this.localCahcePromise = this.clubRepository.createQueryBuilder()
        .cache(Config.QueryCache)
        .getMany()
        .then(groups => (this.localCache = groups));
    }
    return this.localCahcePromise;
  }

  /**
   *
   * @param club The club data to persist
   */
  async save(club: ClubDto): Promise<Club> {
    if (club.id) {
      const entity = await this.clubRepository.findOne({ id: club.id });
      club = Object.assign(entity, club);
    }
    const result = await this.clubRepository.save(<Club>club);
    if (result) {
      delete this.localCahcePromise; // Force refresh cache
      this.pubSub.publish(club.id ? 'clubModified' : 'clubCreated', { club: result });
    }
    return result;
  }

  /**
   *
   * @param id The id of the club to remove
   */
  async remove(id: number): Promise<boolean> {
    const result = await this.clubRepository.delete({ id: id });
    if (result.affected > 0) {
      delete this.localCahcePromise; // Force refresh cache
      this.pubSub.publish('clubDeleted', { clubId: id });
    }
    return result.affected > 0;
  }

  /**
   *
   * @param id The id of the club to find
   */
  async findOneById(id: number): Promise<Club> {
    const clubs = await this.getAllFromCache();
    return clubs.find(s => s.id === +id);
  }

  /**
   *
   * @param example the club data to find or create
   */
  async findOrCreateClub(example: ClubDto): Promise<Club> {
    let club: Club;
    if (example.id) {
      // User has requested an id. Prioritize looking up by this
      club = await this.findOneById(+example.id);
      if (club) {
        example.name = club.name;
      }
    }

    if (!club && example.name) {
      // No id found, or not requested. Try by name.
      delete example.id;
      const clubs = await this.findByFilter(example.name);
      if (clubs.length > 1) {
        // Multiple clubs found using this example. Cannot return or create anything unique.
        throw new Error('No unique club found');
      } else if (clubs.length === 0) {
        // Nothing found in db or brreg. Create
        club = await this.save(example);
      } else if (clubs[0] && !clubs[0].id) {
        // A club is found in brreg, but not registerred in our system. Create it based on brreg data.
        club = await this.save(clubs[0]);
      } else if (clubs[0] && clubs[0].id) {
        // A Club is allready registerred with this name. Return it.
        club = clubs[0];
      } else {
        // None of the above(?) - Just die.
        throw new Error('Could not create club');
      }
    }
    return club;
  }

  /**
   *
   * @param name Lookup in our own registry for a club by this name
   */
  async findOwnClubByName(name: string): Promise<Club[]> {
    return (await this.getAllFromCache()).filter(s => s.name.toLowerCase().indexOf(name.toLowerCase()) > -1);
  }

  /**
   *
   * @param name Find multiple in both brreg and our registry by this name
   */
  async findByFilter(name: string): Promise<Club[]> {
    const dbResult = await this.findOwnClubByName(name);
    const brregResult = name.length > 1 ? await this.brregLookup(name) : [];
    const result = dbResult.concat(brregResult.reduce((allClubs, club) => allClubs.concat(...(dbResult.findIndex(d => d.name === club.name) < 0 ? [club] : [])), []));
    return result;
  }

  /**
   * Find all registerred clubs
   */
  findAll() {
    return this.getAllFromCache();
  }

  /**
   * Serialize an object into a url query string
   *
   * @param obj the object to serialize
   */
  private serializeQueryParams(obj: any): string {
    const params: any = [];
    Object.keys(obj).forEach(key => params.push(`${key}=${obj[key]}`));
    return params.join('&');
  }

  /**
   * Lookup a club name in data.brreg.no
   *
   * @param name the name to lookup
   */
  async brregLookup(name: string): Promise<ClubDto[]> {
    // Fail fast if this is test or name is not given or name is too short
    // if (!Container.get(GymServer).isTest || !name || name.length < 2) { return Promise.resolve([]); }

    const url = `http://data.brreg.no/enhetsregisteret/enhet.json`;
    const query = this.serializeQueryParams({
      page: 0,
      size: 10,
      $filter: encodeURIComponent(`startswith(navn,'${name}') and startswith(naeringskode/kode,'93.120')`)
    });
    // Log.log.debug(`Requesting: ${url}?${query}`);
    const response = await this.http.get(`${url}?${query}`).toPromise();
    if (response.status !== 200) {
      throw new Error(`Error looking up brreg: ${response.status} - ${response.statusText}`);
    } else {
      return response.data.data
        ? <ClubDto[]>(response.data.data.map((r: any) => <ClubDto>{ id: null, name: r.navn }))
        : [];
    }
  }
}
