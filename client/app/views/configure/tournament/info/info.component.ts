import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TournamentService } from 'app/services/api';
import { ITournament } from 'app/services/model/ITournament';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  tournament: ITournament;
  constructor(private route: ActivatedRoute, private tournamentService: TournamentService) { }

  ngOnInit() {
    this.route.parent.params.subscribe((params: any) => {
      if (this.tournamentService.selected) {
        this.tournament = this.tournamentService.selected
      }
      else if (params.id) {
        this.tournamentService.selectedId = +params.id;
        this.tournamentService.getById(params.id).subscribe(tournament => {
          this.tournament = tournament;
          this.tournamentService.selected = tournament;
        });
      }
    });
  }

  save() {
    this.tournamentService.save(this.tournament).subscribe(res => this.tournament = res);
  }

}
