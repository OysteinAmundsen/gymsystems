import { Component, OnInit, EventEmitter, Output, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { TournamentService, DisciplineService } from 'app/api';
import { IDiscipline } from 'app/api/model/IDiscipline';
import { ITournament } from 'app/api/model/ITournament';

import { TournamentEditorComponent } from '../../tournament-editor/tournament-editor.component';

@Component({
  selector: 'app-discipline-editor',
  templateUrl: './discipline-editor.component.html',
  styleUrls: ['./discipline-editor.component.scss']
})
export class DisciplineEditorComponent implements OnInit {
  @Input() discipline: IDiscipline = <IDiscipline>{};
  @Output() disciplineChanged: EventEmitter<any> = new EventEmitter<any>();
  get tournament() { return this.tournamentService.selected; }
  // discipline: IDiscipline = <IDiscipline>{ tournament: this.tournament };
  disciplineForm: FormGroup;
  editingScore: boolean;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private tournamentService: TournamentService, private disciplineService: DisciplineService) { }

  ngOnInit() {
    // this.route.params.subscribe((params: any) => {
    //   if (params.id) {
    //     this.disciplineService.getById(params.id).subscribe(discipline => {
    //       this.discipline = discipline;
    //       this.disciplineForm.setValue(discipline);
    //     });
    //   }
    // });

    // Create the form
    this.disciplineForm = this.fb.group({
      id: [this.discipline.id],
      name: [this.discipline.name, [Validators.required]],
      teams: [this.discipline.teams],
      tournament: [this.discipline.tournament],
      //scoreGroups: [this.discipline.scoreGroups]
    });
  }

  save() {
    this.disciplineService.save(this.disciplineForm.value).subscribe(result => {
      this.disciplineChanged.emit(result);
      // this.router.navigate(['../', result.id], { relativeTo: this.route });
    });
  }

  delete() {
    this.disciplineService.delete(this.disciplineForm.value).subscribe(result => {
      this.disciplineChanged.emit(result);
      // this.router.navigate(['../'], { relativeTo: this.route });
    });
  }

  cancel() {
    this.disciplineChanged.emit(this.discipline);
    // this.router.navigate(['../'], { relativeTo: this.route });
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (!this.editingScore && evt.keyCode === 27) {
      this.cancel();
    }
  }
}
