import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Title, Meta } from '@angular/platform-browser';

import { ITournament } from 'app/model';
import { GraphService } from 'app/shared/services/graph.service';
import { CommonService } from 'app/shared/services/common.service';

interface TournamentType { name: string; tournaments: ITournament[]; }

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private query = `{
    getTournaments {
      id,
      name,
      description_no,
      description_en,
      startDate,
      endDate,
      times{day,time},
      venue{id,name,address,capacity}
    }}`;

  current = [];
  isLoading = true;

  // Future first, allways
  private _types: TournamentType[] = [];
  get types() { return this._types.sort((a: TournamentType, b: TournamentType) => (a.name === 'Future') ? -1 : 1); }

  get hasTournaments() { return this.types.filter(t => t.tournaments.length > 0).length > 0; }
  get hasFuture() {
    const future = this.types.find(t => t.name === 'Future');
    return future && future.tournaments && future.tournaments.length > 0;
  }
  get hasPast() {
    const past = this.types.find(t => t.name === 'Past');
    return past && past.tournaments && past.tournaments.length > 0;
  }
  get future() {
    return this.hasFuture ? this.types.find(t => t.name === 'Future').tournaments : [];
  }

  constructor(
    private graph: GraphService,
    private translate: TranslateService,
    private title: Title,
    private meta: Meta
  ) { }

  ngOnInit() {
    // Page meta tags
    this.title.setTitle('GymSystems');
    this.meta.updateTag({ property: 'og:title', content: `GymSystems` });
    this.meta.updateTag({ property: 'og:description', content: `A complete web based system for managing the secretariat for Team Gymnastic sports.` });
    this.meta.updateTag({ property: 'Description', content: `A complete web based system for managing the secretariat for Team Gymnastic sports.` });

    // Make sure texts exists and are translated
    this.translate.get(['Future', 'Past']).subscribe();

    // Get page data
    this.graph.getData(this.query).subscribe(data => {
      const now = new Date().getTime();
      this._types = [
        { name: 'Future', tournaments: data.getTournaments.filter(t => now < t.startDate) },
        { name: 'Past', tournaments: data.getTournaments.filter(t => now > t.endDate) }
      ];
      this.current = data.getTournaments.filter(t => now >= t.startDate && now <= t.endDate);
    });
  }

  ngOnDestroy() { }

  getDescription(tournament: ITournament) {
    return (tournament ? tournament['description_' + this.translate.currentLang] : '');
  }

  getDateSpan(tournament: ITournament) {
    return CommonService.dateSpan(tournament);
  }
}
