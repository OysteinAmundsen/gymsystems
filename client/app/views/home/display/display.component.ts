import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentService, ScheduleService, TeamsService } from 'app/api';

import { ITournament } from 'app/api/model/ITournament';
import { ITournamentParticipant } from 'app/api/model/ITournamentParticipant';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {
  tournament: ITournament;
  schedule: ITournamentParticipant[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private scheduleService: ScheduleService,
    private teamService: TeamsService,
    private tournamentService: TournamentService) { }

  ngOnInit() {
    if (this.tournamentService.selected) {
      this.tournament = this.tournamentService.selected;
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
}
