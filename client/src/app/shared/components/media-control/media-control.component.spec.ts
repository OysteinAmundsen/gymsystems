import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA, SimpleChanges } from "@angular/core";
import { MediaService } from "app/shared/services/media.service";
import { MediaControlComponent } from "./media-control.component";
import { of } from 'rxjs';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { IMedia } from 'app/model/IMedia';

describe("MediaControlComponent", () => {
  let component: MediaControlComponent;
  let fixture: ComponentFixture<MediaControlComponent>;

  beforeEach(() => {
    const mediaServiceStub = {
      upload: () => of({ id: 1 }),
      getMedia: () => Promise.resolve({ id: 1 }),
      whatsPlaying: { id: 1 },
      play: () => ({}),
      stop: () => ({}),
      remove: () => Promise.resolve(true)
    };

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
      ],
      declarations: [MediaControlComponent],
      providers: [
        { provide: MediaService, useValue: mediaServiceStub }
      ]
    });
    fixture = TestBed.createComponent(MediaControlComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it("showLabel defaults to: true", () => {
    expect(component.showLabel).toEqual(true);
  });

  it("_canUpload defaults to: false", () => {
    expect(component._canUpload).toEqual(false);
  });

  describe("ngOnChanges", () => {
    it("should load data when given input", () => {
      spyOn(component, "loadData");
      component.ngOnChanges(<SimpleChanges><unknown>{ clubId: 1, teamId: 1, disciplineId: 1, disciplineName: 'Trampett' });
      expect(component.loadData).toHaveBeenCalled();
    });
    it("should NOT load data when given media", () => {
      spyOn(component, "loadData");
      component.ngOnChanges(<SimpleChanges><unknown>{ media: { id: 1 } });
      expect(component.loadData).not.toHaveBeenCalled();
    });
  });

  describe("loadData", () => {
    it("makes expected calls", () => {
      const mediaServiceStub: MediaService = fixture.debugElement.injector.get(MediaService);
      spyOn(mediaServiceStub, "getMedia").and.callThrough();
      component.loadData();
      expect(mediaServiceStub.getMedia).toHaveBeenCalled();
    });
  });

  describe("isPrimaryMedia", () => {
    it("returns truthy when all given criterias are met", () => {
      component.clubId = 1;
      component.teamId = 1;
      component.disciplineId = 1;
      component.media = <IMedia>{ clubId: 1, teamId: 1, disciplineId: 1 };
      expect(component.isPrimaryMedia()).toBeTruthy();
    });
    it("returns falsy when NOT all given criterias are met", () => {
      component.clubId = 1;
      component.teamId = 1;
      component.disciplineId = 1;
      component.media = <IMedia>{ clubId: 1 };
      expect(component.isPrimaryMedia()).toBeFalsy();
    });
  });

  describe("play", () => {
    it("makes expected calls", () => {
      const mediaServiceStub: MediaService = fixture.debugElement.injector.get(MediaService);
      spyOn(mediaServiceStub, "play");
      component.play();
      expect(mediaServiceStub.play).toHaveBeenCalled();
    });
  });

  describe("stop", () => {
    it("makes expected calls", () => {
      const mediaServiceStub: MediaService = fixture.debugElement.injector.get(MediaService);
      spyOn(mediaServiceStub, "stop");
      component.stop();
      expect(mediaServiceStub.stop).toHaveBeenCalled();
    });
  });

  describe("remove", () => {
    it("makes expected calls", () => {
      const mediaServiceStub: MediaService = fixture.debugElement.injector.get(MediaService);
      spyOn(component, "stop");
      spyOn(component, "loadData");
      spyOn(mediaServiceStub, "remove").and.callFake(() => Promise.resolve(true));
      component.clubId = 1;
      component.teamId = 1;
      component.canUpload = true;
      component.remove().then(() => {
        expect(component.stop).toHaveBeenCalled();
        expect(mediaServiceStub.remove).toHaveBeenCalled();
        expect(component.loadData).toHaveBeenCalled();
      });
    });
  });
});
