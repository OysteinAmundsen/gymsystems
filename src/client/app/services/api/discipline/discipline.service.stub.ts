import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of} from 'rxjs';

import { IDiscipline, ITournament, IJudgeInScoreGroup } from 'app/model';
import { DisciplineService } from './discipline.service';
import { defaultJudge } from '../judge/judge.service.stub';
import { compositionScoreGroup, defaultScoreGroups } from '../scoregroup/scoregroup.service.stub';

export const dummyDiscipline = <IDiscipline>{
  id: 0,
  name: '',
  sortOrder: 0,
  tournament: <ITournament>{},
  scoreGroups: defaultScoreGroups
};

@Injectable()
export class DisciplineServiceStub extends DisciplineService {
  discipline: IDiscipline = dummyDiscipline;
  disciplines: IDiscipline[] = [
    this.discipline
  ];
  constructor(http: HttpClient) {
    super(http);
  }

  all(): Observable<IDiscipline[]> {
    return of(this.disciplines);
  }

  getByTournament(id: number): Observable<IDiscipline[]> {
    return of(this.disciplines);
  }

  getById(id: number): Observable<IDiscipline> {
    return of(this.discipline);
  }

  save(discipline: IDiscipline) {
    return of(this.discipline);
  }

  saveAll(disciplines: IDiscipline[]) {
    return of(this.disciplines);
  }

  delete(discipline: IDiscipline) {
    return of(null);
  }
}
