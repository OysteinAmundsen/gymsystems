import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ITournament } from 'app/model';
import { TournamentEditorComponent } from '../tournament-editor/tournament-editor.component';
import { GraphService } from 'app/shared/services/graph.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  tournament: ITournament;
  lng: string = this.translate.currentLang;
  preview = false;
  original: string;
  @ViewChild('infoText') infoText;
  constructor(
    private parent: TournamentEditorComponent,
    private graph: GraphService,
    private translate: TranslateService) { }

  ngOnInit() {
    this.parent.tournamentSubject.subscribe(tournament => {
      if (tournament) {
        this.tournament = tournament;
        this.original = JSON.stringify([this.tournament.description_en, this.tournament.description_no]);
      }
    });
  }

  save() {
    if (this.tournament.description_en && !this.tournament.description_no) {
      this.tournament.description_no = this.tournament.description_en;
    }
    if (this.tournament.description_no && !this.tournament.description_en) {
      this.tournament.description_en = this.tournament.description_no;
    }
    this.graph.saveData('Tournament', this.tournament, `{id,name,description_en,description_no}`).subscribe(res => {
      this.tournament = res.saveTournament;
      this.original = JSON.stringify([this.tournament.description_en, this.tournament.description_no]);
    });
  }

  isChanged() {
    const current: string = JSON.stringify([this.tournament.description_en, this.tournament.description_no]);
    return current !== this.original;
  }

  setLang(lng) {
    const oldLng = this.lng;
    this.lng = lng;
    if (!this.tournament['description_' + lng]) {
      // Copy description over, to make translation easier.
      this.tournament['description_' + lng] = this.tournament['description_' + oldLng];
    }
  }

  private splitValue(value, selection: { start, end, startOfLine, endOfLine }) {
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
    const text: string = this.tournament['description_' + this.lng];
    const start: number = this.infoText.nativeElement.selectionStart;
    const end: number = this.infoText.nativeElement.selectionEnd;
    const startOfLine = text.substring(0, start).lastIndexOf('\n') + 1;
    const endOfLine = text.substring(end).indexOf('\n') || text.length;
    return {
      start: start,
      end: end,
      startOfLine: startOfLine > -1 ? startOfLine : 0,
      endOfLine: endOfLine > -1 ? endOfLine : text.length
    };
  }

  returnfocus(start, end) {
    this.infoText.nativeElement.focus();
    setTimeout(() => this.infoText.nativeElement.setSelectionRange(start, end));
  }

  bold() {
    const selection = this.getSelection();
    const text = this.splitValue(this.tournament['description_' + this.lng], selection);

    this.tournament['description_' + this.lng] = `${text.start}**${text.selection}**${text.end}`;
    this.returnfocus(selection.start, selection.end + 4);
  }
  italic() {
    const selection = this.getSelection();
    const text = this.splitValue(this.tournament['description_' + this.lng], selection);

    this.tournament['description_' + this.lng] = `${text.start}*${text.selection}*${text.end}`;
    this.returnfocus(selection.start, selection.end + 2);
  }

  toggleHeaders() {
    const selection = this.getSelection();
    const text = this.splitValue(this.tournament['description_' + this.lng], selection);
    const line = text.line.substring(text.line.lastIndexOf('#') + 1).trim();
    const headers = text.line.substring(0, text.line.lastIndexOf('#') + 1);
    const head = headers.length > 4 ? '' : headers + '# ';

    this.tournament['description_' + this.lng] = `${text.beforeLine}${head}${line}${text.afterLine}`;
    this.returnfocus(selection.startOfLine, selection.startOfLine);
  }

  @HostListener('keydown', ['$event'])
  onKeypress(event: KeyboardEvent) {
    if (event.ctrlKey) {
      switch (event.key) {
        case 'b': event.preventDefault(); this.bold(); break;
        case 'i': event.preventDefault(); this.italic(); break;
        case 'h': event.preventDefault(); this.toggleHeaders(); break;
        case 's': event.preventDefault(); this.save(); break;
      }
    }
  }
}
