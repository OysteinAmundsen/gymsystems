import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { EventService } from 'app/api/event.service';

@Component({
  selector: 'app-fullscreen',
  templateUrl: './fullscreen.component.html',
  styleUrls: ['./fullscreen.component.scss']
})
export class FullscreenComponent implements OnInit, OnDestroy {
  eventSubscription: Subscription;

  constructor(
    private elRef: ElementRef,
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService) { }

  ngOnInit() {
    this.eventSubscription = this.eventService.connect().subscribe(message => {
      console.log(message);
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

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(evt: KeyboardEvent) {
    if (evt.keyCode === 27) {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }
}
