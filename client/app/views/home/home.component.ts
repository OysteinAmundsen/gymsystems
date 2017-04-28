import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

import { TournamentService } from 'app/services/api/tournament.service';
import { ITournament } from 'app/services/model/ITournament';

type tournamentType = {name: string, tournaments: ITournament[]};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  _types: tournamentType[] = [];
  get types() { return this._types.sort((a: tournamentType, b: tournamentType) => (a.name === 'Future') ? -1 : 1); } // Future first, allways
  current = [];
  isLoading: boolean = true;
  get hasTournaments() {
    return this.types.filter(t => t.tournaments.length > 0).length > 0;
  }

  constructor(private tournamentService: TournamentService, private translate: TranslateService, private title: Title) {
    title.setTitle('GymSystems');
    this.translate.get(['Future', 'Past']).subscribe(); // Make sure texts exists and are translated
    tournamentService.upcoming().subscribe(tournaments => this._types.push({ name: 'Future', tournaments: tournaments }));
    tournamentService.past().subscribe(tournaments => this._types.push({ name: 'Past', tournaments: tournaments }));
    tournamentService.current().subscribe(tournaments => this.current = tournaments);
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.tournamentService.selectedId = null;
    this.tournamentService.selected = null;
  }
}
