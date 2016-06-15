import { Injectable } from '@angular/core';
import { FormBuilder, ControlGroup, Validators } from "@angular/common";

export interface ScoreGroup {
  header:string,
  type:string,
  scores:Array<Score>;
  avg?:number;
  total?:number;
}

export interface Score {
  shortName:string,
  max:number,
  min:number
}

/**
 *
 */
@Injectable()
export class SetupService {

  /**
   *
   * @param fb
   */
  constructor(private fb:FormBuilder) {}

  /**
   *
   * @returns {Array<ScoreGroup>}
   */
  getScoreGroups() {
    return <Array <ScoreGroup>>[
      {'header': 'Difficulty',  'type': 'D',  'scores': [{'shortName': 'D1', 'max': 5,  'min': 0}, {'shortName': 'D2', 'max': 5,  'min': 0}]},
      {'header': 'Execution',   'type': 'E',  'scores': [{'shortName': 'E1', 'max': 10, 'min': 0}, {'shortName': 'E2', 'max': 10, 'min': 0}, {'shortName': 'E3', 'max': 10, 'min': 0}, {'shortName': 'E4', 'max': 10, 'min': 0}]},
      {'header': 'Composition', 'type': 'C',  'scores': [{'shortName': 'C1', 'max': 5,  'min': 0}, {'shortName': 'C2', 'max': 5,  'min': 0}]},
      {'header': 'Reduction',   'type': 'HJ', 'scores': [{'shortName': 'HJ', 'max': 2,  'min': 0}]}
    ];
  }

  /**
   *
   * @param scoreGroups
   * @returns {ControlGroup}
   */
  toControlGroup(scoreGroups:Array<ScoreGroup>) : ControlGroup {
    let group = scoreGroups.reduce(function (previous:any, current:any, index:any) {
      return (<any>Object).assign(previous, current.scores.reduce(function (previous:any, current:any, index:any) {
        previous['field_' + current.shortName] = [0,
          Validators.compose([
            Validators.required,
            Validators.maxLength(3)/*,
            Validators.pattern('/^[0-9]+(\.?[0-9]{1,2})?$/')*/
          ])
        ];
        return previous;
      }, {}));
    }, {});
    return this.fb.group(group);
  }
}
