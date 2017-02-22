import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { TournamentService, DivisionService } from 'app/api';
import { ITournament } from 'app/api/model/ITournament';
import { IDivision } from 'app/api/model/IDivision';

import { TournamentEditorComponent } from '../tournament-editor/tournament-editor.component';

@Component({
  selector: 'app-divisions',
  templateUrl: './divisions.component.html',
  styleUrls: ['./divisions.component.scss']
})
export class DivisionsComponent implements OnInit {
  divisionList: IDivision[] = [];
  get tournament() { return this.tournamentService.selected; };

  _selected: IDivision;
  get selected() { return this._selected; }
  set selected(division: IDivision) { this._selected = division; }

  constructor(private router: Router, private route: ActivatedRoute, private tournamentService: TournamentService, private divisionService: DivisionService) { }

  ngOnInit() {
    this.loadDivisions();
  }

  loadDivisions() {
    this.route.parent.params.subscribe((params: any) => {
      if (params.id) {
        this.divisionService.getByTournament(params.id).subscribe(divisions => this.divisionList = divisions);
      }
    });
  }

  addDivision() {
    const division = <IDivision>{
      id: null, name: null, tournament: this.tournament
    };
    this.divisionList.push(division);
    this.selected = division;
  }

  onChange() {
    this.select(null);
    this.loadDivisions();
  }

  select(division: IDivision) {
    this.selected = division;
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === 187) {
      this.addDivision();
    }
  }
}
