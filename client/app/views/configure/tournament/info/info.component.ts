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

  private splitValue(value, selection: {start, end, startOfLine, endOfLine}) {
    return {
      start: value.substring(0, selection.start),
      selection: value.substring(selection.start, selection.end),
      end: value.substring(selection.end),

      beforeLine: value.substring(0, selection.startOfLine),
      line: value.substring(selection.startOfLine, selection.endOfLine),
      afterLine: value.substring(selection.endOfLine)
    };
  }

  private getSelection() {
    const text:string  = this.tournament['description_' + this.lng];
    const start:number = this.infoText.nativeElement.selectionStart;
    const end:number   = this.infoText.nativeElement.selectionEnd;
    const startOfLine  = text.substring(0, start).lastIndexOf('\n') + 1;
    const endOfLine    = text.substring(end).indexOf('\n') || text.length;
    return {
      start: start,
      end: end,
      startOfLine: startOfLine > -1 ? startOfLine : 0,
      endOfLine: endOfLine > -1 ? endOfLine : text.length
    }
  }

  returnfocus(start, end) {
    this.infoText.nativeElement.focus();
    setTimeout(() => this.infoText.nativeElement.setSelectionRange(start, end));
  }

  bold() {
    const selection = this.getSelection();
    let text = this.splitValue(this.tournament['description_' + this.lng], selection);

    this.tournament['description_' + this.lng] = `${text.start}**${text.selection}**${text.end}`;
    this.returnfocus(selection.start, selection.end + 4);
  }
  italic() {
    const selection = this.getSelection();
    let text = this.splitValue(this.tournament['description_' + this.lng], selection);

    this.tournament['description_' + this.lng] = `${text.start}*${text.selection}*${text.end}`;
    this.returnfocus(selection.start, selection.end + 2);
  }

  toggleHeaders() {
    const selection = this.getSelection();
    const text = this.splitValue(this.tournament['description_' + this.lng], selection);
    const line = text.line.substring(text.line.lastIndexOf('#') + 1).trim();
    const headers = text.line.substring(0, text.line.lastIndexOf('#') + 1)
    const head = headers.length > 4 ? '' : headers + '# ';

    this.tournament['description_' + this.lng] = `${text.beforeLine}${head}${line}${text.afterLine}`;
    this.returnfocus(selection.startOfLine, selection.startOfLine);
  }

  @HostListener('keydown', ['$event'])
  onKeypress(event: KeyboardEvent) {
    if (event.ctrlKey) {
      switch(event.key) {
        case 'b': event.preventDefault(); this.bold(); break;
        case 'i': event.preventDefault(); this.italic(); break;
        case 'h': event.preventDefault(); this.toggleHeaders(); break;
        case 's': event.preventDefault(); this.save(); break;
      }
    }
  }
}
