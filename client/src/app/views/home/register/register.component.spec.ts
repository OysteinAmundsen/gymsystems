// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';

// import { SharedModule } from 'app/shared/shared.module';
// import { RegisterComponent } from './register.component';

// import { UserService } from 'app/services/api';
// import { ErrorHandlerService } from 'app/services/http';
// import { UserServiceStub } from 'app/services/api/user/user.service.stub';
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

// describe('views.home:RegisterComponent', () => {
//   let component: RegisterComponent;
//   let fixture: ComponentFixture<RegisterComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         SharedModule,
//         RouterTestingModule,
//       ],
//       providers: [
//         { provide: UserService, useClass: UserServiceStub },
//         { provide: GraphService, useClass: MockGraph },
//         ErrorHandlerService,

//       ]
//     })
//       .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(RegisterComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   // it('should be created', () => {
//   //   expect(component).toBeTruthy();
//   // });
// });
