import { Component, HostListener, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DragulaService } from 'ng2-dragula';

import { TournamentService, DisciplineService, ScoreGroupService, ConfigurationService } from 'app/services/api';
import { IScoreGroup } from 'app/services/model/IScoreGroup';
import { IDiscipline } from 'app/services/model/IDiscipline';

@Component({
  selector: 'app-disciplines',
  templateUrl: './disciplines.component.html',
  styleUrls: ['./disciplines.component.scss']
})
export class DisciplinesComponent implements OnInit, OnDestroy {
  get tournament() { return this.tournamentService.selected; };
  get tournamentId() { return this.tournamentService.selectedId; }
  @Input() standalone = false;
  @Input() disciplineList: IDiscipline[] = [];
  @Output() disciplineListchanged = new EventEmitter<IDiscipline[]>();
  defaultScoreGroups: IScoreGroup[];
  defaultDisciplines: IDiscipline[];

  _selected: IDiscipline;
  get selected() { return this._selected; }
  set selected(discipline: IDiscipline) { this._selected = discipline; }
  get canAddDefaults() { return this.findMissingDefaults().length; }

  dragulaSubscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tournamentService: TournamentService,
    private disciplineService: DisciplineService,
    private scoreService: ScoreGroupService,
    private configService: ConfigurationService,
    private dragulaService: DragulaService) { }

  ngOnInit() {
    this.configService.getByname('defaultValues').subscribe(config => {
      this.defaultDisciplines = config.value.discipline;
      this.defaultScoreGroups = config.value.scoreGroup;
    });
    this.loadDisciplines();

    if (!this.dragulaService.find('discipline-bag')) {
      this.dragulaService.setOptions('discipline-bag', { invalid: (el: HTMLElement, handle) => el.classList.contains('static') });
    }
    this.dragulaSubscription = this.dragulaService.dropModel.subscribe((value) => {
      setTimeout(() => { // Sometimes dragula is not finished syncing model
        this.disciplineList.forEach((div, idx) => div.sortOrder = idx);
        this.saveDisciplines();
      });
    });
  }

  ngOnDestroy() {
    this.dragulaSubscription.unsubscribe();
  }

  loadDisciplines() {
    if (this.tournamentId) {
      this.disciplineService.getByTournament(this.tournamentId).subscribe(disciplines => {
        disciplines.forEach(d => d.tournament = this.tournament);
        this.disciplineList = disciplines;
      });
    }
    this.disciplineListchanged.emit(this.disciplineList);
  }

  saveDisciplines() {
    if (this.tournamentId) {
      this.disciplineService.saveAll(this.disciplineList).subscribe(() => this.loadDisciplines());
    }
    this.disciplineListchanged.emit(this.disciplineList);
  }

  addDiscipline() {
    const discipline: IDiscipline = <IDiscipline> (this.standalone ? { name: null, sortOrder: null } : {
      id: null, name: null, teams: [], tournament: this.tournament, sortOrder: null
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
        group.tournament = this.tournament;
        return group;
      });
      this.disciplineService.saveAll(disciplineList).subscribe(result => {
        // Add default score groups
        let scoreGroups = [];
        result.forEach(d => {
          const defaults = JSON.parse(JSON.stringify(this.defaultScoreGroups));
          scoreGroups = scoreGroups.concat(defaults.map(group => {
            group.discipline = JSON.parse(JSON.stringify(d));
            return group;
          }));
        });
        this.scoreService.saveAll(scoreGroups).subscribe(() => this.loadDisciplines());
      });
    }
  }

  findMissingDefaults() {
    if (this.tournamentId && this.defaultDisciplines && this.defaultDisciplines.length) {
      return this.defaultDisciplines.filter(def => this.disciplineList.findIndex(d => d.name === def.name) < 0);
    }
    return [];
  }

  onChange($event) {
    if ($event !== 'DELETED') {
      Object.keys(this.selected).forEach(k => this.selected[k] = $event[k]);
    } else {
      this.disciplineList.splice(this.disciplineList.findIndex(d => d.sortOrder === this.selected.sortOrder), 1);
    }
    this.select(null);
    this.loadDisciplines();
  }

  select(discipline: IDiscipline) {
    this.selected = discipline;
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === 187 || evt.keyCode === 107) {
      this.addDiscipline();
    }
  }
}
