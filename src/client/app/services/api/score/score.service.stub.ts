import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of} from 'rxjs';

import { ScoreService } from './score.service';
import { IScore, ITeamInDiscipline } from 'app/model';

@Injectable()
export class ScoreServiceStub extends ScoreService {
  constructor(http: HttpClient) {
    super(http);
  }

  getByParticipant(participantId: number) {
    return of(null);
  }

  saveFromParticipant(participantId: number, scores: IScore[]) {
    return of(null);
  }

  removeFromParticipant(participantId: number) {
    return of(null);
  }

  rollbackToParticipant(participantId: number) {
    return of(null);
  }
}
