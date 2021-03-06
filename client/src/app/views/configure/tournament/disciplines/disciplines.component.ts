import { Component, HostListener, OnDestroy, OnInit, Input, Output, EventEmitter, Injector, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';

import { ConfigurationService } from 'app/shared/services/api';
import { IScoreGroup, IDiscipline } from 'app/model';
import { TournamentEditorComponent } from 'app/views/configure/tournament/tournament-editor/tournament-editor.component';
import { GraphService } from 'app/shared/services/graph.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonService } from 'app/shared/services/common.service';

@Component({
  selector: 'app-disciplines',
  templateUrl: './disciplines.component.html',
  styleUrls: ['./disciplines.component.scss']
})
export class DisciplinesComponent implements OnInit, OnDestroy, OnChanges {
  @Input() standalone = false;
  @Input() disciplineList: IDiscipline[] = [];
  @Output() disciplineListchanged = new EventEmitter<IDiscipline[]>();

  disciplineQuery = `{
    id,
    name,
    sortOrder,
    tournamentId,
    judgesPlain{id,name}
  }`;

  defaultScoreGroups: IScoreGroup[];
  defaultDisciplines: IDiscipline[];
  selected: IDiscipline;

  tournamentId: number;

  get canAddDefaults() {
    return this.findMissingDefaults().length;
  }

  subscriptions: Subscription[] = [];

  constructor(
    private injector: Injector,
    private graph: GraphService,
    private configService: ConfigurationService
  ) { }

  ngOnInit() {
    this.configService.getByname('defaultValues').toPromise().then(config => {
      this.defaultDisciplines = config.value.discipline;
      this.defaultScoreGroups = config.value.scoreGroup;
    });
    if (!this.standalone) {
      this.tournamentId = this.injector.get(TournamentEditorComponent).tournamentId;
      this.loadDisciplines();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.disciplineList && changes.disciplineList.currentValue) { }
  }

  drop(event: CdkDragDrop<IDiscipline[]>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    this.disciplineList.forEach((div, idx) => (div.sortOrder = idx));
    this.saveDisciplines();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => (s ? s.unsubscribe() : null));
  }

  judges(discipline: IDiscipline) {
    return !discipline || !discipline.judgesPlain
      ? ['']
      : Array.from(discipline.judgesPlain.reduce((judges, judge) => {
        if (judge.name !== 'System') {
          judges.add(judge.name);
        }
        return judges;
      }, new Set<string>()));
  }

  async loadDisciplines(): Promise<IDiscipline[]> {
    if (this.tournamentId) {
      this.disciplineList = (await this.graph.getData(`{getDisciplines(tournamentId:${this.tournamentId})${this.disciplineQuery}}`).toPromise()).getDisciplines;
    }
    this.disciplineListchanged.emit(this.disciplineList);
    return this.disciplineList;
  }

  async saveDisciplines(): Promise<IDiscipline[]> {
    if (this.tournamentId) {
      const disciplineList = this.disciplineList.map(d => CommonService.omit(d, ['judgesPlain']));
      const result = (await this.graph.saveData('Disciplines', disciplineList, this.disciplineQuery).toPromise());
      this.disciplineList = result.saveDisciplines;
    }
    this.disciplineListchanged.emit(this.disciplineList);
    return this.disciplineList;
  }

  addDiscipline() {
    const discipline: IDiscipline = <IDiscipline>(this.standalone
      ? { name: null, sortOrder: null }
      : {
        id: null,
        name: null,
        teams: [],
        tournamentId: this.tournamentId,
        sortOrder: null
      });
    this.disciplineList.push(discipline);
    this.selected = discipline;
  }

  /**
   * Only available when editing tournaments. Not Advanced settings.
   */
  addDefaults() {
    if (this.tournamentId && this.defaultDisciplines) {
      const disciplineList = this.findMissingDefaults().map(group => {
        group.tournamentId = this.tournamentId;
        return group;
      });
      this.graph.saveData('Disciplines', disciplineList, `{id}`).subscribe(res => {
        // Add default score groups
        let scoreGroups = [];
        res.saveDisciplines.forEach(d => {
          const defaults = JSON.parse(JSON.stringify(this.defaultScoreGroups));
          scoreGroups = scoreGroups.concat(
            defaults.map(group => {
              group.disciplineId = d.id;
              return group;
            })
          );
        });
        this.graph.saveData('ScoreGroups', scoreGroups, '{id}').subscribe(() => this.loadDisciplines());
      });
    }
  }

  findMissingDefaults() {
    return (this.tournamentId && this.defaultDisciplines && this.defaultDisciplines.length)
      ? this.defaultDisciplines.filter(def => this.disciplineList.findIndex(d => d.name === def.name) < 0)
      : [];
  }

  onChange($event) {
    if ($event !== 'DELETED') {
      Object.keys(this.selected).forEach(k => (this.selected[k] = $event[k]));
    } else {
      this.disciplineList.splice(this.disciplineList.findIndex(d => d.sortOrder === this.selected.sortOrder), 1);
    }
    this.select(null);
    this.loadDisciplines();
  }

  select(discipline: IDiscipline) {
    this.selected = discipline;
  }

  @HostListener('keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.key === '+' || evt.key === 'NumpadAdd') {
      this.addDiscipline();
    }
  }
}
