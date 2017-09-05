import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { EventService, DisplayService } from 'app/services/api';
import { ITournament } from 'app/services/model';
import { EventComponent } from '../../event.component';
import { KeyCode } from 'app/shared/KeyCodes';

@Component({
  selector: 'app-fullscreen',
  templateUrl: './fullscreen.component.html',
  styleUrls: ['./fullscreen.component.scss']
})
export class FullscreenComponent implements OnInit, OnDestroy {
  eventSubscription: Subscription;
  paramSubscription: Subscription;
  tournamentSubscription: Subscription;
  tournament: ITournament;
  displayId: number;
  displayHtml;

  constructor(
    private elRef: ElementRef,
    private parent: EventComponent,
    private route: ActivatedRoute,
    private router: Router,
    private displayService: DisplayService,
    private eventService: EventService) { }

  ngOnInit() {
    this.paramSubscription = this.route.params.subscribe((params: any) => {
      this.displayId = +params.displayId;
      this.tournamentSubscription = this.parent.tournamentSubject.subscribe(tournament => {
        if (tournament && tournament.id) {
          this.tournament = tournament;
          this.eventSubscription = this.eventService.connect().subscribe(message => this.loadDisplay());
          this.loadDisplay();
        }
      });
    });

    // Go fullscreen
    const elm = this.elRef.nativeElement;
    if (elm.requestFullscreen)            { elm.requestFullscreen(); }
    else if (elm.msRequestFullscreen)     { elm.msRequestFullscreen(); }
    else if (elm.mozRequestFullScreen)    { elm.mozRequestFullScreen(); }
    else if (elm.webkitRequestFullscreen) { elm.webkitRequestFullscreen(); }
  }

  loadDisplay() {
    this.displayService.getDisplay(this.tournament.id, this.displayId).subscribe(res => this.displayHtml = res);
  }

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
    this.paramSubscription.unsubscribe();
    if (this.tournamentSubscription) { this.tournamentSubscription.unsubscribe(); }
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(evt: KeyboardEvent) {
    if (evt.keyCode === KeyCode.ESCAPE) {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }
}
