import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { UserService } from 'app/shared/services/api';
import { ITournament, Role } from 'app/model';
import { SubjectSource } from 'app/shared/services/subject-source';
import { GraphService } from 'app/shared/services/graph.service';
import { SEOService } from 'app/shared/services/seo.service';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.scss']
})
export class TournamentComponent implements OnInit {
  tournamentSource = new SubjectSource<ITournament>(new BehaviorSubject<ITournament[]>([]));
  displayColumns = ['name', 'startDate', 'endDate', 'venueName', 'clubName'];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private graph: GraphService,
    private userService: UserService,
    private seo: SEOService
  ) { }

  ngOnInit() {
    this.seo.setTitle(`Configure tournaments`, `List all tournaments registerred`);

    this.userService.getMe().subscribe(me => me && me.role >= Role.Admin ? this.displayColumns.push('createdBy') : null);
    this.graph.getData(`{
      getTournaments{
        id,
        name,
        startDate,
        endDate,
        description_no,
        description_en,
        times{day,time},
        club{id,name},
        createdById,
        createdBy{id,name},
        venue{id,name,address,capacity}
      }}`).subscribe(data => this.tournamentSource.subject.next(data.getTournaments));
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.key === '+' || evt.key === 'NumpadAdd') {
      this.router.navigate(['./add'], { relativeTo: this.route });
    }
  }
}
