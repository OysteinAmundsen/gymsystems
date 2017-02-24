import { Component, OnInit, EventEmitter, Output, Input, HostListener } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { TournamentService, TeamsService, DisciplineService, DivisionService } from 'app/api';
import { IDiscipline } from 'app/api/model/IDiscipline';
import { IDivision, DivisionType } from 'app/api/model/IDivision';
import { ITeam } from 'app/api/model/ITeam';

@Component({
  selector: 'app-team-editor',
  templateUrl: './team-editor.component.html',
  styleUrls: ['./team-editor.component.scss']
})
export class TeamEditorComponent implements OnInit {
  @Input() team: ITeam = <ITeam>{};
  @Output() teamChanged: EventEmitter<any> = new EventEmitter<any>();
  teamForm: FormGroup;
  disciplines: IDiscipline[];
  divisions: IDivision[] = [];
  get ageDivisions(): IDivision[] { return this.divisions.filter(d => d.type === DivisionType.Age); }
  get genderDivisions(): IDivision[] { return this.divisions.filter(d => d.type === DivisionType.Gender); }

  constructor(
    private fb: FormBuilder,
    private tournamentService: TournamentService,
    private teamService: TeamsService,
    private divisionService: DivisionService,
    private disciplineService: DisciplineService) { }

  ngOnInit() {
    const tournamentId = this.tournamentService.selected.id;
    this.divisionService.getByTournament(tournamentId).subscribe(d => this.divisions = d);
    this.disciplineService.getByTournament(tournamentId).subscribe(d => this.disciplines = d);
    this.teamForm = this.fb.group({
      id: [this.team.id],
      name: [this.team.name, [Validators.required]],
      divisions: [this.team.divisions],
      disciplines: [this.team.disciplines]
    });
  }

  save() {
    this.teamService.save(this.teamForm.value).subscribe(result => {
      this.teamChanged.emit(result);
    });
  }

  delete() {
    this.teamService.delete(this.teamForm.value).subscribe(result => {
      this.teamChanged.emit(result);
    })
  }

  close() {
    this.teamChanged.emit(this.team);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === 27) {
      this.close();
    }
  }
}
