import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ScoreGroupService, ConfigurationService } from 'app/api';
import { IDiscipline } from 'app/api/model/IDiscipline';
import { IScoreGroup } from 'app/api/model/IScoreGroup';
import { Operation } from 'app/api/model/Operation';

@Component({
  selector: 'app-score-system',
  templateUrl: './score-system.component.html',
  styleUrls: ['./score-system.component.scss']
})
export class ScoreSystemComponent implements OnInit {
  @Input() discipline: IDiscipline;
  @Output() editModeChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  scoreGroupList: IScoreGroup[] = [];
  defaultScoreGroups: IScoreGroup[];

  _selected: IScoreGroup;
  get selected() { return this._selected; }
  set selected(scoreGroup: IScoreGroup) {
    this._selected = scoreGroup;
    this.editModeChanged.emit(this._selected != null);
  }
  get canAddDefaults() { return this.findMissingDefaults().length; }

  constructor(private router: Router, private route: ActivatedRoute, private scoreService: ScoreGroupService, private configService: ConfigurationService) { }

  ngOnInit() {
    this.configService.getByname('defaultValues').subscribe(config => {
      this.defaultScoreGroups = config.value.scoreGroup;
    });

    // Setup scoregroup list either from given Input, or from given discipline
    this.loadScoreGroups();
  }

  loadScoreGroups() {
    this.scoreService.getByDiscipline(this.discipline.id).subscribe(scoreGroups => this.scoreGroupList = scoreGroups);
  }

  addScoreGroup() {
    const scoreGroup = <IScoreGroup>{
      id: null, name: null, type: null, judges: 1, max: 5, min: 0, operation: Operation.Addition, discipline: this.discipline
    };
    this.scoreGroupList.push(scoreGroup);
    this.selected = scoreGroup;
  }

  addDefaults() {
    if (this.defaultScoreGroups) {
      const scoreGroupList = this.findMissingDefaults().map(group => {
        group.discipline = this.discipline;
        return group;
      });
      this.scoreService.saveAll(scoreGroupList).subscribe(result => this.loadScoreGroups());
    }
  }

  findMissingDefaults() {
    if (this.defaultScoreGroups && this.defaultScoreGroups.length) {
      return this.defaultScoreGroups.filter(def => this.scoreGroupList.findIndex(d => d.name === def.name) < 0);
    }
    return [];
  }

  onChange() {
    this.select(null);
    this.loadScoreGroups();
  }

  select(scoreGroup: IScoreGroup) {
    this.selected = scoreGroup;
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === 187 || evt.keyCode === 107) {
      this.addScoreGroup();
    }
  }
}
