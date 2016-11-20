import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  navState: boolean = false;

  constructor(private element: ElementRef) { }
  ngOnInit(): void { }

  closeNav(evt: MouseEvent): void {
    if (this.navState) {
      return this.toggleNav(evt);
    }
  }

  toggleNav(evt: MouseEvent): void {
    this.navState = !this.navState;
    evt.preventDefault();
    evt.stopPropagation();
  }
}
