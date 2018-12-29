import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { Role } from "app/model";
import { UserService } from "app/services/api";
import { ClubEditorComponent } from "app/views/configure/club/club-editor/club-editor.component";
import { ActivatedRoute } from "@angular/router";
import { GraphService } from "app/services/graph.service";
import { TroopEditorComponent } from "./troop-editor.component";
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';

describe("views.configure.club:TroopEditorComponent", () => {
  let component: TroopEditorComponent;
  let fixture: ComponentFixture<TroopEditorComponent>;
  const iTroopStub = { id: {}, name: {}, gymnasts: {} };
  const iClubStub = { id: 1, name: 'Test club' };

  beforeEach(() => {
    const activatedRouteStub = { params: of({ id: 1 }) };
    const userServiceStub = { getMe: () => of({ id: 1, name: 'Test user', role: Role.Organizer, club: iClubStub }) };
    const clubEditorComponentStub = { clubSubject: of(iClubStub) };
    const graphServiceStub = {
      getData: () => of({ troop: iTroopStub }),
      saveData: () => of({}),
      deleteData: () => of({})
    };

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
      ],
      declarations: [TroopEditorComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: UserService, useValue: userServiceStub },
        { provide: ClubEditorComponent, useValue: clubEditorComponentStub },
        { provide: GraphService, useValue: graphServiceStub }
      ]
    });
    fixture = TestBed.createComponent(TroopEditorComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it("subscriptions defaults to: []", () => {
    expect(component.subscriptions).toEqual([]);
  });

  it("memberListHidden defaults to: true", () => {
    expect(component.memberListHidden).toEqual(true);
  });

  it("troopsCount defaults to: 0", () => {
    expect(component.troopsCount).toEqual(0);
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      const userServiceStub: UserService = fixture.debugElement.injector.get(UserService);
      const graphServiceStub: GraphService = fixture.debugElement.injector.get(GraphService);

      spyOn(userServiceStub, "getMe").and.callThrough();
      spyOn(graphServiceStub, "getData").and.callThrough();
      spyOn(component, "troopReceived");
      component.ngOnInit();
      expect(userServiceStub.getMe).toHaveBeenCalled();
      expect(graphServiceStub.getData).toHaveBeenCalled();
      expect(component.troopReceived).toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("makes expected calls", () => {
      component.ngOnInit();

      const graphServiceStub: GraphService = fixture.debugElement.injector.get(GraphService);
      spyOn(graphServiceStub, "deleteData").and.callThrough();
      spyOn(component, "close");
      component.delete();
      expect(graphServiceStub.deleteData).toHaveBeenCalled();
      expect(component.close).toHaveBeenCalled();
    });
  });
});
