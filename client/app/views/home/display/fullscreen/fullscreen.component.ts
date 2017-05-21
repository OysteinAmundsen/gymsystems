import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { EventService } from 'app/services/api/event.service';
import { DisplayService } from 'app/services/api';

@Component({
  selector: 'app-fullscreen',
  templateUrl: './fullscreen.component.html',
  styleUrls: ['./fullscreen.component.scss']
})
export class FullscreenComponent implements OnInit, OnDestroy {
  eventSubscription: Subscription;
  paramSubscription: Subscription;
  tournamentId: number;
  displayId: number;
  displayHtml;

  constructor(
    private elRef: ElementRef,
    private route: ActivatedRoute,
    private router: Router,
    private displayService: DisplayService,
    private eventService: EventService) { }

  ngOnInit() {
    this.paramSubscription = this.route.params.subscribe((params: any) => {
      this.tournamentId = +params.id;
      this.displayId = +params.displayId;
      this.loadDisplay();
    });
    this.eventSubscription = this.eventService.connect().subscribe(message => {
      this.loadDisplay();
    });

    // Go fullscreen
    const elm = this.elRef.nativeElement;
    if (elm.requestFullscreen) {
      elm.requestFullscreen();
    } else if (elm.msRequestFullscreen) {
      elm.msRequestFullscreen();
    } else if (elm.mozRequestFullScreen) {
      elm.mozRequestFullScreen();
    } else if (elm.webkitRequestFullscreen) {
      elm.webkitRequestFullscreen();
    }
  }

  loadDisplay() {
    this.displayService.getDisplay(this.tournamentId, this.displayId).subscribe(res => this.displayHtml = res);
  }

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
    if (this.paramSubscription) { this.paramSubscription.unsubscribe(); }
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(evt: KeyboardEvent) {
    if (evt.keyCode === 27) {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }
}
