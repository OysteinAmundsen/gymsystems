import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { GraphService } from 'app/services/graph.service';
import { ITournament } from 'app/model/ITournament';


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit, OnDestroy {
  query = `{
    id,
    name,
    description_en,
    startDate,
    endDate
  }`;
  tournamentId: number;
  tournament: ITournament;
  subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute, private graph: GraphService, private title: Title, private meta: Meta) { }

  ngOnInit() {
    this.subscriptions.push(this.route.params.subscribe((params: any) => {
      const id = this.tournamentId = +params.id;
      this.graph.getData(`{tournament(id:${id})${this.query}}`).subscribe((data) => {
        this.tournament = data.tournament;
        this.title.setTitle(`${this.tournament.name} | GymSystems`);
        this.meta.updateTag({ property: 'og:title', content: `${this.tournament.name} | GymSystems` });
        this.meta.updateTag({ property: 'og:description', content: `${this.tournament.description_en}` });
      });
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  printPage() {
    setTimeout(() => window.print());
  }
}
