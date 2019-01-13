import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';

import { ConfigurationService } from 'app/shared/services/api';
import { IDiscipline, IScoreGroup, Operation } from 'app/model';
import { GraphService } from 'app/shared/services/graph.service';

@Component({
  selector: 'app-score-system',
  templateUrl: './score-system.component.html',
  styleUrls: ['./score-system.component.scss']
})
export class ScoreSystemComponent implements OnInit {
  @Input() discipline: IDiscipline;
  @Input() standalone = false;
  @Output() editModeChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() scoreGroupList: IScoreGroup[] = [];
  @Output() scoreGroupListChanged = new EventEmitter<IScoreGroup[]>();
  scoreGroupQuery = `{
    id,
    name,
    type,
    operation,
    max,
    min,
    judges{sortNumber,judge{id,name}},
    judgeCount
  }`;

  defaultScoreGroups: IScoreGroup[];

  _selected: IScoreGroup;
  get selected() { return this._selected; }
  set selected(scoreGroup: IScoreGroup) {
    this._selected = scoreGroup;
    this.editModeChanged.emit(this._selected != null);
  }
  get canAddDefaults() { return this.findMissingDefaults().length; }

  constructor(private graph: GraphService, private configService: ConfigurationService) { }

  ngOnInit() {
    this.configService.getByname('defaultValues').subscribe(config => this.defaultScoreGroups = config.value.scoreGroup);

    // Setup scoregroup list either from given Input, or from given discipline
    this.loadScoreGroups();
  }

  loadScoreGroups() {
    if (this.discipline) {
      this.graph.getData(`{
        getScoreGroups(disciplineId:${this.discipline.id})${this.scoreGroupQuery}}`).subscribe(res => this.scoreGroupList = res.getScoreGroups);
      // this.scoreService.getByDiscipline(this.discipline.id).subscribe(scoreGroups => this.scoreGroupList = scoreGroups);
    }
    this.scoreGroupListChanged.emit(this.scoreGroupList);
  }

  addScoreGroup() {
    const scoreGroup = <IScoreGroup>(this.standalone
      ? { name: null, type: null, max: 5, min: 0, operation: Operation.Addition }
      : { id: null, name: null, type: null, max: 5, min: 0, operation: Operation.Addition, disciplineId: this.discipline.id, judges: [] }
    );
    this.scoreGroupList.push(scoreGroup);
    this.selected = scoreGroup;
    this.scoreGroupListChanged.emit(this.scoreGroupList);
  }

  addDefaults() {
    if (this.discipline && this.defaultScoreGroups) {
      const scoreGroupList = this.findMissingDefaults().map(group => {
        group.discipline = this.discipline;
        return group;
      });
      this.graph.saveData('ScoreGroup', scoreGroupList, this.scoreGroupQuery).subscribe(res => this.scoreGroupList = res.saveScoreGroups);
      // this.scoreService.saveAll(scoreGroupList).subscribe(result => this.loadScoreGroups());
    }
  }

  findMissingDefaults() {
    if (this.discipline && this.defaultScoreGroups && this.defaultScoreGroups.length) {
      return this.defaultScoreGroups.filter(def => this.scoreGroupList.findIndex(d => d.name === def.name) < 0);
    }
    return [];
  }

  onChange(values) {
    if (values !== 'DELETED') {
      Object.keys(this.selected).forEach(k => this.selected[k] = values[k]);
    } else {
      this.scoreGroupList.splice(this.scoreGroupList.findIndex(d => d.type === this.selected.type), 1);
    }
    this.select(null);
    this.loadScoreGroups();
  }

  select(scoreGroup: IScoreGroup) {
    this.selected = scoreGroup;
  }

  @HostListener('keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.key === '+' || evt.key === 'NumpadAdd') {
      this.addScoreGroup();
    }
  }
}
