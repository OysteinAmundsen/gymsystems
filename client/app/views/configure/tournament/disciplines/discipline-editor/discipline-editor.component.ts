import { Component, OnInit, EventEmitter, Output, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { TournamentService, DisciplineService } from 'app/services/api';
import { IDiscipline } from 'app/services/model/IDiscipline';
import { ITournament } from 'app/services/model/ITournament';

import { TournamentEditorComponent } from '../../tournament-editor/tournament-editor.component';

@Component({
  selector: 'app-discipline-editor',
  templateUrl: './discipline-editor.component.html',
  styleUrls: ['./discipline-editor.component.scss']
})
export class DisciplineEditorComponent implements OnInit {
  @Input() discipline: IDiscipline = <IDiscipline>{};
  @Output() disciplineChanged: EventEmitter<any> = new EventEmitter<any>();

  disciplineForm: FormGroup;
  editingScore: boolean;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private tournamentService: TournamentService, private disciplineService: DisciplineService) { }

  ngOnInit() {
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
    });
  }

  delete() {
    this.disciplineService.delete(this.disciplineForm.value).subscribe(result => {
      this.disciplineChanged.emit(result);
    });
  }

  cancel() {
    this.disciplineChanged.emit(this.discipline);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (!this.editingScore && evt.keyCode === 27) {
      this.cancel();
    }
  }
}
