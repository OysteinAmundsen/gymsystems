import { Component, OnInit, ElementRef, Input } from "@angular/core";
import { ControlGroup, FORM_DIRECTIVES } from "@angular/common";

import { SetupService, ScoreGroup } from "../setup.service";
import { FaComponent } from "../../shared";
import { ScoreGroupComponent } from "./score-group.component";

/**
 *
 */
@Component({
  moduleId   : module.id,
  selector   : 'scoreboard',
  templateUrl: 'scoreboard.component.html',
  styleUrls  : ['scoreboard.component.css'],
  directives : [FORM_DIRECTIVES, ScoreGroupComponent, FaComponent],
  providers:  [SetupService]
})
export class ScoreboardComponent implements OnInit {
  grandTotal:number = 0;
  scoreForm:ControlGroup;

  @Input() scoreGroups:Array<ScoreGroup>;

  constructor(private setup:SetupService, private element:ElementRef) {}

  ngOnInit() {
    let me = this;
    me.scoreForm   = me.setup.toControlGroup(me.scoreGroups);
    me.scoreForm.valueChanges.subscribe(function (value:any) {
      setTimeout(function () {
        me.grandTotal = 0;
        me.scoreGroups.forEach(function (group:ScoreGroup) {
          if (group.type != 'HJ') {
            me.grandTotal += group.avg;
          } else {
            me.grandTotal -= group.avg;
          }
        });
      }, 10);
    });
  }

  selectGroup(group:ScoreGroup) : void {
    let scoreGroupComponent = this.element.nativeElement.querySelector('.group_' + group.type);
    scoreGroupComponent.querySelector('input').select();
  }

  onSubmit(values:any) {

  }
}
