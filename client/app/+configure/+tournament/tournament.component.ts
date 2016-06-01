import { Component, OnInit } from '@angular/core';
import { FaComponent } from '../../shared';

@Component({
  moduleId: module.id,
  selector: 'app-tournament',
  templateUrl: 'tournament.component.html',
  styleUrls: ['tournament.component.css'],
  directives: [FaComponent]
})
export class TournamentComponent implements OnInit {
  showForm:boolean = false;

  constructor() {}

  ngOnInit() {
  }

  addTournament() {
    this.showForm = true;
  }
}
