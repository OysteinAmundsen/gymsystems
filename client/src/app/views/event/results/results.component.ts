import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { EventComponent } from '../event.component';
import { ITeamInDiscipline, Classes, ParticipationType, IDiscipline, TotalByScoreGroup } from 'app/model';
import { GraphService } from 'app/shared/services/graph.service';
import { BrowserService } from 'app/shared/browser.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  schedule: ITeamInDiscipline[] = [];
  disciplines: IDiscipline[];
  scoreHead: { type: string }[];
  expanded = {};
  isLoading = false;

  get teamgym() { return this.schedule.filter(s => s ? s.team.class === Classes.TeamGym : null); }
  get national() { return this.schedule.filter(s => s ? s.team.class === Classes.National : null); }
  get divisions() { return this.getDivisionNames(this.national); }
  get teamGymDivisions() { return this.getDivisionNames(this.teamgym); }

  constructor(
    private parent: EventComponent,
    private graph: GraphService,
    private browser: BrowserService) { }

  ngOnInit() {

    this.subscriptions.push(this.graph.listen('teamInDisciplineModified', '{id}').subscribe(res => {
      this.loadResults();
    }));
    this.loadResults();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  loadResults() {
    this.graph.getData(`{
      getDisciplines(tournamentId:${this.parent.tournamentId}){id,name,sortOrder,scoreGroups{type,judgeCount}},
      getSchedule(tournamentId:${this.parent.tournamentId}, type:${ParticipationType.Live}, scorable:true){
        id,
        team{id,name,class},
        sortNumber,
        startNumber,
        markDeleted,
        startTime,
        endTime,
        publishTime,
        type,
        disciplineId,
        disciplineName,
        divisionName,
        divisionSortOrder,
        scorable,
        total,
        totalByScoreGroup{group{id,type},total}
      }}`)
      .subscribe(data => {
        this.disciplines = data.getDisciplines;
        this.schedule = data.getSchedule.map(s => {
          s.discipline = data.getDisciplines.find(d => d.id === s.disciplineId);
          return s;
        });

        // Parse expansion preference, pre-expanded is default
        const expanded = JSON.parse(this.browser.sessionStorage().getItem('resultsCollapse')) || {};
        this.divisions.forEach(d => expanded && expanded[d] !== undefined ? this.expanded[d] = expanded[d] : this.expanded[d] = true);
        this.expanded['teamgym'] = expanded && expanded['teamgym'] !== undefined ? expanded['teamgym'] : true;
        this.isLoading = false;
      });
  }

  /**
   * Retreive a sorted unique array of division names
   */
  getDivisionNames(participants: ITeamInDiscipline[]): Set<string> {
    return participants
      .sort((a: ITeamInDiscipline, b: ITeamInDiscipline) => a.divisionSortOrder === b.divisionSortOrder ? 0 : a.divisionSortOrder > b.divisionSortOrder ? 1 : -1)
      .reduce((p, c) => p.add(c.divisionName), new Set<string>());
  }

  /**
   * Present the score properly for each class
   */
  score(participant: ITeamInDiscipline) {
    if (!this.isPublished(participant)) { return 0; }

    return (participant.team.class === Classes.National)
      ? // Calculate final National classes score
      parseFloat(participant.total)

      : // For teamgym every discipline must be published before final score can be calculated
      this.schedule.filter(s => s.team.id === participant.team.id && s.publishTime != null)
        .reduce((prev, curr) => prev += parseFloat(curr.total), 0);
  }

  getMaxColspan() {
    return this.disciplines.length + 3;
  }

  scoreHeadByDiscipline(discipline: string): { type: string }[] {
    if (!this.scoreHead) {
      const d = this.schedule.find(s => s.disciplineName === discipline);
      this.scoreHead = d
        ? d.discipline.scoreGroups.reduce((prev, curr) => new Array(curr.judgeCount).map(j => ({ type: curr.type + (j + 1) })), [])
        : null;
    }
    return this.scoreHead;
  }

  teamGymScoresByGroup(participant): { discipline: string, total: number, scores: TotalByScoreGroup[] }[] {
    return this.schedule
      .filter(s => s.team.id === participant.team.id)
      .map(c => ({ discipline: c.disciplineName, total: parseFloat(c.total), scores: c.totalByScoreGroup }));
  }

  isPublished(item: ITeamInDiscipline) {
    return (item.team.class === Classes.TeamGym)
      ? this.schedule.filter(s => s.team.id === item.team.id).every(t => t.publishTime != null)
      : item.publishTime != null;
  }

  hasParticipants(discipline: string, division: string) {
    return this.schedule.filter(s => s.disciplineName === discipline && s.divisionName === division).length > 0;
  }

  onExpandedChange() {
    setTimeout(() => this.browser.sessionStorage().setItem('resultsCollapse', JSON.stringify(this.expanded)));
  }

  isCollapsed(division: string) {
    return this.expanded[division];
  }

  getByDivision(name: string, filtered?: ITeamInDiscipline[]) {
    const schedule = filtered || this.schedule;
    return this.sortByScoreAndName(schedule.filter(s => s.divisionName === name));
  }

  getByDiscipline(name: string, filtered?: ITeamInDiscipline[]) {
    const schedule = filtered || this.schedule;
    return this.sortByScoreAndName(schedule.filter(s => s.discipline.name === name && s.team.class !== Classes.TeamGym));
  }

  sortByScoreAndName(filtered: ITeamInDiscipline[]) {
    return filtered
      .sort((a: ITeamInDiscipline, b: ITeamInDiscipline) => { // Sort by total score
        const aScore = this.score(a);
        const bScore = this.score(b);
        if (aScore !== bScore) {
          return this.score(a) > bScore ? -1 : 1;
        }
        return a.team.name > b.team.name ? 1 : -1;
      });
  }

  getByTeamGym(divisionName: string) {
    const me = this;
    return this.schedule.filter(s => {
      return s.disciplineName === me.disciplines[0].name  // Only one entry per team.
        && s.team.class === Classes.TeamGym
        && divisionName === s.divisionName;
    }).sort((a: ITeamInDiscipline, b: ITeamInDiscipline) => { // Sort by total score
      return this.score(a) > this.score(b) ? -1 : 1;
    });
  }
}
