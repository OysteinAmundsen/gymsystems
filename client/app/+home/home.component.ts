import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit {
  activeArrangement:any;
  constructor() {}

  ngOnInit() {
    this.activeArrangement = {
      name: 'Landsturnstevnet 2017'
    };
  }

}
