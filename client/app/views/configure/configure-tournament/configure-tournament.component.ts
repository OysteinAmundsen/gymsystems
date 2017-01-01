import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ITournament } from 'app/api/model/ITournament';
import { TournamentService } from 'app/api/tournament.service';

@Component({
  selector: 'app-configure-tournament',
  templateUrl: './configure-tournament.component.html',
  styleUrls: ['./configure-tournament.component.scss']
})
export class ConfigureTournamentComponent implements OnInit {
  tournamentList: ITournament[] = [];
  tournamentForm: FormGroup;
  selected: ITournament = <ITournament>{};
  showForm: boolean = false;

  constructor(private fb: FormBuilder, private tournamentService: TournamentService) {
    this.loadTournaments();
  }

  ngOnInit() {
    this.tournamentForm = this.fb.group({
      id:        [ this.selected.id ],
      name:      [ this.selected.name, [ Validators.required]],
      startDate: [ this.selected.startDate, [ Validators.required]],
      endDate:   [ this.selected.endDate, [ Validators.required]],
      location:  [ this.selected.location ],
      image:     [ this.selected.image ],
    });
  }

  loadTournaments() {
    this.tournamentService.all().subscribe(tournaments => this.tournamentList = tournaments);
  }

  setSelected(tournament: ITournament) {
    this.selected = tournament;
    if (!this.selected.image) { this.selected.image = null; }
    this.tournamentForm.setValue(this.selected);
    this.showForm = true;
  }

  addTournament() {
    this.setSelected(<ITournament>{
      id: null, name: null, startDate: null, endDate: null, location: null, image: null
    });
  }

  save(tournament: ITournament) {
    this.tournamentService.save(tournament)
      .subscribe(result => {
        this.showForm = false;
        this.loadTournaments();
      });
  }
}
