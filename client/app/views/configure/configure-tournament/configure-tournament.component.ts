import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-configure-tournament',
  templateUrl: './configure-tournament.component.html',
  styleUrls: ['./configure-tournament.component.scss']
})
export class ConfigureTournamentComponent implements OnInit {
  showForm: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  addTournament() {
    this.showForm = true;
  }
}
