import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

import { TournamentService } from 'app/services/api/tournament.service';
import { ITournament } from 'app/services/model/ITournament';

interface TournamentType {name: string, tournaments: ITournament[]}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  _types: TournamentType[] = [];
  get types() { return this._types.sort((a: TournamentType, b: TournamentType) => (a.name === 'Future') ? -1 : 1); } // Future first, allways
  current = [];
  isLoading = true;
  get hasTournaments() {
    return this.types.filter(t => t.tournaments.length > 0).length > 0;
  }
  get hasFuture() {
    const future = this.types.find(t => t.name === 'Future');
    return future && future.tournaments && future.tournaments.length;
  }
  get hasPast() {
    const past = this.types.find(t => t.name === 'Past');
    return past && past.tournaments && past.tournaments.length;
  }

  constructor(private tournamentService: TournamentService, private translate: TranslateService, private title: Title) {
    title.setTitle('GymSystems');
    this.translate.get(['Future', 'Past']).subscribe(); // Make sure texts exists and are translated
    tournamentService.upcoming().subscribe(tournaments => this._types.push({ name: 'Future', tournaments: tournaments }));
    tournamentService.past().subscribe(tournaments => this._types.push({ name: 'Past', tournaments: tournaments }));
    tournamentService.current().subscribe(tournaments => this.current = tournaments);
  }

  ngOnInit() { }

  ngOnDestroy() {  }

  getDescription(tournament: ITournament) {
    return (tournament ? tournament['description_' + this.translate.currentLang] : '');
  }
}
