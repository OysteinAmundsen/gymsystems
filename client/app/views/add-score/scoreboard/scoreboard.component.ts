import { ScoreService } from 'app/api/score.service';
import { IScoreGroup } from 'app/api/model/iScoreGroup';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, ElementRef, Input } from "@angular/core";

/**
 *
 */
@Component({
  selector: 'scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss']
})
export class ScoreboardComponent implements OnInit {
  grandTotal: number = 0;
  scoreForm: FormGroup;

  @Input() scoreGroups: IScoreGroup[];

  constructor(private setup: ScoreService, private element: ElementRef) { }

  ngOnInit() {
    let me = this;
    me.scoreForm = me.setup.toFormGroup(me.scoreGroups);
    me.scoreForm.valueChanges.subscribe(function (value: any) {
      setTimeout(function () {
        me.grandTotal = 0;
        me.scoreGroups.forEach(function (group: IScoreGroup) {
          if (group.type != 'HJ') {
            me.grandTotal += group.avg;
          } else {
            me.grandTotal -= group.avg;
          }
        });
      }, 10);
    });
  }

  selectGroup(group: IScoreGroup): void {
    let scoreGroupComponent = this.element.nativeElement.querySelector('.group_' + group.type);
    scoreGroupComponent.querySelector('input').select();
  }

  onSubmit(values: any) {

  }
}
