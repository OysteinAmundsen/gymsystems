import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TournamentService, ScheduleService } from 'app/api';
import { ITournament } from 'app/api/model/ITournament';
import { ITournamentParticipant } from 'app/api/model/ITournamentParticipant';
import { ITeam } from 'app/api/model/ITeam';
import { DivisionType } from 'app/api/model/DivisionType';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  tournament: ITournament;
  schedule: ITournamentParticipant[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private scheduleService: ScheduleService,
    private tournamentService: TournamentService) { }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      const tournamentId = +params.id;
      if (!isNaN(tournamentId)) {
        this.tournamentService.getById(tournamentId).subscribe((tournament: ITournament) => this.tournament = <ITournament>tournament);
        this.scheduleService.getByTournament(tournamentId).subscribe((schedule: ITournamentParticipant[]) => this.schedule = schedule);
      } else {
        //this.router.navigate(['']);
      }
    });
  }

  ngOnDestroy() {

  }

  division(team: ITeam) {
    const ageDiv = team.divisions.find(d => d.type === DivisionType.Age);
    const genderDiv = team.divisions.find(d => d.type === DivisionType.Gender);
    return genderDiv.name + ' ' + ageDiv.name;
  }

}
