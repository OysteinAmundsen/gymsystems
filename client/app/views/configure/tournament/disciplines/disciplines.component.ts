import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { TournamentService, DisciplineService, ScoreService, ConfigurationService } from 'app/api';
import { IScoreGroup } from 'app/api/model/IScoreGroup';
import { IDiscipline } from 'app/api/model/IDiscipline';

@Component({
  selector: 'app-disciplines',
  templateUrl: './disciplines.component.html',
  styleUrls: ['./disciplines.component.scss']
})
export class DisciplinesComponent implements OnInit {
  get tournament() { return this.tournamentService.selected; };
  disciplineList: IDiscipline[] = [];
  defaultScoreGroups: IScoreGroup[];
  defaultDisciplines: IDiscipline[];

  _selected: IDiscipline;
  get selected() { return this._selected; }
  set selected(discipline: IDiscipline) { this._selected = discipline; }
  get canAddDefaults() { return this.findMissingDefaults().length; }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tournamentService: TournamentService,
    private disciplineService: DisciplineService,
    private scoreService: ScoreService,
    private configService: ConfigurationService) { }

  ngOnInit() {
    this.configService.getByname('defaultValues').subscribe(config => {
      this.defaultDisciplines = config.value.discipline;
      this.defaultScoreGroups = config.value.scoreGroup;
    });
    this.loadDisciplines();
  }

  loadDisciplines() {
    this.route.parent.parent.params.subscribe((params: any) => {
      if (params.id) {
        this.disciplineService.getByTournament(params.id).subscribe(disciplines => this.disciplineList = disciplines);
      }
    });
  }

  addDefaults() {
    if (this.defaultDisciplines) {
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
    if (this.defaultDisciplines && this.defaultDisciplines.length) {
      return this.defaultDisciplines.filter(def => this.disciplineList.findIndex(d => d.name === def.name) < 0);
    }
    return [];
  }

  onChange() {
    this.select(null);
    this.loadDisciplines();
  }

  select(discipline: IDiscipline) {
    this.selected = discipline;
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === 187) {
      this.router.navigate(['./add'], { relativeTo: this.route });
    }
  }
}
