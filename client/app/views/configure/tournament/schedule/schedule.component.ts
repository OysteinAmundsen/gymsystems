import { Component, OnDestroy, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';

import * as moment from 'moment';

import { TeamsService, ScheduleService } from 'app/services/api';
import { ITeam } from 'app/services/model/ITeam';
import { IDiscipline } from 'app/services/model/IDiscipline';
import { IDivision } from 'app/services/model/IDivision';
import { ITeamInDiscipline } from 'app/services/model/ITeamInDiscipline';
import { DivisionType } from 'app/services/model/DivisionType';
import { Classes } from 'app/services/model/Classes';
import { ParticipationType } from 'app/services/model/ParticipationType';
import { ITournament } from 'app/services/model/ITournament';
import { TournamentEditorComponent } from '../tournament-editor/tournament-editor.component';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit, OnDestroy {
  tournament: ITournament;
  schedule: ITeamInDiscipline[] = [];
  teams: ITeam[] = [];
  disciplines: IDiscipline[];
  classes = Classes;
  participationTypes = ParticipationType;
  dragulaSubscription;
  isDirty = false;

  constructor(
    private parent: TournamentEditorComponent,
    private teamService: TeamsService,
    private scheduleService: ScheduleService,
    private dragulaService: DragulaService) { }

  ngOnInit() {
    this.parent.tournamentSubject.subscribe(tournament => {
      this.tournament = tournament;
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
    });
  }

  ngOnDestroy() {
    this.dragulaSubscription.unsubscribe();
  }

  loadSchedule() {
    this.teamService.getByTournament(this.tournament.id).subscribe(teams => this.teams = teams);
    this.scheduleService.getByTournament(this.tournament.id).subscribe(schedule => {
      this.schedule = schedule;
    });
  }

  saveSchedule() {
    this.scheduleService.saveAll(this.schedule).subscribe(result => {
      this.isDirty = false;
      this.loadSchedule();
    });
  }

  deleteParticipant(participant: ITeamInDiscipline) {
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
      this.scheduleService.deleteAll(this.tournament.id).subscribe(result => this.loadSchedule());
    } else {
      this.loadSchedule();
    }
  }

  startTime(participant: ITeamInDiscipline) {
    let time: moment.Moment = this.scheduleService.calculateStartTime(this.tournament, participant);
    if (time) { return time.format('HH:mm'); }
    return '<span class="warning">ERR</span>';
  }

  isNewDay(participant: ITeamInDiscipline) {
    const nextParticipant = this.schedule.find(s => s.startNumber === participant.startNumber + 1);
    if (nextParticipant) {
      const thisTime = this.scheduleService.calculateStartTime(this.tournament, participant);
      const nextTime = this.scheduleService.calculateStartTime(this.tournament, nextParticipant);
      if (thisTime && nextTime) {
        const difference = moment.duration(nextTime.startOf('day').diff(thisTime.startOf('day'))).asDays();
        return (difference >= 1);
      }
    }
    return false;
  }

  division(team: ITeam) { return this.teamService.getDivisionName(team); }

  stringHash(participant: ITeamInDiscipline): string {
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
    const schedule: ITeamInDiscipline[] = [];
    const tournament = this.tournament;
    divisions.forEach(div => {            // For each division...
      const teamsInDivision = this.teams.filter(t => this.division(t) === div);
      teamsInDivision.forEach(team => {   // ...and each team in division
        team.disciplines.forEach(dis => { // ...and each discipline, create a participant object
          if (disciplines.findIndex(d => d.id === dis.id) < 0) { disciplines.push(dis); }

          const participant = <ITeamInDiscipline>{ discipline: dis, team: team, tournament: tournament, type: ParticipationType.Live };
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
   * Manually reorder (using answer in http://stackoverflow.com/questions/43627465/javascript-sorting-algorithm#answer-43629921)
   */
  sortSchedule(schedule: ITeamInDiscipline[]) {
    const result = [];

    while (schedule.length) {
      // Filter by classes first
      let scheduleByClass = schedule.filter(s => s.team.class === Classes.National);
      if (!scheduleByClass.length) { scheduleByClass = schedule.filter(s => s.team.class === Classes.TeamGym); }
      schedule = schedule.filter(s => !scheduleByClass.includes(s)); // Remove from original array

      while(scheduleByClass.length) {
        const currDivision = this.division(scheduleByClass[0].team);

        // Then find all in the same division
        const scheduleByDivision = scheduleByClass.filter(s => this.division(s.team) === currDivision);
        scheduleByClass = scheduleByClass.filter(s => !scheduleByDivision.includes(s)); // Remove from class filtered array

        let index = 0;
        let entry = scheduleByDivision[0];
        while (scheduleByDivision.length) {     // Loop over division schedule
          result.push(entry);                   // Push previous entry
          scheduleByDivision.splice(index, 1);  // Remove previous entry from original data

          // Get next entry which is not the same team, and has the next discipline in the sortorder index
          index = scheduleByDivision.findIndex(e => {
            return e.team.id != entry.team.id && e.discipline.sortOrder == ((entry.discipline.sortOrder + 1) % 3);
          });
          index = index == -1 ? 0 : index;

          // Check if index of next entry is found. If not, default to first remaining entry.
          entry = scheduleByDivision[index];
        }
      }
    }

    // Set start number
    let startNo = 0;
    result.forEach(s => s.startNumber = startNo++);
    return result;
  }
}
