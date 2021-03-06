import { Component, HostListener, OnDestroy, OnInit, Input, EventEmitter, Output, Injector, OnChanges, SimpleChanges } from '@angular/core';
// import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';

import { ConfigurationService } from 'app/shared/services/api';
import { IDivision, DivisionType } from 'app/model';
import { TournamentEditorComponent } from 'app/views/configure/tournament/tournament-editor/tournament-editor.component';
import { GraphService } from 'app/shared/services/graph.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-divisions',
  templateUrl: './divisions.component.html',
  styleUrls: ['./divisions.component.scss']
})
export class DivisionsComponent implements OnInit, OnDestroy, OnChanges {
  static divisionsQuery = `{
    id,
    name,
    sortOrder,
    type,
    min,
    max,
    scorable
  }`;

  @Input() standalone = false;
  @Input() divisions: IDivision[] = [];
  tournamentId: number;


  @Output() divisionsChanged = new EventEmitter<IDivision[]>();
  ageDivisions: IDivision[];
  genderDivisions: IDivision[];
  defaultDivisions: IDivision[];
  selected: IDivision;
  isAdding = false;

  get canAddDefaults() { return this.findMissingDefaults().length; }

  subscriptions: Subscription[] = [];

  constructor(
    private graph: GraphService,
    private configService: ConfigurationService,
    private injector: Injector) { }

  async ngOnInit() {
    const defaults = await this.configService.getByname('defaultValues').toPromise();
    this.defaultDivisions = (typeof defaults.value === 'string' ? JSON.parse(defaults.value) : defaults.value).division;
    if (!this.standalone) {
      this.tournamentId = this.injector.get(TournamentEditorComponent).tournamentId;
      this.loadDivisions();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.divisions && changes.divisions.currentValue) {
      this.divisionReceived(this.divisions);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s ? s.unsubscribe() : null);
  }

  drop(event: CdkDragDrop<IDivision[]>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    event.container.data.forEach((div, idx) => (div.sortOrder = idx));
    this.saveDivisions();
  }

  async saveDivisions(): Promise<IDivision[]> {
    this.divisions = [...this.genderDivisions, ...this.ageDivisions];
    if (this.tournamentId) {
      const result = (await this.graph.saveData('Divisions', this.divisions, DivisionsComponent.divisionsQuery).toPromise());
      this.divisions = result.saveDivisions;
    }
    this.divisionsChanged.emit(this.divisions);
    return this.divisions;
  }

  loadDivisions() {
    if (this.tournamentId) {
      this.graph.getData(`{getDivisions(tournamentId:${this.tournamentId})${DivisionsComponent.divisionsQuery}}`).subscribe(res => this.divisionReceived(res.getDivisions));
    } else if (this.divisions) {
      this.divisionReceived(this.divisions);
    }
    this.divisionsChanged.emit(this.divisions);
  }

  divisionReceived(divisions) {
    this.divisions = divisions;
    this.genderDivisions = this.divisions.filter(d => d.type === DivisionType.Gender);
    this.ageDivisions = this.divisions.filter(d => d.type === DivisionType.Age);
  }

  addDivision() {
    this.isAdding = true;
    this.selected = <IDivision>(this.standalone ? { name: null, sortOrder: null, type: null } : {
      id: null, name: null, sortOrder: null, type: null, tournamentId: this.tournamentId
    });
  }

  addDefaults() {
    if (this.tournamentId && this.defaultDivisions) {
      const divisions = this.findMissingDefaults().map(group => {
        group.tournamentId = this.tournamentId;
        return group;
      });
      this.graph.saveData('Divisions', divisions, DivisionsComponent.divisionsQuery).subscribe(result => this.loadDivisions());
    }
  }

  findMissingDefaults() {
    if (this.tournamentId && this.defaultDivisions && this.defaultDivisions.length) {
      return this.defaultDivisions.filter(def => this.divisions.findIndex(d => d.name === def.name) < 0);
    }
    return [];
  }

  select(division: IDivision) {
    if (division) {
      division.tournamentId = this.tournamentId;
    }
    this.selected = division;
  }

  onChange($event) {
    let divisions: IDivision[] = []; // Get currently selected division bin
    if ($event !== 'DELETED') {
      // Copy properties over to selected object
      Object.keys($event).forEach(k => this.selected[k] = $event[k]);

      switch ($event.type) {
        case DivisionType.Gender: divisions = this.genderDivisions; break;
        case DivisionType.Age: divisions = this.ageDivisions; break;

      }
      if (this.isAdding) {
        // Add element to given bin
        divisions.push($event);
      }
    } else {
      // $event === 'DELETED', Remove element from given bin
      divisions.splice(divisions.findIndex(d => d.sortOrder === this.selected.sortOrder), 1);
    }

    this.isAdding = false;
    this.divisions = this.ageDivisions.concat(this.genderDivisions); // Re-create divisions from the two bins
    this.select(null);
    this.loadDivisions();
  }

  @HostListener('keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.key === '+' || evt.key === 'NumpadAdd') {
      this.addDivision();
    }
  }
}
