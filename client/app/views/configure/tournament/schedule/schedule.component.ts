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
  schedule: ITournamentParticipant[] = [];
  teams: ITeam[] = [];

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
    this.teamService.getByTournament(tournamentId).subscribe(teams => this.teams = teams);
    this.scheduleService.getByTournament(tournamentId).subscribe(schedule => {
      this.schedule = schedule;
    });
  }

  calculateSchedule() {
    this.schedule = this.schedule.concat(this.calculateMissing());
  }

  haveMissing() {
    return this.calculateMissing().length;
  }

  // Get disciplines being competed in
  private calculateDisciplines() {
    let disciplines = [];
    this.teams.forEach(team => {
      disciplines = disciplines.concat(team.disciplines.filter(d => disciplines.findIndex(ed => ed.id === d.id) < 0));
    });
    return disciplines;
  }

  // Get divisions being competed in
  private calculateDivisions() {
    const divisions = [];
    this.teams.forEach(team => {
      const divisionName = this.division(team);
      if (divisions.indexOf(divisionName) < 0) { divisions.push(divisionName); }
    });
    return divisions;
  }

  calculateMissing() {
    const disciplines = this.calculateDisciplines();
    const divisions = this.calculateDivisions();
    const schedule: ITournamentParticipant[] = [];
    const tournament = this.tournamentService.selected;
    let startNo = 1;
    divisions.forEach(div => {
      const teamsInDivision = this.teams.filter(t => this.division(t) === div);
      let uniqueDisciplines = [];
      teamsInDivision.forEach(t => uniqueDisciplines = uniqueDisciplines.concat(t.disciplines.filter(d => uniqueDisciplines.findIndex(ed => ed.id === d.id) < 0)));
      const expectedScheduleLength = uniqueDisciplines.length + teamsInDivision.length;
      for (let j = 0; j < expectedScheduleLength; j++) {
        teamsInDivision.forEach(participant => {
          disciplines.forEach(dis => {
            // Find team competing in this discipline, which is not allready added and is not
            // equal to the last team added - unless there's only one team competing in this division
            const team = teamsInDivision.find(t => {
              const hasDiscipline = t.disciplines.findIndex(d => d.id === dis.id) > -1;
              const isAdded = schedule.findIndex(s => s.team.id === t.id && s.discipline.id === dis.id) > -1;
              const lastTeam = teamsInDivision.length > 1 && schedule[schedule.length - 1] ? schedule[schedule.length - 1].team : null;
              return hasDiscipline && !isAdded && (lastTeam ? t.id !== lastTeam.id : true);
            });
            if (team) { // One more team is found for the given criteria. Add it to the schedule
              const participant = <ITournamentParticipant>{
                startNumber: startNo++, // This implies sort order
                discipline: dis,
                team: team,
                tournament: tournament
              };
              if (this.schedule.findIndex(s => this.stringHash(s) === this.stringHash(participant)) < 0) {
                // Only push if participant is not allready registerred
                schedule.push(participant);
              }
            }
          });
        });
      }
    });
    return schedule;
  }

  saveSchedule() {
    this.scheduleService.saveAll(this.schedule).subscribe(result => {
      this.loadSchedule();
    });
  }

  deleteParticipant(participant: ITournamentParticipant) {
    if (participant.id) {
      this.scheduleService.delete(participant).subscribe(result => this.loadSchedule());
    } else {
      const hash = this.stringHash(participant);
      this.schedule.splice(this.schedule.findIndex(s => this.stringHash(s) === hash), 1);
    }
  }

  deleteAll() {
    const schedules = this.schedule.filter(s => s.id != null);
    if (schedules.length) {
      this.scheduleService.deleteAll(schedules).subscribe(result => this.loadSchedule());
    } else {
      this.loadSchedule();
    }
  }

  division(team: ITeam) {
    const ageDiv = team.divisions.find(d => d.type === DivisionType.Age);
    const genderDiv = team.divisions.find(d => d.type === DivisionType.Gender);
    return genderDiv.name + ' ' + ageDiv.name;
  }

  sortSchedule() {

  }

  stringHash(participant: ITournamentParticipant): string {
    return (participant.team.name + this.division(participant.team) + participant.discipline.name).replace(' ', '_');
  }

  hasChanges() {
    return this.schedule.some(s => !s.id);
  }
}
