import { Component, OnDestroy, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';

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
export class ScheduleComponent implements OnInit, OnDestroy {
  schedule: ITournamentParticipant[] = [];
  teams: ITeam[] = [];
  dragulaSubscription;

  constructor(
    private divisionService: DivisionService,
    private disciplineService: DisciplineService,
    private teamService: TeamsService,
    private scheduleService: ScheduleService,
    private tournamentService: TournamentService,
    private dragulaService: DragulaService) { }

  ngOnInit() {
    this.loadSchedule();
    this.dragulaSubscription = this.dragulaService.dropModel.subscribe((value) => {
      setTimeout(() => { // Sometimes dragula is not finished syncing model
        this.schedule.forEach((div, idx) => div.startNumber = idx);
      });
    });
  }

  ngOnDestroy() {
    this.dragulaSubscription.unsubscribe();
  }

  loadSchedule() {
    const tournamentId = this.tournamentService.selectedId;
    this.teamService.getByTournament(tournamentId).subscribe(teams => this.teams = teams);
    this.scheduleService.getByTournament(tournamentId).subscribe(schedule => {
      this.schedule = schedule;
    });
  }

  calculateSchedule() {
    this.schedule = this.sortSchedule(this.schedule.concat(this.calculateMissing()));
  }

  haveMissing() {
    return this.calculateMissing().length;
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
    const divisions = this.calculateDivisions();
    const schedule: ITournamentParticipant[] = [];
    const tournament = this.tournamentService.selected;
    divisions.forEach(div => {            // For each division...
      const teamsInDivision = this.teams.filter(t => this.division(t) === div);
      teamsInDivision.forEach(team => {   // ...and each team in division
        team.disciplines.forEach(dis => { // ...and each discipline, create a participant object
          const participant = <ITournamentParticipant>{ discipline: dis, team: team, tournament: tournament };
          if (this.schedule.findIndex(s => this.stringHash(s) === this.stringHash(participant)) < 0) {
            // Only push if participant is not allready registerred
            schedule.push(participant);
          }
        });
      });
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

  division(team: ITeam) { return this.teamService.division(team); }

  sortSchedule(schedule: ITournamentParticipant[]) {
    schedule = schedule.sort((a, b) => {
      // Sort by divisions alphabetically
      const aDivision = this.division(a.team);
      const bDivision = this.division(b.team);
      if (aDivision < bDivision) { return -1; }
      if (aDivision > bDivision) { return 1; }

      // Sort by discipline
      // if (a.discipline.sortOrder )
      return 0;
    });

    // Set start number
    let startNo = 0;
    schedule.forEach(s => s.startNumber = startNo++);
    return schedule;
  }

  stringHash(participant: ITournamentParticipant): string {
    return (participant.team.name + this.division(participant.team) + participant.discipline.name).replace(' ', '_');
  }

  hasChanges() {
    return this.schedule.some(s => !s.id);
  }
}
