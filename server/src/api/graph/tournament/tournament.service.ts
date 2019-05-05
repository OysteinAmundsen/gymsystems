import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../user/user.model';
import { Tournament } from './tournament.model';
import { TournamentDto } from './dto/tournament.dto';
import { Club } from '../club/club.model';
import { Config } from '../../common/config';
import { Venue } from '../venue/venue.model';
import { Gymnast } from '../gymnast/gymnast.model';
import { PubSub } from 'graphql-subscriptions';
import { ScheduleService } from '../schedule/schedule.service';
import { DisciplineService } from '../discipline/discipline.service';
import { DivisionService } from '../division/division.service';
import { MediaService } from '../media/media.service';
import { ClubService } from '../club/club.service';
import { plainToClass } from 'class-transformer';

@Injectable()
export class TournamentService {
  constructor(
    @InjectRepository(Tournament) private readonly tournamentRepository: Repository<Tournament>,
    private readonly clubService: ClubService,
    private readonly mediaService: MediaService,
    private readonly scheduleService: ScheduleService,
    private readonly divisionService: DivisionService,
    private readonly disciplineService: DisciplineService,
    @Inject('PubSubInstance') private readonly pubSub: PubSub) { }

  async save(tournament: TournamentDto): Promise<Tournament> {
    const isNew = !tournament.id;
    // Make sure we have a proper club
    if (tournament.club && (tournament.club.id === null || tournament.club.id === 0) && tournament.club.name != null) {
      const club = await this.clubService.findOrCreateClub(tournament.club);
      tournament.clubId = club.id;
      tournament.club = club;
    }

    if (tournament.id) {
      const entity = await this.tournamentRepository.findOne({ id: tournament.id });
      tournament = Object.assign(entity, tournament);
    }
    const result = await this.tournamentRepository.save(plainToClass(Tournament, tournament));
    if (result) {
      // New tournament. Create defaults
      if (isNew && (await this.createDefaults(result.id))) {
        // Create media folder for this tournament
        const archiveCreated = await this.mediaService.createMediaArchive(`tournament/${result.id}`, result.endDate);
      }
      this.pubSub.publish(tournament.id ? 'tournamentModified' : 'tournamentCreated', { tournament: result });
    }
    delete result.schedule;
    delete result.teams;
    delete result.venue;
    delete result.club;
    delete result.createdBy;
    delete result.disciplines;
    delete result.divisions;
    delete result.media;
    return result;
  }

  remove(id: number): Promise<boolean> {
    return Promise.all([
      this.mediaService.removeArchive(`tournament/${id}`), // Remove media
      this.scheduleService.removeByTournament(id),         // Remove schedule
      this.divisionService.removeByTournament(id),         // Remove divisions
      this.disciplineService.removeByTournament(id)        // Remove disciplines
    ]).then(async res => {
      // Lastly remove the tournament if all above worked.
      const result = await this.tournamentRepository.delete({ id: id });
      if (result.raw.affectedRows > 0) {
        this.pubSub.publish('tournamentDeleted', { tournamentId: id });
      }
      return result.raw.affectedRows > 0;
    })
  }

  removeSchedule(id: number): boolean | PromiseLike<boolean> {
    return this.scheduleService.removeByTournament(id);
  }

  findOneById(id: number): Promise<Tournament> {
    return this.tournamentRepository.findOne({ id: id });
  }
  findByClubId(id: number): Promise<Tournament[]> {
    return this.tournamentRepository.find({ where: { clubId: id } });
  }
  findByClub(club: Club): Promise<Tournament[]> {
    return this.findByClubId(club.id);
  }
  findByUserId(id: number): Promise<Tournament[]> {
    return this.tournamentRepository.find({ where: { createdById: id } });
  }
  findByUser(user: User): Promise<Tournament[]> {
    return this.findByUserId(user.id);
  }
  findByVenueId(id: number): Promise<Tournament[]> {
    return this.tournamentRepository.find({ where: { venueId: id } });
  }
  findByVenue(venue: Venue): Promise<Tournament[]> {
    return this.findByVenueId(venue.id);
  }
  findBanquetByGymnast(gymnast: Gymnast): Promise<Tournament[]> {
    return this.tournamentRepository.find({ where: { banquet: [gymnast] } });
  }
  findTransportByGymnast(gymnast: Gymnast): Promise<Tournament[]> {
    return this.tournamentRepository.find({ where: { transport: [gymnast] } });
  }
  findLodgingByGymnast(gymnast: Gymnast): Promise<Tournament[]> {
    return this.tournamentRepository.find({ where: { lodging: [gymnast] } });
  }
  findAll(): Promise<Tournament[]> {
    return this.tournamentRepository.find({ order: { startDate: 'DESC' } });
  }

  /**
   *
   */
  createDefaults(tournamentId: number): Promise<Boolean> {
    return Promise.all([
      this.divisionService.createDefaults(tournamentId),
      this.disciplineService.createDefaults(tournamentId)
    ])
      .then(val => val[0] && val[1])
      .catch(err => false);
  }
}