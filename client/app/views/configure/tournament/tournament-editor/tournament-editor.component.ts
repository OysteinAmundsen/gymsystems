import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { TournamentService, UserService } from 'app/api';
import { ITournament } from 'app/api/model/ITournament';
import { Subscription } from "rxjs/Subscription";
import { IUser, Role } from "app/api/model/IUser";

@Component({
  selector: 'app-tournament-editor',
  templateUrl: './tournament-editor.component.html',
  styleUrls: ['./tournament-editor.component.scss']
})
export class TournamentEditorComponent implements OnInit, OnDestroy {
  @Input() tournament: ITournament = <ITournament>{};
  tournamentForm: FormGroup;
  user: IUser;
  userSubscription: Subscription;
  isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private tournamentService: TournamentService) { }

  ngOnInit() {
    this.userSubscription = this.userService.getMe().subscribe(user => this.user = user);
    this.route.params.subscribe((params: any) => {
      if (params.id) {
        this.tournamentService.selectedId = params.id;
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
      location: [this.tournament.location],
      // schedule: [this.tournament.schedule],
      // disciplines: [this.tournament.disciplines],
      // divisions: [this.tournament.divisions],
    });
  }

  ngOnDestroy() {
    this.tournamentService.selectedId = null;
    this.tournamentService.selected = null;
    this.userSubscription.unsubscribe();
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

  edit() {
    if (this.user && this.user.role >= Role.Admin) {
      this.isEdit = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.keyCode === 27) {
      this.cancel();
    }
  }
}
