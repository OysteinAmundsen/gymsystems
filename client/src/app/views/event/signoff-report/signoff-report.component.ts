import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { EventComponent } from '../event.component';

import { ITeamInDiscipline, ITournament, IScoreGroup, ParticipationType, Operation, IDiscipline } from 'app/model';
import { GraphService } from 'app/shared/services/graph.service';
import { CommonService } from 'app/shared/services/common.service';
import { BrowserService } from 'app/shared/browser.service';

@Component({
  selector: 'app-signoff-report',
  templateUrl: './signoff-report.component.html',
  styleUrls: ['./signoff-report.component.scss']
})
export class SignoffReportComponent implements OnInit {
  tournament: ITournament;
  tournamentSubscription: Subscription;
  schedule: ITeamInDiscipline[] = [];
  disciplines: IDiscipline[];

  get divisionNames() {
    return this.schedule.reduce((p, c) => p.add(c.divisionName), new Set<string>());
  }

  get disciplineNames() {
    return this.schedule.reduce((p, s) => p.add(s.disciplineName), new Set<string>());
  }

  get dateSpan() {
    return CommonService.dateSpan(this.tournament);
  }

  constructor(
    private parent: EventComponent,
    private graph: GraphService,
    private router: Router,
    private route: ActivatedRoute,
    private browser: BrowserService
  ) { }

  ngOnInit() {
    this.graph.getData(`{
      tournament(id:${this.parent.tournamentId}){id,name,startDate,endDate,venue{id,name}},
      getDisciplines(tournamentId:${this.parent.tournamentId}){id,name,scoreGroups{id,type,judgeCount,operation,judges{sortNumber,judge{id,name}}}},
      getSchedule(tournamentId:${this.parent.tournamentId},type:${ParticipationType.Live},scorable:true){
        id,
        sortNumber,
        startNumber,
        divisionName,
        markDeleted,
        startTime,
        endTime,
        publishTime,
        disciplineName,
        team{id,name},
        scores{judgeIndex,value,scoreGroupId},
        total,
        totalByScoreGroup{group{id,type},total}
      }}`).subscribe(res => {
      this.tournament = res.tournament;
      this.disciplines = res.getDisciplines;
      const scoreGroups = this.disciplines.reduce((set, discipline) => { discipline.scoreGroups.forEach(group => set.add(group)); return set; }, new Set());
      this.schedule = res.getSchedule.map(participant => {
        participant.scores = participant.scores.map(s => {
          s.scoreGroup = Array.from(scoreGroups).find(g => g.id === s.scoreGroupId);
          return s;
        });
        return participant;
      });
      this.onRenderComplete();
    });
  }

  onRenderComplete() {
    setTimeout(() => {
      this.browser.window().print();
      this.router.navigate(['../results'], { relativeTo: this.route });
    });
  }

  getByDivision(name: string, filtered?: ITeamInDiscipline[]) {
    return (filtered || this.schedule)
      .filter(s => s.divisionName === name)
      .sort((a: ITeamInDiscipline, b: ITeamInDiscipline) => a.total > b.total ? -1 : 1);
  }

  getByDiscipline(name: string, filtered?: ITeamInDiscipline[]) {
    return (filtered || this.schedule)
      .filter(s => s.disciplineName === name)
      .sort((a: ITeamInDiscipline, b: ITeamInDiscipline) => a.total > b.total ? -1 : 1);
  }

  judgesForDivisionAndDiscipline(division, discipline) {
    return this.disciplines.find(d => d.name === discipline)
      .scoreGroups
      .sort((a: IScoreGroup, b: IScoreGroup) => a.type > b.type ? 1 : -1)
      .filter(s => s.operation === Operation.Addition)
      .reduce((prev, current) => {
        current.judges
          .sort((a, b) => a.sortNumber < b.sortNumber ? 1 : -1)
          .forEach((judgeInGroup, i) => {
            const prevCard = prev.find(card => card.name === judgeInGroup.judge.name);
            if (prevCard) {
              prevCard.type.push(current.type + (i + 1));
            } else {
              prev.push({
                type: [current.type + (i + 1)],
                name: judgeInGroup.judge.name
              });
            }
          });
        return prev;
      }, []);
  }

  colsFilteredByDivisionAndDiscipline(division: string, discipline: string) {
    return this.disciplines.find(d => d.name === discipline)
      .scoreGroups.sort((a: IScoreGroup, b: IScoreGroup) => a.type > b.type ? 1 : -1)
      .reduce((prev, current) => {
        if (current.judgeCount > 1) {
          for (let j = 1; j <= current.judgeCount; j++) {
            prev.push(current.type + j);
          }
        }
        prev.push(current.type);
        return prev;
      }, []);
  }

  filterByDivisionAndDiscipline(division: string, discipline: string) {
    return this.schedule.filter(s => s.divisionName === division && s.disciplineName === discipline);
  }

  scoreFromGroupName(participant: ITeamInDiscipline, groupName: string) {
    if (!this.isGroup(groupName)) {
      // Single type
      const type = groupName.charAt(0);
      const judge = parseInt(groupName.charAt(1), null);
      const score = participant.scores.find(s => s.judgeIndex === judge && s.scoreGroup.type === type);
      return score ? score.value : 0;
    } else {
      // Group total
      return participant.totalByScoreGroup.find(g => g.group.type === groupName).total;
    }
  }

  isGroup(groupName: string) {
    return !groupName.match(/\d+/g);
  }
}
