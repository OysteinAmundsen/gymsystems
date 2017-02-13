import { Component, OnInit } from '@angular/core';
import { ITeam } from 'app/api/model/ITeam';
import { TeamsService } from 'app/api/teams.service';

@Component({
  selector: 'app-configure-teams',
  templateUrl: './configure-teams.component.html',
  styleUrls: ['./configure-teams.component.scss']
})
export class ConfigureTeamsComponent implements OnInit {
  teamList: ITeam[] = [];

  _selected: ITeam;
  get selected() { return this._selected; }
  set selected(team: ITeam) {
    this._selected = team;
  }

  constructor(private teamService: TeamsService) {
    this.loadTeams();
  }

  ngOnInit() {
  }

  loadTeams() {
    this.teamService.all().subscribe(teams => this.teamList = teams);
  }

  addTeam() {
    const team = <ITeam>{
      id: null, name: null, description: null
    };
    this.teamList.push(team);
    this.selected = team;
  }

  onChange() {
    this.select(null);
    this.loadTeams();
  }

  select(team: ITeam) {
    this.selected = team;
  }
}
