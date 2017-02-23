import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { TournamentService } from 'app/api';
import { IAgeClass } from 'app/api/model/IAgeClass';

@Component({
  selector: 'app-age-class',
  templateUrl: './age-class.component.html',
  styleUrls: ['./age-class.component.scss']
})
export class AgeClassComponent implements OnInit {
  ageClassList: IAgeClass[] = [];
  get tournament() { return this.tournamentService.selected; };

  _selected: IAgeClass;
  get selected() { return this._selected; }
  set selected(ageClass: IAgeClass) { this._selected = ageClass; }

  constructor(private router: Router, private route: ActivatedRoute, private tournamentService: TournamentService) { }

  ngOnInit() {
    this.loadAgeClasses();
  }

  loadAgeClasses() {
    this.route.parent.params.subscribe((params: any) => {
      if (params.id) {
      }
    });
  }

  addAgeClass() {
    const ageClass = <IAgeClass>{
      id: null, name: null, tournament: this.tournament
    };
    this.ageClassList.push(ageClass);
    this.selected = ageClass;
  }

  onChange() {
    this.select(null);
    this.loadAgeClasses();
  }

  select(ageClass: IAgeClass) {
    this.selected = ageClass;
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === 187) {
      this.addAgeClass();
    }
  }
}
