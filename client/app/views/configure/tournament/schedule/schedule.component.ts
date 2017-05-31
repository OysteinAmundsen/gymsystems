import { Component, OnDestroy, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';

import * as moment from 'moment';
const Moment: any = (<any>moment).default || moment;

import { TournamentService, TeamsService, DisciplineService, DivisionService, ScheduleService } from 'app/services/api';
import { ITeam } from 'app/services/model/ITeam';
import { IDiscipline } from 'app/services/model/IDiscipline';
import { IDivision } from 'app/services/model/IDivision';
import { ITournamentParticipant } from 'app/services/model/ITournamentParticipant';
import { DivisionType } from 'app/services/model/DivisionType';
import { Classes } from "app/services/model/Classes";

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit, OnDestroy {
  schedule: ITournamentParticipant[] = [];
  teams: ITeam[] = [];
  disciplines: IDiscipline[];
  classes = Classes;
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
      this.scheduleService.deleteAll(this.tournamentService.selectedId).subscribe(result => this.loadSchedule());
    } else {
      this.loadSchedule();
    }
  }

  startTime(participant: ITournamentParticipant) {
    let time: moment.Moment = this.scheduleService.calculateStartTime(this.tournamentService.selected, participant);
    if (time) { return time.format('HH:mm'); }
    return '<span class="warning">ERR</span>';
  }

  isNewDay(participant: ITournamentParticipant) {
    const nextParticipant = this.schedule.find(s => s.startNumber === participant.startNumber + 1);
    if (nextParticipant) {
      const thisTime = this.scheduleService.calculateStartTime(this.tournamentService.selected, participant);
      const nextTime = this.scheduleService.calculateStartTime(this.tournamentService.selected, nextParticipant);
      const difference = moment.duration(nextTime.diff(thisTime)).asDays();
      return (difference >= 1);
    }
    return false;
  }

  division(team: ITeam) { return this.teamService.getDivisionName(team); }

  stringHash(participant: ITournamentParticipant): string {
    return (participant.team.name + this.division(participant.team) + participant.discipline.name).replace(' ', '_');
  }

  hasChanges() {
    return this.schedule.some(s => !s.id) || this.isDirty;
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
    this.disciplines = disciplines.sort((a, b) => a.sortOrder < b.sortOrder ? -1 : 1 );
    return schedule;
  }

  /**
   * Sort `a` according to `b` in the schedule, by the following rules:
   *
   *  1) Order by division first
   *  2) Must follow discipline areas in sequence. Each row must have the next sequence of discipline.
   *  3) Must not have the same team in two consequative rows.
   *
   * http://stackoverflow.com/questions/43627465/javascript-sorting-algorithm
   */
  sortSchedule(schedule: ITournamentParticipant[]) {
    const ageDivision = (team): IDivision => team.divisions.find(d => d.type === DivisionType.Age);
    const genderDivision = (team): IDivision => team.divisions.find(d => d.type === DivisionType.Gender);

    // Provide initial sort
    schedule = schedule
      .sort((a: ITournamentParticipant, b: ITournamentParticipant) => {
        // Sort by class first
        if (a.team.class != b.team.class) { return a.team.class > b.team.class ? -1 : 1; }

        // Sort by age division
        const aAgeDiv = ageDivision(a.team).sortOrder;
        const bAgeDiv = ageDivision(b.team).sortOrder;
        if (aAgeDiv != bAgeDiv) { return (aAgeDiv < bAgeDiv) ? -1 : 1; }

        // Sort by gender division
        const aGenDiv = genderDivision(a.team).sortOrder;
        const bGenDiv = genderDivision(b.team).sortOrder;
        if (aGenDiv != bGenDiv) { return (aGenDiv < bGenDiv) ? -1 : 1; }

        return 0;
      });

    // Manually reorder (using answer in http://stackoverflow.com/questions/43627465/javascript-sorting-algorithm#answer-43629921)
    const result = [];
    while (schedule.length) {
      const currDivision = this.division(schedule[0].team);
      const scheduleByDivision = schedule.filter(s => this.division(s.team) === currDivision); // Find all in the same division
      schedule = schedule.filter(s => !scheduleByDivision.includes(s));                        // Remove from original array

      let index = 0;
      let entry = scheduleByDivision[0];
      while (scheduleByDivision.length) {     // Loop over division schedule
        result.push(entry);                   // Push previous entry
        scheduleByDivision.splice(index, 1);  // Remove previous entry from original data

        // Get next entry
        index = scheduleByDivision.findIndex(e => {
          const hasNextDiscipline = e.discipline.sortOrder == ((entry.discipline.sortOrder + 1) % 3);
          return e.team.id != entry.team.id && hasNextDiscipline;
        });

        // Check if index of next entry is found. If not, default to first remaining entry.
        index = index == -1 ? 0 : index;
        entry = scheduleByDivision[index];
      }
    }

    // Set start number
    let startNo = 0;
    result.forEach(s => s.startNumber = startNo++);
    return result;
  }
}
