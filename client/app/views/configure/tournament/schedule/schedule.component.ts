import { Component, OnDestroy, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';

import { TournamentService, TeamsService, DisciplineService, DivisionService, ScheduleService } from 'app/services/api';
import { ITeam } from 'app/services/model/ITeam';
import { IDiscipline } from 'app/services/model/IDiscipline';
import { IDivision } from 'app/services/model/IDivision';
import { ITournamentParticipant } from 'app/services/model/ITournamentParticipant';
import { DivisionType } from 'app/services/model/DivisionType';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit, OnDestroy {
  schedule: ITournamentParticipant[] = [];
  teams: ITeam[] = [];
  disciplines: IDiscipline[];
  dragulaSubscription;
  isDirty = false;

  constructor(
    private divisionService: DivisionService,
    private disciplineService: DisciplineService,
    private teamService: TeamsService,
    private scheduleService: ScheduleService,
    private tournamentService: TournamentService,
    private dragulaService: DragulaService) { }

  ngOnInit() {
    this.loadSchedule();
    if (!this.dragulaService.find('schedule-bag')) {
      this.dragulaService.setOptions('schedule-bag', { invalid: (el: HTMLElement, handle) => el.classList.contains('static') });
    }
    this.dragulaSubscription = this.dragulaService.dropModel.subscribe((value) => {
      setTimeout(() => { // Sometimes dragula is not finished syncing model
        this.schedule.forEach((div, idx) => div.startNumber = idx);
        this.isDirty = true;
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
    const disciplines: IDiscipline[] = [];
    const schedule: ITournamentParticipant[] = [];
    const tournament = this.tournamentService.selected;
    divisions.forEach(div => {            // For each division...
      const teamsInDivision = this.teams.filter(t => this.division(t) === div);
      teamsInDivision.forEach(team => {   // ...and each team in division
        team.disciplines.forEach(dis => { // ...and each discipline, create a participant object
          if (disciplines.findIndex(d => d.id === dis.id) < 0) { disciplines.push(dis); }

          const participant = <ITournamentParticipant>{ discipline: dis, team: team, tournament: tournament };
          if (this.schedule.findIndex(s => this.stringHash(s) === this.stringHash(participant)) < 0) {
            // Only push if participant is not allready registerred
            schedule.push(participant);
          }
        });
      });
    });
    this.disciplines = disciplines.sort((a,b) => a.sortOrder < b.sortOrder ? -1 : 1 );
    return schedule;
  }

  saveSchedule() {
    this.scheduleService.saveAll(this.schedule).subscribe(result => {
      this.isDirty = false;
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

  /**
   * Sort `a` according to `b` in the schedule, by the following rules:
   *
   *  1) Order by division first
   *  2) Must follow discipline areas in sequence. Each row must have the next sequence of discipline.
   *  3) Must not have the same team in two consequative rows.
   */
  sortSchedule(schedule: ITournamentParticipant[]) {
    const ageDivision = (team): IDivision => team.divisions.find(d => d.type === DivisionType.Age);
    const genderDivision = (team): IDivision => team.divisions.find(d => d.type === DivisionType.Gender);

    schedule = schedule
      .sort((a: ITournamentParticipant, b: ITournamentParticipant) => {
        // Sort by age division
        const aAgeDiv = ageDivision(a.team).sortOrder;
        const bAgeDiv = ageDivision(b.team).sortOrder;
        if (aAgeDiv != bAgeDiv) { return (aAgeDiv < bAgeDiv) ? -1 : 1; }

        // Sort by gender division
        const aGenDiv = genderDivision(a.team).sortOrder;
        const bGenDiv = genderDivision(b.team).sortOrder;
        if (aGenDiv != bGenDiv) { return (aGenDiv < bGenDiv) ? -1 : 1; }

        // Sort by team
        if (a.team.id != b.team.id) return a.team.id < b.team.id ? -1 : 1;

        // Sort by discipline
        const aDis = a.discipline.sortOrder;
        const bDis = b.discipline.sortOrder;
        if (aDis != bDis) { return aDis < bDis ? -1 : 1; }

        return 0; // Will probably never reach here
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
    return this.schedule.some(s => !s.id) || this.isDirty;
  }
}
