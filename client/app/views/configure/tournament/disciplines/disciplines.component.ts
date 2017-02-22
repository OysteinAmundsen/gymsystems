import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { TournamentService, DisciplineService } from 'app/api';
import { IDiscipline } from 'app/api/model/IDiscipline';

@Component({
  selector: 'app-disciplines',
  templateUrl: './disciplines.component.html',
  styleUrls: ['./disciplines.component.scss']
})
export class DisciplinesComponent implements OnInit {
  get tournament() { return this.tournamentService.selected; };
  disciplineList: IDiscipline[] = [];

  _selected: IDiscipline;
  get selected() { return this._selected; }
  set selected(discipline: IDiscipline) { this._selected = discipline; }

  constructor(private router: Router, private route: ActivatedRoute, private tournamentService: TournamentService, private disciplineService: DisciplineService) { }

  ngOnInit() {
    this.loadDisciplines();
  }

  loadDisciplines() {
    this.route.parent.parent.params.subscribe((params: any) => {
      if (params.id) {
        this.disciplineService.getByTournament(params.id).subscribe(disciplines => this.disciplineList = disciplines);
      }
    });
  }

  onChange() {
    this.select(null);
    this.loadDisciplines();
  }

  select(discipline: IDiscipline) {
    this.selected = discipline;
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === 187) {
      this.router.navigate(['./add'], { relativeTo: this.route });
    }
  }
}
