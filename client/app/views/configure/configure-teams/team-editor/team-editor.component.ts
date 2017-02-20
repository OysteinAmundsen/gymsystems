import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TeamsService } from 'app/api';
import { ITeam } from 'app/api/model';

@Component({
  selector: 'app-team-editor',
  templateUrl: './team-editor.component.html',
  styleUrls: ['./team-editor.component.scss']
})
export class TeamEditorComponent implements OnInit {
  @Input() team: ITeam = <ITeam>{};
  @Output() teamChanged: EventEmitter<any> = new EventEmitter<any>();
  teamForm: FormGroup;

  constructor(private fb: FormBuilder, private teamService: TeamsService) { }

  ngOnInit() {
    this.teamForm = this.fb.group({
      id: [this.team.id],
      name: [this.team.name, [Validators.required]]
    });
  }

  save() {
    this.teamService.save(this.teamForm.value).subscribe(result => {
      this.teamChanged.emit(result);
    });
  }

  delete() {
    this.teamService.delete(this.teamForm.value).subscribe(result => {
      this.teamChanged.emit(result);
    })
  }

  close() {
    this.teamChanged.emit(this.team);
  }
}
