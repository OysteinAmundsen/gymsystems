import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-fullscreen',
  templateUrl: './fullscreen.component.html',
  styleUrls: ['./fullscreen.component.scss']
})
export class FullscreenComponent implements OnInit {

  constructor(private elRef: ElementRef, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
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

  @HostListener('window:keydown', ['$event'])
  onKeydown(evt: KeyboardEvent) {
    if (evt.keyCode === 27) {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }
}
