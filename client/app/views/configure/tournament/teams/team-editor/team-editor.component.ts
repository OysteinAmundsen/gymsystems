import { Component, OnInit, EventEmitter, Output, Input, HostListener, ElementRef, ViewChildren, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { TournamentService, TeamsService, DisciplineService, DivisionService, ClubService, UserService } from 'app/services/api';
import { MediaService } from 'app/services/media.service';

import { IDiscipline } from 'app/services/model/IDiscipline';
import { IDivision } from 'app/services/model/IDivision';
import { DivisionType } from 'app/services/model/DivisionType';
import { ITeam } from 'app/services/model/ITeam';
import { IClub } from 'app/services/model/IClub';
import { IUser } from 'app/services/model/IUser';
import { IMedia } from 'app/services/model/IMedia';

@Component({
  selector: 'app-team-editor',
  templateUrl: './team-editor.component.html',
  styleUrls: ['./team-editor.component.scss'],
})
export class TeamEditorComponent implements OnInit, OnDestroy {
  @Input() team: ITeam = <ITeam>{};
  @Output() teamChanged: EventEmitter<any> = new EventEmitter<any>();
  @ViewChildren('selectedDisciplines') selectedDisciplines;
  teamForm: FormGroup;
  disciplines: IDiscipline[];
  divisions: IDivision[] = [];
  _currentUser: IUser;
  get currentUser() { return this._currentUser; }
  set currentUser(value) {
    this._currentUser = value;
    this.selectedClub = value.club;
  }
  userSubscription: Subscription;
  clubs = [];
  selectedClub: IClub;
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
    private clubService: ClubService,
    private userService: UserService,
    private divisionService: DivisionService,
    private disciplineService: DisciplineService,
    private mediaService: MediaService) { }

  ngOnInit() {
    this.userSubscription = this.userService.getMe().subscribe(user => this.currentUser = user);
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
      club: [this.team.club ? this.team.club.name : '', [Validators.required]],
      ageDivision: [ageDivision ? ageDivision.id : null, [Validators.required]],
      genderDivision: [genderDivision ? genderDivision.id : null, [Validators.required]],
      disciplines: [this.team.disciplines],
      tournament: [this.team.tournament]
    });

    // Clubs should be registerred in all upper case
    this.teamForm.controls['club']
      .valueChanges
      .distinctUntilChanged()
      .subscribe((t: string) => {
        this.teamForm.controls['club'].setValue(t.toUpperCase());
      });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  fileAdded($event, discipline: IDiscipline) {
    let fileList: FileList = (<HTMLInputElement>event.target).files;
    const upload = () => {
      this.teamService.uploadMedia(fileList[0], this.teamForm.value, discipline).subscribe(
        data => this.reloadTeam(),
        error => console.log(error)
      )
    }
    if(fileList.length > 0) {
      if (this.teamForm.dirty) { this.save().then(upload); }
      else { upload(); }
    }
  }

  reloadTeam() {
    const ageDivision = this.team.divisions.find(d => d.type === DivisionType.Age);
    const genderDivision = this.team.divisions.find(d => d.type === DivisionType.Gender);
    this.teamService.getById(this.team.id).subscribe(team => {
      this.team = team;
      this.teamForm.setValue({
        id: this.team.id,
        name: this.team.name,
        club: this.team.club ? this.team.club.name : '',
        ageDivision: ageDivision ? ageDivision.id : null,
        genderDivision: genderDivision ? genderDivision.id : null,
        disciplines: this.team.disciplines,
        tournament: this.team.tournament
      });
    });
  }

  hasMedia(discipline: IDiscipline) {
    return this.getMedia(discipline) != null;
  }

  getMedia(discipline: IDiscipline): IMedia {
    return this.team.media ? this.team.media.find(m => m.discipline.id === discipline.id) : null;
  }

  isPlaying(media: IMedia) {
    return this.mediaService.whatsPlaying ? this.mediaService.whatsPlaying.id === media.id : false;
  }

  previewMedia(discipline: IDiscipline) {
    const media = this.getMedia(discipline);
    this.mediaService.play(media);
  }

  stopMedia(discipline: IDiscipline) {
    const media = this.getMedia(discipline);
    this.mediaService.stop();
  }

  removeMedia(discipline: IDiscipline) {
    this.stopMedia(discipline);
    this.teamService.removeMedia(this.team, discipline).subscribe(() => this.reloadTeam());
  }

  async save() {
    const team = this.teamForm.value;

    // Compute division set
    const ageDivision = this.divisions.find(d => d.id === team.ageDivision);
    const genderDivision = this.divisions.find(d => d.id === team.genderDivision);
    team.divisions = [JSON.parse(JSON.stringify(ageDivision)), JSON.parse(JSON.stringify(genderDivision))];
    delete team.ageDivision;
    delete team.genderDivision;

    // Get club
    if (!this.selectedClub) {
      const club = await this.clubService.saveClub(team.club).toPromise();
      team.club = club;
    }
    else {
      delete this.selectedClub.teams;
      team.club = this.selectedClub;
    }

    // Compute discipline set
    team.disciplines = this.selectedDisciplines
      .filter((elm: ElementRef) => (<HTMLInputElement>elm.nativeElement).checked)
      .map((elm: ElementRef) => {
        const disciplineId = (<HTMLInputElement>elm.nativeElement).attributes.getNamedItem('data').nodeValue;
        return this.disciplines.find(d => d.id === +disciplineId);
      });

    // Apply media
    team.media = this.team.media;

    // Save team
    this.teamService.save(team).subscribe(result => {
      this.teamChanged.emit(result);
    });
  }

  disciplinesChanged() {
    this.teamForm.markAsDirty();
  }
  getClubMatchesFn() {
    let me = this;
    return function (items, currentValue: string, matchText: string) {
      if (!currentValue) { return items; }
      return me.clubService.findByName(currentValue);
    }
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
