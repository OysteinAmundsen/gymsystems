import { Component, OnInit, ElementRef, Renderer2, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Role, ParticipationType, ITeamInDiscipline, IUser, ITournament } from 'app/model';
import { GraphService } from 'app/services/graph.service';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit/*, AfterViewInit*/ {

  get overlay() {
    return this.elmRef.nativeElement.closest('.cdk-overlay-pane');
  }

  get container() {
    return this.elmRef.nativeElement.closest('.mat-dialog-container');
  }

  roles = Role;
  get participant(): ITeamInDiscipline { return this.data.participant; }
  get currentUser(): IUser { return this.data.currentUser; }
  get tournament(): ITournament { return this.data.tournament; }


  get isTraining() { return this.participant.type === ParticipationType.Training; }
  get isPublished() { return this.participant.publishTime != null; }
  get hasEnded() { return this.participant.endTime != null; }
  get hasStarted() { return this.participant.startTime == null; }
  get hasScores() {
    const score = parseFloat(this.participant.total);
    return this.participant.scores && this.participant.scores.length && score > 0;
  }

  constructor(
    public elmRef: ElementRef,
    private dialogRef: MatDialogRef<ContextMenuComponent>,
    private renderer: Renderer2,
    private graph: GraphService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.renderer.setStyle(this.overlay, 'top', this.data.mouseY + 'px');
    this.renderer.setStyle(this.overlay, 'left', this.data.mouseX + 'px');
  }

  close() {
    if (this.dialogRef) { this.dialogRef.close(); }
  }

  delete() {
    if (this.currentUser.role >= Role.Organizer || this.participant.publishTime == null) {
      this.participant.scores = [];
      return this.graph.deleteData('ParticipantScores', this.participant.id).subscribe(() => this.close());
    }
  }

  rollback() {
    if (this.currentUser.role >= Role.Organizer) {
      this.graph.post(`{rollback(tournamentId: ${this.participant.tournamentId}, participantId: ${+this.participant.id})}`).subscribe(() => this.close());
    }
  }

  canEdit() { return this.data.canEdit(this.participant); }
  edit() { return this.data.edit(this.participant); }
  canStart() { return this.data.canStart(this.participant, this.data.rowIndex); }
  start() { return this.data.start(this.participant, null); }
  stop() { return this.data.stop(this.participant, null); }
  publish() { return this.data.publish(this.participant, null); }
}
