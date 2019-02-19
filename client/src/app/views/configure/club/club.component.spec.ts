import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { UserService } from "app/shared/services/api";
import { GraphService } from "app/shared/services/graph.service";
import { ClubComponent } from "./club.component";
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Role, IUser } from 'app/model';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material';
import { IfAuthDirective } from 'app/shared/directives';
import { Router } from '@angular/router';

describe("views.configure.club:ClubComponent", () => {
  let component: ClubComponent;
  let fixture: ComponentFixture<ClubComponent>;

  beforeEach(() => {
    const userServiceStub = { getMe: () => of({ id: 1, name: 'Test user', role: Role.Organizer, club: { id: 1 } }) };
    const graphServiceStub = { getData: () => of({}) };

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        MatTableModule,
        RouterTestingModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
      ],
      declarations: [ClubComponent, IfAuthDirective],
      providers: [
        { provide: UserService, useValue: userServiceStub },
        { provide: GraphService, useValue: graphServiceStub }
      ]
    });
    fixture = TestBed.createComponent(ClubComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it("subscriptions defaults to: []", () => {
    expect(component.subscriptions).toEqual([]);
  });

  describe("ngOnInit", () => {
    it("only admins can view this panel", () => {
      const routerStub = fixture.debugElement.injector.get(Router);
      const userServiceStub = fixture.debugElement.injector.get(UserService);
      const graphServiceStub = fixture.debugElement.injector.get(GraphService);

      spyOn(userServiceStub, "getMe").and.callThrough();
      spyOn(routerStub, "navigate");
      spyOn(graphServiceStub, "getData");
      component.ngOnInit();
      expect(userServiceStub.getMe).toHaveBeenCalled();
      expect(routerStub.navigate).toHaveBeenCalled();
      expect(graphServiceStub.getData).not.toHaveBeenCalled();
    });

    it("makes expected calls when admin", () => {
      const routerStub = fixture.debugElement.injector.get(Router);
      const userServiceStub = fixture.debugElement.injector.get(UserService);
      const graphServiceStub = fixture.debugElement.injector.get(GraphService);

      userServiceStub.getMe = () => of(<IUser>{ id: 1, name: 'Admin user', role: Role.Admin }); // Me is now an admin

      spyOn(userServiceStub, "getMe").and.callThrough();
      spyOn(routerStub, "navigate");
      spyOn(graphServiceStub, "getData").and.callThrough();
      component.ngOnInit();
      expect(userServiceStub.getMe).toHaveBeenCalled();
      expect(routerStub.navigate).not.toHaveBeenCalled();
      expect(graphServiceStub.getData).toHaveBeenCalled();
    });
  });

  describe("addClub", () => {
    it("makes expected calls", () => {
      const routerStub = fixture.debugElement.injector.get(Router);
      spyOn(routerStub, "navigate");
      component.addClub();
      expect(routerStub.navigate).toHaveBeenCalled();
    });
  });
});
