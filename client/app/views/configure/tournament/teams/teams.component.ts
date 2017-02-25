import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { TournamentService, TeamsService } from 'app/api';
import { DivisionType } from 'app/api/model/DivisionType';
import { ITeam } from 'app/api/model/ITeam';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {
  teamList: ITeam[] = [];

  _selected: ITeam;
  get selected() { return this._selected; }
  set selected(team: ITeam) {
    this._selected = team;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tournamentService: TournamentService,
    private teamService: TeamsService) {
  }

  ngOnInit() {
    this.loadTeams();
  }

  loadTeams() {
    this.teamService.getByTournament(this.tournamentService.selectedId).subscribe(teams => this.teamList = teams);
  }

  divisions(team: ITeam) {
    const ageDiv = team.divisions.find(d => d.type === DivisionType.Age);
    const genderDiv = team.divisions.find(d => d.type === DivisionType.Gender);
    return genderDiv.name + ' ' + ageDiv.name;
  }

  disciplines(team: ITeam) {
    return team.disciplines.map(d => d.name).join(', ');
  }

  addTeam() {
    const team = <ITeam>{
      id: null, name: null, divisions: [], disciplines: [], tournament: this.tournamentService.selected
    };
    this.teamList.push(team);
    this.selected = team;
  }

  onChange() {
    this.select(null);
    this.loadTeams();
  }

  select(team: ITeam) {
    if (team && !team.tournament) {
      team.tournament = this.tournamentService.selected;
    }
    this.selected = team;
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === 187) {
      this.addTeam();
    }
  }

}
