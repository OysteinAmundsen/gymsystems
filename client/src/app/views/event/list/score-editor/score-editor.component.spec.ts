// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { Component } from '@angular/core';
// import { MatCardModule } from '@angular/material';

// import { ScoreEditorComponent } from './score-editor.component';
// import { AppModuleTest } from 'app/app.module.spec';
// import { ITeamInDiscipline, IScoreGroup, IScore, Operation, Classes } from 'app/model';
// import { GraphService } from 'app/shared/services/graph.service';
// import { GraphServiceApi } from 'app/shared/services/graph.service.api';
// import { of } from 'rxjs';

// class MockGraph implements GraphServiceApi {
//   getData(queryStr: string) {
//     return of({
//       getScoreGroups: <IScoreGroup[]>[{ id: 1, type: 'E', operation: Operation.Addition }],
//       getScores: <IScore[]>[{ id: 1, value: 2 }]
//     });
//   }
//   deleteData(type: string, id: number) { return of(); }
//   saveData(type: string, data: any, returnVal: string) { return of(); }
//   post(query: string) { return of(); }
//   delete(query: string) { return of(); }
// }

// @Component({
//   selector: 'app-cmp',
//   template: `<app-score-editor [participant]='participant'></app-score-editor>`
// })
// class WrapperComponent {
//   participant: ITeamInDiscipline = <ITeamInDiscipline>{
//     disciplineId: 1,
//     id: 1,
//     team: { class: Classes.National }
//   }
// }
// describe('ScoreEditorComponent', () => {
//   let component: ScoreEditorComponent;
//   let fixture: ComponentFixture<WrapperComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         AppModuleTest,
//         MatCardModule,
//       ],
//       declarations: [
//         WrapperComponent,
//         ScoreEditorComponent
//       ],
//       providers: [
//         { provide: GraphService, useClass: MockGraph }
//       ]
//     })
//       .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(WrapperComponent);
//     component = fixture.debugElement.children[0].componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
