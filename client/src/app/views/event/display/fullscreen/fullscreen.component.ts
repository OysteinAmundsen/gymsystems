import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { DisplayService } from 'app/shared/services/api';
import { EventComponent } from '../../event.component';
import { GraphService } from 'app/shared/services/graph.service';

@Component({
  selector: 'app-fullscreen',
  templateUrl: './fullscreen.component.html',
  styleUrls: ['./fullscreen.component.scss']
})
export class FullscreenComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  displayId: number;
  displayHtml;

  constructor(
    private elRef: ElementRef,
    private parent: EventComponent,
    private route: ActivatedRoute,
    private router: Router,
    private graph: GraphService,
    private displayService: DisplayService) { }

  ngOnInit() {
    this.subscriptions.push(this.route.params.subscribe((params: any) => {
      this.displayId = +params.displayId;
      this.subscriptions.push(this.graph.listen('teamInDisciplineModified', '{id}').subscribe(res => {
        this.loadDisplay(true);
      }));
      this.loadDisplay();
    }));

    // Go fullscreen
    const elm = this.elRef.nativeElement;
    elm.requestFullscreen ? elm.requestFullscreen()
      : elm.msRequestFullscreen ? elm.msRequestFullscreen()
        : elm.mozRequestFullScreen ? elm.mozRequestFullScreen()
          : elm.webkitRequestFullscreen ? elm.webkitRequestFullscreen()
            : function () { }() // <-- noop
  }

  loadDisplay(force?: boolean) {
    this.displayService.invalidateCache();
    this.displayService.getDisplay(this.parent.tournamentId, this.displayId).subscribe(res => this.displayHtml = res);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(evt: KeyboardEvent) {
    if (evt.key === 'Escape') {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }
}
