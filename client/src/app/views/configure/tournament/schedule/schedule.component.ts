import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
// import { DragulaService } from 'ng2-dragula';

import * as moment from 'moment';

import { ITeam } from 'app/model/ITeam';
import { IDiscipline } from 'app/model/IDiscipline';
import { ITeamInDiscipline } from 'app/model/ITeamInDiscipline';
import { Classes } from 'app/model/Classes';
import { ParticipationType } from 'app/model/ParticipationType';
import { TournamentEditorComponent } from '../tournament-editor/tournament-editor.component';
import { TranslateService } from '@ngx-translate/core';
import { Role } from 'app/model';
import { GraphService } from 'app/shared/services/graph.service';
import { CommonService } from 'app/shared/services/common.service';
import { ScheduleService } from 'app/shared/services/api/schedule/schedule.service';
import { FormControl } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

/**
 *
 */
@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit, OnDestroy {
  scheduleQuery = `{
    id,
    sortNumber,
    startNumber,
    markDeleted,
    startTime,
    endTime,
    publishTime,
    type,
    tournamentId,
    team{id,name,class},
    disciplineId,
    disciplineName,
    disciplineSortOrder,
    divisionName,
    scorable
  }`;
  tournamentId: number;
  schedule: ITeamInDiscipline[] = [];
  teams: ITeam[] = [];
  disciplines: IDiscipline[];
  classes = Classes;
  participationTypes = ParticipationType;
  isDirty = false;
  shouldCalculateTraining = new FormControl(false);
  editing: number;

  constructor(
    private parent: TournamentEditorComponent,
    private graph: GraphService,
    private scheduleService: ScheduleService,
    private common: CommonService,
    private translate: TranslateService) { }

  /**
   *
   */
  ngOnInit() {
    this.tournamentId = this.parent.tournamentId;
    this.loadSchedule();
  }

  /**
   *
   */
  ngOnDestroy() {
  }

  @HostListener('keyup', ['$event'])
  onKey($event: KeyboardEvent) {
    if ($event.key === 'Escape' || $event.key === 'Esc') {
      this.setEdit(null);
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.schedule, event.previousIndex, event.currentIndex);
    this.recalculateStartTime();
    this.isDirty = true;
  }

  /**
   *
   */
  loadSchedule() {
    this.graph.getData(`{
      getTeams(tournamentId:${this.tournamentId}){id,class,name,divisionName,disciplines{id,name,sortOrder}},
      getSchedule(tournamentId:${this.tournamentId})${this.scheduleQuery}
    }`).subscribe(res => {
      this.teams = res.getTeams;
      this.schedule = res.getSchedule;
    })
  }

  mapToScheduleInput(s) {
    return {
      id: s.id,
      disciplineId: s.disciplineId,
      teamId: s.teamId || s.team.id,
      tournamentId: s.tournamentId,
      type: s.type,
      sortNumber: s.sortNumber,
      startNumber: s.startNumber,
      markDeleted: s.markDeleted || false
    };
  }

  /**
   *
   */
  saveSchedule() {
    // Remap to graphql input data
    const schedule = this.schedule.map(s => this.mapToScheduleInput(s));
    // Save schedule
    this.graph.saveData('Schedule', schedule, this.scheduleQuery).subscribe(result => {
      this.isDirty = false;
      this.schedule = result.saveSchedule;
    });
  }

  /**
   *
   */
  toggleStrikeParticipant(participant: ITeamInDiscipline, force?: boolean) {
    participant.markDeleted = force ? force : !participant.markDeleted;
    this.graph.saveData('Participant', this.mapToScheduleInput(participant), this.scheduleQuery).subscribe(result => this.loadSchedule());
  }

  /**
   *
   */
  deleteParticipant(participant: ITeamInDiscipline) {
    if (participant.id) {
      if (this.parent.hasStarted) {
        this.toggleStrikeParticipant(participant, true);
      } else {
        this.schedule.splice(this.schedule.findIndex(s => s.id === participant.id), 1);
        this.graph.deleteData('Participant', participant.id).subscribe(result => this.loadSchedule());
      }
    } else {
      const hash = this.stringHash(participant);
      this.schedule.splice(this.schedule.findIndex(s => this.stringHash(s) === hash), 1);
      this.recalculateStartTime();
    }
  }

  recalculateStartTime() {
    this.schedule.forEach((s, idx) => {
      s.sortNumber = idx;
      if (!this.parent.hasStarted || !s.startNumber) { s.startNumber = idx; }
      delete s.calculatedStartTime;
    });
  }

  /**
   *
   */
  canDeleteAll() {
    const now = moment();
    return this.schedule.length && (this.parent.user.role >= Role.Admin || !this.parent.hasStarted);
  }

  /**
   *
   */
  deleteAll() {
    const schedules = this.schedule.filter(s => s.id != null);
    if (schedules.length) {
      this.common.confirm().subscribe(shouldRemove => {
        if (shouldRemove) {
          this.graph.deleteData('TournamentSchedule', this.tournamentId).subscribe(result => this.schedule = []);
        }
      });
    } else {
      this.loadSchedule();
    }
  }

  /**
   *
   */
  setEdit(item: ITeamInDiscipline, $event?: MouseEvent) {
    if (!item || item.startTime != null) { return; }
    if ($event) {
      $event.preventDefault();
      $event.stopPropagation();
    }
    this.editing = item.id;
  }

  /**
   *
   */
  editChanged(item: ITeamInDiscipline, startNo: number) {
    this.setEdit(null);
    this.schedule.splice(startNo - 1, 0, this.schedule.splice(this.schedule.findIndex(i => i.id === item.id), 1)[0]);
    this.recalculateStartTime();
    this.isDirty = true;
  }

  @HostListener('click', ['$event'])
  onClick($event) {
    if ($event.target.nodeName !== 'INPUT') {
      this.setEdit(null);
    }
  }

  /**
   *
   */
  title(participant: ITeamInDiscipline) {
    if (participant.startTime) {
      return this.translate.instant('This team cannot be moved or deleted. Performance has allready started.');
    }
    return '';
  }

  /**
   *
   */
  startTime(participant: ITeamInDiscipline) {
    if (!this.parent.tournament.id) { return false; }
    return this.scheduleService.startTime(this.parent.tournament, participant, this.schedule);
  }

  /**
   *
   */
  isNewDay(participant: ITeamInDiscipline) {
    if (!this.parent.tournament.id) { return false; }
    return this.scheduleService.isNewDay(this.parent.tournament, participant, this.schedule);
  }

  /**
   *
   */
  stringHash(participant: ITeamInDiscipline): string {
    return CommonService.stringHash(participant);
  }

  /**
   *
   */
  hasChanges() {
    return this.schedule && this.schedule.some(s => !s.id) || this.isDirty;
  }

  /**
   *
   */
  calculateSchedule() {
    this.schedule = this.schedule.concat(this.sortSchedule(this.calculateMissing()));
    this.recalculateStartTime();
  }

  /**
   *
   */
  haveMissing() {
    return this.calculateMissing().length;
  }

  /**
   * Will return only the `ItemInDiscipline`s missing from the
   * current schedule. This will return an unordered array.
   */
  calculateMissing(): ITeamInDiscipline[] {
    const disciplines: Set<IDiscipline> = new Set();
    const schedule: ITeamInDiscipline[] = [];
    const divisions = this.teams.reduce((prev, team) => prev.add(team.divisionName), new Set<string>());
    const types = [ParticipationType.Live];
    if (this.shouldCalculateTraining.value) { types.unshift(ParticipationType.Training); }
    types.forEach(type => {
      divisions.forEach(div => {            // For each division...
        const teamsInDivision = this.teams.filter(t => t.divisionName === div);
        teamsInDivision.forEach(team => {   // ...and each team in division
          team.disciplines.forEach(dis => { // ...and each discipline, create a participant object
            disciplines.add(dis);

            const participant = <ITeamInDiscipline>{ id: null, disciplineId: dis.id, disciplineName: dis.name, disciplineSortOrder: dis.sortOrder, divisionName: team.divisionName, teamId: team.id, team: team, tournamentId: this.tournamentId, type: type };
            if (this.schedule.findIndex(s => this.stringHash(s) === this.stringHash(participant)) < 0) {
              // Only push if participant is not allready registerred
              schedule.push(participant);
            }
          });
        });
      });
    });
    this.disciplines = Array.from(disciplines).sort((a, b) => a.sortOrder < b.sortOrder ? -1 : 1);
    return schedule;
  }

  /**
   * Sort the schedule by the following rules:
   *
   *  1) Order by division first
   *  2) Must follow discipline areas in sequence. Each row must have the next sequence of discipline.
   *  3) Must not have the same team in two consequative rows.
   *
   * http://stackoverflow.com/questions/43627465/javascript-sorting-algorithm
   * Manually reorder (using answer in http://stackoverflow.com/questions/43627465/javascript-sorting-algorithm#answer-43629921)
   */
  sortSchedule(schedule: ITeamInDiscipline[]): ITeamInDiscipline[] {
    const result: ITeamInDiscipline[] = [];

    [ParticipationType.Training, ParticipationType.Live].forEach(type => {
      let currentSchedule = schedule.filter(s => s.type === type);
      while (currentSchedule.length > 0) {
        // Filter by classes first if we are in Live participation type
        let scheduleByClass = [].concat(currentSchedule);
        if (type === ParticipationType.Live) {
          scheduleByClass = currentSchedule.filter(s => s.team.class === Classes.National);
          if (!scheduleByClass.length) { scheduleByClass = currentSchedule.filter(s => s.team.class === Classes.TeamGym); }
        }
        currentSchedule = currentSchedule.filter(s => !scheduleByClass.includes(s)); // Remove from original array

        while (scheduleByClass.length) {
          const currDivision = scheduleByClass[0].divisionName;

          // Then find all in the same division
          const scheduleByDivision = scheduleByClass.filter(s => s.divisionName === currDivision);
          scheduleByClass = scheduleByClass.filter(s => !scheduleByDivision.includes(s)); // Remove from class filtered array

          let index = 0;
          let entry = scheduleByDivision[0];
          while (scheduleByDivision.length) {     // Loop over division schedule
            result.push(entry);                   // Push previous entry
            scheduleByDivision.splice(index, 1);  // Remove previous entry from original data

            // Get next entry which is not the same team, and has the next discipline in the sortorder index
            index = scheduleByDivision.findIndex(e => {
              return e.team.id !== entry.team.id && e.disciplineSortOrder === ((entry.disciplineSortOrder + 1) % 3);
            });
            index = index === -1 ? 0 : index;

            // Check if index of next entry is found. If not, default to first remaining entry.
            entry = scheduleByDivision[index];
          }
        }
      }
    });

    return result;
  }
}
