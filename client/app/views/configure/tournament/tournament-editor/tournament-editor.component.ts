import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { TournamentService } from 'app/api';
import { ITournament } from 'app/api/model/ITournament';

@Component({
  selector: 'app-tournament-editor',
  templateUrl: './tournament-editor.component.html',
  styleUrls: ['./tournament-editor.component.scss']
})
export class TournamentEditorComponent implements OnInit {
  @Input() tournament: ITournament = <ITournament>{};
  tournamentForm: FormGroup;
  isEdit: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private tournamentService: TournamentService) { }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      if (params.id) {
        this.tournamentService.getById(params.id).subscribe(tournament => {
          this.tournament = tournament;
          this.tournamentForm.setValue(tournament);
          this.tournamentService.selected = this.tournament;
        });
      } else {
        this.isEdit = true;
      }
    });

    // Create the form
    this.tournamentForm = this.fb.group({
      id: [this.tournament.id],
      name: [this.tournament.name, [Validators.required]],
      startDate: [this.tournament.startDate, [Validators.required]],
      endDate: [this.tournament.endDate, [Validators.required]],
      location: [this.tournament.location]
    });
  }

  save() {
    const formVal = this.tournamentForm.value;
    if (formVal.startDate.hasOwnProperty('momentObj')) {
      formVal.startDate = formVal.startDate.momentObj.utc().toISOString();
    }
    if (formVal.endDate.hasOwnProperty('momentObj')) {
      formVal.endDate = formVal.endDate.momentObj.utc().toISOString();
    }
    this.tournamentService.save(formVal).subscribe(result => {
      this.router.navigate(['../', result.id], { relativeTo: this.route });
    });
  }

  delete() {
    this.tournamentService.delete(this.tournamentForm.value).subscribe(result => {
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }

  cancel() {
    this.isEdit = false;
    if (!this.tournamentForm.value.id) {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === 27) {
      this.cancel();
    }
  }
}
