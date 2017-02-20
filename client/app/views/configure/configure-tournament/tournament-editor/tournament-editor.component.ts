import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { TournamentService } from 'app/api';
import { ITournament } from 'app/api/model';

@Component({
  selector: 'app-tournament-editor',
  templateUrl: './tournament-editor.component.html',
  styleUrls: ['./tournament-editor.component.scss']
})
export class TournamentEditorComponent implements OnInit {
  @Input() tournament: ITournament = <ITournament>{};
  @Output() tournamentChanged: EventEmitter<any> = new EventEmitter<any>();
  tournamentForm: FormGroup;

  constructor(private fb: FormBuilder, private tournamentService: TournamentService) { }

  ngOnInit() {
    this.tournamentForm = this.fb.group({
      id: [this.tournament.id],
      name: [this.tournament.name, [Validators.required]],
      startDate: [this.tournament.startDate, [Validators.required]],
      endDate: [this.tournament.endDate, [Validators.required]],
      location: [this.tournament.location]
    });
  }

  save() {
    this.tournamentService.save(this.tournamentForm.value).subscribe(result => {
      this.tournamentChanged.emit(result);
    });
  }

  delete() {
    this.tournamentService.delete(this.tournamentForm.value).subscribe(result => {
      this.tournamentChanged.emit(result);
    })
  }

  close() {
    this.tournamentChanged.emit(this.tournament);
  }
}
