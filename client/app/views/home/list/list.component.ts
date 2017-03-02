import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TournamentService, ScheduleService, TeamsService } from 'app/api';
import { ITournament } from 'app/api/model/ITournament';
import { ITournamentParticipant } from 'app/api/model/ITournamentParticipant';
import { ITeam } from 'app/api/model/ITeam';
import { DivisionType } from 'app/api/model/DivisionType';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  tournament: ITournament;
  schedule: ITournamentParticipant[] = [];
  selected: ITournamentParticipant;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private scheduleService: ScheduleService,
    private teamService: TeamsService,
    private tournamentService: TournamentService) { }

  ngOnInit() {
    if (this.tournamentService.selected) {
      const tournamentId = this.tournamentService.selectedId;
      this.tournament = this.tournamentService.selected;
      this.scheduleService.getByTournament(tournamentId).subscribe((schedule) => this.schedule = schedule);
    } else {
      this.route.params.subscribe((params: any) => {
        const tournamentId = +params.id;
        if (!isNaN(tournamentId)) {
          this.tournamentService.selectedId = tournamentId;
          this.tournamentService.getById(tournamentId).subscribe((tournament) => {
            this.tournamentService.selected = tournament;
            this.tournament = tournament;
          });
          this.scheduleService.getByTournament(tournamentId).subscribe((schedule) => this.schedule = schedule);
        }
      });
    }
  }

  division(team: ITeam) { return this.teamService.division(team); }

  score(participant: ITournamentParticipant) {
    return participant.discipline.scoreGroups.reduce((prev, curr) => {
      const scores = participant.scores.filter(s => s.group.id === curr.id);
      return prev += scores.length ? scores.reduce((p, c) => p += c.value, 0) / scores.length : 0;
    }, 0);
  }

  select(participant: ITournamentParticipant) {
    this.selected = participant;
  }
}
