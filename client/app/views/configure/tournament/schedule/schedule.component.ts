import { Component, OnInit } from '@angular/core';

import { TournamentService, TeamsService, DisciplineService, DivisionService, ScheduleService } from 'app/api';
import { ITeam } from 'app/api/model/ITeam';
import { IDiscipline } from 'app/api/model/IDiscipline';
import { IDivision } from 'app/api/model/IDivision';
import { ITournamentParticipant } from 'app/api/model/ITournamentParticipant';
import { DivisionType } from 'app/api/model/DivisionType';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  schedule: ITournamentParticipant[];

  constructor(
    private divisionService: DivisionService,
    private disciplineService: DisciplineService,
    private teamService: TeamsService,
    private scheduleService: ScheduleService,
    private tournamentService: TournamentService) { }

  ngOnInit() {
    this.loadSchedule();
  }

  loadSchedule() {
    const tournamentId = this.tournamentService.selectedId;
    this.scheduleService.getByTournament(tournamentId).subscribe(schedule => {
      this.schedule = schedule;
      this.calculateSchedule(); // Calculate missing items
    });
  }

  calculateSchedule() {
    const me = this;
    const tournamentId = this.tournamentService.selectedId;
    this.teamService.getByTournament(tournamentId).subscribe(teams => {
      let disciplines = [];
      const divisions = [];
      teams.forEach(team => {
        disciplines = disciplines.concat(team.disciplines.filter(d => disciplines.findIndex(ed => ed.id === d.id) < 0));

        const ageDiv = team.divisions.find(d => d.type === DivisionType.Age);
        const genderDiv = team.divisions.find(d => d.type === DivisionType.Gender);
        const divisionName = genderDiv.name + ' ' + ageDiv.name;
        if (divisions.indexOf(divisionName) < 0) {
          divisions.push(divisionName);
        }
      });
    });
  }

  saveSchedule() {
    this.loadSchedule();
  }

  division(team: ITeam) {
    const ageDiv = team.divisions.find(d => d.type === DivisionType.Age);
    const genderDiv = team.divisions.find(d => d.type === DivisionType.Gender);
    return genderDiv.name + ' ' + ageDiv.name;
  }
}
