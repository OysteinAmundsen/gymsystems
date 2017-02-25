import { Component, OnInit } from '@angular/core';

import { TournamentService, TeamsService, DisciplineService, DivisionService } from 'app/api';
import { ITeam } from 'app/api/model/ITeam';
import { IDiscipline } from 'app/api/model/IDiscipline';
import { IDivision } from 'app/api/model/IDivision';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  divisions: IDivision[] = [];
  disciplines: IDiscipline[] = [];
  teams: ITeam[] = [];

  constructor(
    private divisionService: DivisionService,
    private disciplineService: DisciplineService,
    private teamService: TeamsService,
    private tournamentService: TournamentService) { }

  ngOnInit() {
    const tournamentId = this.tournamentService.selectedId;
    const me = this;
    this.teamService.getByTournament(tournamentId).subscribe(teams => {
      me.teams = teams;
      teams.forEach(team => {
        me.disciplines = me.disciplines.concat(team.disciplines.filter(d => me.disciplines.findIndex(ed => ed.id === d.id) < 0));
        me.divisions = me.divisions.concat(team.divisions.filter(d => me.divisions.findIndex(ed => ed.id === d.id) < 0));
      });
    });
  }
}
