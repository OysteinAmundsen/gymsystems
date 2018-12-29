// /* tslint:disable:no-unused-variable */
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';

// import { AppModuleTest } from 'app/app.module.spec';
// import { ScoreSystemModule } from '../score-system.module';
// import { ScoreGroupEditorComponent } from './score-group-editor.component';

// import { ErrorHandlerService } from 'app/services/http';
// import { GraphService } from 'app/services/graph.service';
// import { GraphServiceApi } from 'app/services/graph.service.api';
// import { of } from 'rxjs';

// class MockGraph implements GraphServiceApi {
//   getData(queryStr: string) { return of(); }
//   deleteData(type: string, id: number) { return of(); }
//   saveData(type: string, data: any, returnVal: string) { return of(); }
//   post(query: string) { return of(); }
//   delete(query: string) { return of(); }
// }


// describe('views.configure.tournament:ScoreGroupEditorComponent', () => {
//   let component: ScoreGroupEditorComponent;
//   let fixture: ComponentFixture<ScoreGroupEditorComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         AppModuleTest,
//         ScoreSystemModule,
//         RouterTestingModule,
//       ],
//       providers: [
//         ErrorHandlerService,
//         { provide: GraphService, useClass: MockGraph }
//       ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ScoreGroupEditorComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should be created', () => {
//     expect(component).toBeTruthy();
//   });
// });
