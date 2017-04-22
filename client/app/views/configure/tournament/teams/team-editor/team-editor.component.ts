import { Component, OnInit, EventEmitter, Output, Input, HostListener, ElementRef, ViewChildren } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { TournamentService, TeamsService, DisciplineService, DivisionService } from 'app/services/api';
import { IDiscipline } from 'app/services/model/IDiscipline';
import { IDivision } from 'app/services/model/IDivision';
import { DivisionType } from 'app/services/model/DivisionType';
import { ITeam } from 'app/services/model/ITeam';

@Component({
  selector: 'app-team-editor',
  templateUrl: './team-editor.component.html',
  styleUrls: ['./team-editor.component.scss']
})
export class TeamEditorComponent implements OnInit {
  @Input() team: ITeam = <ITeam>{};
  @Output() teamChanged: EventEmitter<any> = new EventEmitter<any>();
  @ViewChildren('selectedDisciplines') selectedDisciplines;
  teamForm: FormGroup;
  disciplines: IDiscipline[];
  divisions: IDivision[] = [];
  get ageDivisions(): IDivision[] { return this.divisions.filter(d => d.type === DivisionType.Age); }
  get genderDivisions(): IDivision[] { return this.divisions.filter(d => d.type === DivisionType.Gender); }
  get allChecked() {
    if (this.selectedDisciplines && this.selectedDisciplines.length) {
      const team = this.teamForm.value;
      const checked = this.selectedDisciplines.filter((elm: ElementRef) => (<HTMLInputElement>elm.nativeElement).checked);
      return checked.length === this.selectedDisciplines.length;
    }
    return false;
  }

  constructor(
    private fb: FormBuilder,
    private elm: ElementRef,
    private tournamentService: TournamentService,
    private teamService: TeamsService,
    private divisionService: DivisionService,
    private disciplineService: DisciplineService) { }

  ngOnInit() {
    const tournamentId = this.tournamentService.selectedId;
    this.divisionService.getByTournament(tournamentId).subscribe(d => this.divisions = d);
    this.disciplineService.getByTournament(tournamentId).subscribe(d => {
      this.disciplines = d;
      setTimeout(() => {
        // Set selected disciplines
        this.selectedDisciplines
          .forEach((element: ElementRef) => {
            const el = <HTMLInputElement>element.nativeElement;
            const disciplineId = el.attributes.getNamedItem('data').nodeValue;
            el.checked = this.team.disciplines.findIndex(d => d.id === +disciplineId) > -1;
          });
      });
    });

    // Group divisions by type
    const ageDivision = this.team.divisions.find(d => d.type === DivisionType.Age);
    const genderDivision = this.team.divisions.find(d => d.type === DivisionType.Gender);
    this.teamForm = this.fb.group({
      id: [this.team.id],
      name: [this.team.name, [Validators.required]],
      ageDivision: [ageDivision ? ageDivision.id : null, [Validators.required]],
      genderDivision: [genderDivision ? genderDivision.id : null, [Validators.required]],
      disciplines: [this.team.disciplines],
      tournament: [this.team.tournament]
    });
  }

  save() {
    const team = this.teamForm.value;

    // Compute division set
    const ageDivision = this.divisions.find(d => d.id === team.ageDivision);
    const genderDivision = this.divisions.find(d => d.id === team.genderDivision);
    team.divisions = [JSON.parse(JSON.stringify(ageDivision)), JSON.parse(JSON.stringify(genderDivision))];
    delete team.ageDivision;
    delete team.genderDivision;

    // Compute discipline set
    team.disciplines = this.selectedDisciplines
      .filter((elm: ElementRef) => (<HTMLInputElement>elm.nativeElement).checked)
      .map((elm: ElementRef) => {
        const disciplineId = (<HTMLInputElement>elm.nativeElement).attributes.getNamedItem('data').nodeValue;
        return this.disciplines.find(d => d.id === +disciplineId);
      });

    // Save team
    this.teamService.save(team).subscribe(result => {
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

  toggleChecked() {
    const state = this.allChecked;
    this.selectedDisciplines.forEach((elm: ElementRef) => (<HTMLInputElement>elm.nativeElement).checked = !state);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === 27) {
      this.close();
    }
  }
}
