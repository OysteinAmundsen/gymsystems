// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { EventComponent } from '../event.component';
// import { ITeamInDiscipline, IDiscipline } from 'app/model';
// import { GraphService } from 'app/services/graph.service';
// import { EventService } from 'app/services/api/event/event.service';
// import { ResultsComponent } from './results.component';
// import { of } from 'rxjs';

// describe('ResultsComponent', () => {
//   let component: ResultsComponent;
//   let fixture: ComponentFixture<ResultsComponent>;
//   const iTeamInDisciplineStub = <ITeamInDiscipline>{
//     team: { class: {}, id: {} },
//     total: {},
//     publishTime: {}
//   };

//   beforeEach(() => {
//     const eventComponentStub = { tournamentId: {} };
//     const graphServiceStub = {
//       getData: () => of({
//         getDisciplines: <IDiscipline[]>[{ id: 1, name: '' }],
//         getSchedule: <ITeamInDiscipline[]>[{ id: 1, team: { id: 1, name: 'Test team' } }]
//       })
//     };
//     const eventServiceStub = { connect: () => of({}) };
//     TestBed.configureTestingModule({
//       schemas: [NO_ERRORS_SCHEMA],
//       declarations: [ResultsComponent],
//       providers: [
//         { provide: EventComponent, useValue: eventComponentStub },
//         { provide: GraphService, useValue: graphServiceStub },
//         { provide: EventService, useValue: eventServiceStub }
//       ]
//     });
//     fixture = TestBed.createComponent(ResultsComponent);
//     component = fixture.componentInstance;
//   });
//   it('can load instance', () => {
//     expect(component).toBeTruthy();
//   });
//   it('subscriptions defaults to: []', () => {
//     expect(component.subscriptions).toEqual([]);
//   });
//   it('schedule defaults to: []', () => {
//     expect(component.schedule).toEqual([]);
//   });
//   it('isLoading defaults to: false', () => {
//     expect(component.isLoading).toEqual(false);
//   });
//   describe('score', () => {
//     it('makes expected calls', () => {
//       spyOn(component, 'isPublished');
//       component.score(iTeamInDisciplineStub);
//       expect(component.isPublished).toHaveBeenCalled();
//     });
//   });
//   describe('ngOnInit', () => {
//     it('makes expected calls', () => {
//       const eventServiceStub: EventService = fixture.debugElement.injector.get(
//         EventService
//       );
//       spyOn(component, 'loadResults');
//       spyOn(eventServiceStub, 'connect');
//       component.ngOnInit();
//       expect(component.loadResults).toHaveBeenCalled();
//       expect(eventServiceStub.connect).toHaveBeenCalled();
//     });
//   });
//   describe('loadResults', () => {
//     it('makes expected calls', () => {
//       const graphServiceStub: GraphService = fixture.debugElement.injector.get(
//         GraphService
//       );
//       spyOn(graphServiceStub, 'getData');
//       component.loadResults();
//       expect(graphServiceStub.getData).toHaveBeenCalled();
//     });
//   });
// });
