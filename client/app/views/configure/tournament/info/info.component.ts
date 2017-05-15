import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TournamentService } from 'app/services/api';
import { ITournament } from 'app/services/model/ITournament';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  tournament: ITournament;
  lng: string = this.translate.currentLang;
  @ViewChild('infoText') infoText;
  constructor(private route: ActivatedRoute, private tournamentService: TournamentService, private translate: TranslateService) { }

  ngOnInit() {
    this.route.parent.params.subscribe((params: any) => {
      if (this.tournamentService.selected) {
        this.tournament = this.tournamentService.selected
      }
      else if (params.id) {
        this.tournamentService.selectedId = +params.id;
        this.tournamentService.getById(params.id).subscribe(tournament => {
          this.tournament = tournament;
          this.tournamentService.selected = tournament;
        });
      }
    });
  }

  save() {
    this.tournamentService.save(this.tournament).subscribe(res => this.tournament = res);
  }

  setLang(lng) {
    const oldLng = this.lng;
    this.lng = lng;
    if (!this.tournament['description_' + lng]) {
      // Copy description over, to make translation easier.
      this.tournament['description_' + lng] = this.tournament['description_' + oldLng];
    }
  }

  private splitValue(value, selection: {start, end}) {
    return {
      start: value.substring(0, selection.start),
      selection: value.substring(selection.start, selection.end),
      end: value.substring(selection.end)
    };
  }

  private getSelection() {
    return {
      start: this.infoText.nativeElement.selectionStart,
      end: this.infoText.nativeElement.selectionEnd
    }
  }

  bold() {
    let text = this.splitValue(this.tournament['description_' + this.lng], this.getSelection());
    this.tournament['description_' + this.lng] = `${text.start}**${text.selection}**${text.end}`;
  }
  italic() {
    let text = this.splitValue(this.tournament['description_' + this.lng], this.getSelection());
    this.tournament['description_' + this.lng] = `${text.start}*${text.selection}*${text.end}`;
  }
  underline() {
    let text = this.splitValue(this.tournament['description_' + this.lng], this.getSelection());
    this.tournament['description_' + this.lng] = `${text.start}__${text.selection}__${text.end}`;
  }

  @HostListener('keydown', ['$event'])
  onKeypress(event: KeyboardEvent) {
    console.log(event.keyCode);
    if (event.ctrlKey) {
      switch(event.keyCode) {
        case 66: event.preventDefault(); this.bold(); break;
        case 73: event.preventDefault(); this.italic(); break;
        case 85: event.preventDefault(); this.underline(); break;
        case 83: event.preventDefault(); this.save(); break;
      }
    }
  }
}
