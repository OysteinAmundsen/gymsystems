import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-fullscreen',
  templateUrl: './fullscreen.component.html',
  styleUrls: ['./fullscreen.component.scss']
})
export class FullscreenComponent implements OnInit {

  constructor(private elRef: ElementRef) { }

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
}
