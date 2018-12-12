import { TestBed, inject } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import * as moment from 'moment';

import { ScheduleService } from './schedule.service';
import { ConfigurationService } from '../configuration/configuration.service';
import { ConfigurationServiceStub } from '../configuration/configuration.service.stub';
import { ITeamInDiscipline } from '../../../model';
import { generateParticipants } from './schedule.service.stub';
import { dummyTournament } from '../tournament/tournament.service.stub';

describe('services.api:ScheduleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ScheduleService,
        {provide: ConfigurationService, useClass: ConfigurationServiceStub}
      ]
    });
  });

  it('should be created', inject([ScheduleService], (service: ScheduleService) => {
    expect(service).toBeTruthy();
  }));

  /**
   * The stringhash is built up of the following:
   * - participant.team.name
   * - genderDiv.name
   * - ageDiv.name
   * - participant.discipline.name
   * - participant.type
   */
  it('should create a unique string hash of the team', inject([ScheduleService], (service: ScheduleService) => {
    const participant: ITeamInDiscipline = generateParticipants(1)[0];
    expect(service.stringHash(participant)).toEqual('testHerrer_RekruttFrittstående2');
  }));

  /**
   * The `startTime` method used the `calculateStartTime`, and returns either a cached string, or
   * the results formatted as 'HH:mm'.
   */
  it('can create a formatted timestamp of the calculated start time', inject([ScheduleService], (service: ScheduleService) => {
    const participant = generateParticipants(1)[0];
    expect(service.startTime(dummyTournament, participant)).toEqual('12:00');
  }));

  /**
   * For a tournament spanning two days, where each day has only one hour of competition time,
   * there should be room for 60 / 4 = less than 15 participants each day. The switch should therefore be
   * between 14 and 15.
   */
  it('should detect if the start number should be a day swith or not', inject([ScheduleService], (service: ScheduleService) => {
    const schedule = generateParticipants(20);
    expect(service.isNewDay(dummyTournament, schedule, schedule[14])).toBeTruthy(service.startTime(dummyTournament, schedule[14]));
    expect(service.isNewDay(dummyTournament, schedule, schedule[15])).toBeFalsy(service.startTime(dummyTournament, schedule[15]));
  }));

  // TODO: Create tests for these
  // recalculateStartTime(tournament: ITournament, schedule: ITeamInDiscipline[], resetSort = true, resetStart = false): ITeamInDiscipline[] {

});
