import { TestBed } from "@angular/core/testing";
import { ConfigurationService } from "../configuration/configuration.service";
import { ParticipationType, ITournament, ITeamInDiscipline } from "app/model";
import { ScheduleService } from "./schedule.service";

import { of } from 'rxjs';
import * as moment from 'moment';

describe("shared.services.ScheduleService", () => {
  let service: ScheduleService;

  const iTournamentStub = <ITournament><unknown>{
    times: [{ day: 0, train: "09,10", time: "11,12" }],
    startDate: moment().startOf('day').toDate()
  };

  beforeEach(() => {
    const config = [
      { name: 'scheduleExecutionTime', value: 5 },
      { name: 'scheduleTrainingTime', value: 3 }
    ]
    const configurationServiceStub = {
      getByname: name => of(config.find(c => c.name === name))
    };

    TestBed.configureTestingModule({
      providers: [
        ScheduleService,
        { provide: ConfigurationService, useValue: configurationServiceStub }
      ]
    });
    service = TestBed.get(ScheduleService);
  });

  it("can load instance", () => {
    expect(service).toBeTruthy();
  });

  it("url defaults to: /api/schedule", () => {
    expect(service.url).toEqual("/api/schedule");
  });

  describe('startTime()', () => {
    it('returns immediately if a startTime is present', () => {
      const participantStub = <ITeamInDiscipline>{ startTime: new Date(), id: 1 };
      const result = service.startTime(iTournamentStub, participantStub, [participantStub]);
      expect(result).toEqual(participantStub.startTime);
    });

    it('returns immediately if a calculatedStartTime is present', () => {
      const participantStub = <ITeamInDiscipline>{ startTime: null, calculatedStartTime: moment(), id: 1 };
      const result = service.startTime(iTournamentStub, participantStub, [participantStub]);
      expect(result).toEqual(participantStub.calculatedStartTime.toDate());
    });

    it('calculates correct startTime for fisrt participant', () => {
      const now = new Date();
      const participantStub = <ITeamInDiscipline>{ startTime: null, calculatedStartTime: null, id: 1, type: ParticipationType.Live };
      const result = service.startTime(iTournamentStub, participantStub, [participantStub]);
      expect(result).toEqual(moment(iTournamentStub.startDate).hour(11).toDate());
    });

    it('calculates correct startTime for second participant', () => {
      const now = new Date();
      const lastParticipant = <ITeamInDiscipline>{ startTime: now, calculatedStartTime: null, id: 1, type: ParticipationType.Live };
      const participantStub = <ITeamInDiscipline>{ startTime: null, calculatedStartTime: null, id: 2, type: ParticipationType.Live };
      const result = service.startTime(iTournamentStub, participantStub, [lastParticipant, participantStub]);
      expect(result).toEqual(moment(now).add(5, 'minutes').toDate());
    });
  });
});
