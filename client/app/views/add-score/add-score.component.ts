import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TeamsService, TournamentService, ScoreService, ScheduleService } from 'app/api';
import { ITournament } from 'app/api/model/ITournament';
import { IScoreGroup } from 'app/api/model/IScoreGroup';
import { ITournamentParticipant } from 'app/api/model/ITournamentParticipant';
import { ITeam } from 'app/api/model/ITeam';

@Component({
  selector: 'app-add-score',
  templateUrl: './add-score.component.html',
  styleUrls: ['./add-score.component.scss']
})
export class AddScoreComponent implements OnInit, OnDestroy {
  tournament: ITournament;
  schedule: ITournamentParticipant[] = [];
  scoreGroups: IScoreGroup[];

  selected: ITournamentParticipant;

  constructor(
    private scoreService: ScoreService,
    private route: ActivatedRoute,
    private scheduleService: ScheduleService,
    private teamService: TeamsService,
    private tournamentService: TournamentService) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      if (params.id) {
        this.tournamentService.selectedId = +params.id;
        this.tournamentService.getById(+params.id).subscribe(tournament => {
          this.tournamentService.selected = tournament;
          this.tournament = tournament;
        });
        this.scheduleService.getByTournament(this.tournamentService.selectedId).subscribe(schedule => this.schedule = schedule);
      }
    });
    this.scoreService.all().subscribe((scoreGroups: IScoreGroup[]) => this.scoreGroups = scoreGroups);
  }

  ngOnDestroy() {
    this.tournamentService.selectedId = null;
    this.tournamentService.selected = null;
  }

  division(team: ITeam) { return this.teamService.division(team); }

  select(participant: ITournamentParticipant) {
    this.selected = participant;
  }
}
