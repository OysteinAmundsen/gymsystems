import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription, ReplaySubject } from 'rxjs/Rx';
import { TournamentService } from 'app/services/api';
import { ITournament } from 'app/model';


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit, OnDestroy {

  tournament: ITournament;
  tournamentId: number;

  tournamentSubject = new ReplaySubject<ITournament>(1);
  paramSubscription: Subscription;

  constructor(private route: ActivatedRoute, private tournamentService: TournamentService, private title: Title, private meta: Meta) { }

  ngOnInit() {
    this.paramSubscription = this.route.params.subscribe((params: any) => {
      this.tournamentId = +params.id;
      this.tournamentService.getById(this.tournamentId).subscribe((tournament) => {
        this.tournament = tournament;
        this.tournamentSubject.next(this.tournament);
        this.title.setTitle(`${this.tournament.name} | GymSystems`);
        this.meta.updateTag({property: 'og:title', content: `${this.tournament.name} | GymSystems`});
        this.meta.updateTag({property: 'og:description', content: `${this.tournament.description_en}`});
      });
    });
  }

  ngOnDestroy() {
    if (this.paramSubscription) { this.paramSubscription.unsubscribe(); }
  }
}
