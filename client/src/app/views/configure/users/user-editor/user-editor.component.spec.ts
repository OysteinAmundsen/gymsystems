// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';

// import { AppModuleTest } from 'app/app.module.spec';
// import { ConfigureModule } from '../../configure.module';

// import { UserEditorComponent } from './user-editor.component';

// import { ErrorHandlerService } from 'app/shared/services/http';
// import { UserService } from 'app/shared/services/api';
// import { UserServiceStub } from 'app/shared/services/api/user/user.service.stub';
// import { GraphService } from 'app/shared/services/graph.service';
// import { GraphServiceApi } from 'app/shared/services/graph.service.api';
// import { of } from 'rxjs';

// class MockGraph implements GraphServiceApi {
//   getData(queryStr: string) { return of(); }
//   deleteData(type: string, id: number) { return of(); }
//   saveData(type: string, data: any, returnVal: string) { return of(); }
//   post(query: string) { return of(); }
//   delete(query: string) { return of(); }
// }

// describe('views.configure.users:UserEditorComponent', () => {
//   let component: UserEditorComponent;
//   let fixture: ComponentFixture<UserEditorComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         AppModuleTest,
//         ConfigureModule,
//         RouterTestingModule,
//       ],
//       providers: [
//         ErrorHandlerService,
//         { provide: UserService, useClass: UserServiceStub },
//         { provide: GraphService, useClass: MockGraph },
//       ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(UserEditorComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should be created', () => {
//     expect(component).toBeTruthy();
//   });
// });

