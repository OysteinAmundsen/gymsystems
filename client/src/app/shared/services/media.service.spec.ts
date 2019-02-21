import { TestBed, tick, fakeAsync } from "@angular/core/testing";
import { IMedia } from "app/model";
import { MediaService } from "./media.service";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { GraphService } from './graph.service';

describe("shared.services:MediaService", () => {
  let service: MediaService;
  const iMediaStub = <IMedia>{ id: 1, teamId: 1, disciplineId: 1 };

  beforeEach(() => {
    const graphServiceStub = {
      getData: () => of({}),
      deleteData: () => of({})
    };
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        MediaService,
        { provide: GraphService, useValue: graphServiceStub }
      ]
    });
    service = TestBed.get(MediaService);
  });

  it("can load instance", () => {
    expect(service).toBeTruthy();
  });

  it("isPaused should be false", () => {
    expect(service.isPaused).toBeFalsy();
  });

  describe("play", () => {
    it("makes expected calls", () => {
      service.play(iMediaStub);
      expect(service.whatsPlaying).toBe(iMediaStub);
      expect(service.audio.src).toContain(`/api/media?id=${iMediaStub.id}`)
    });
  });

  describe("stop", () => {
    it("makes expected calls", fakeAsync(() => {
      expect(service.whatsPlaying).toBeUndefined();
      service.play(iMediaStub);
      service.stop();
      tick(100 * 50);
      expect(service.whatsPlaying).toBeNull();
    }));
  });

  describe("restart", () => {
    it("makes expected calls", () => {
      service.play(iMediaStub);
      service.pause();

      spyOn(service, "play");
      service.restart();
      expect(service.play).toHaveBeenCalled();
    });
  });

  describe("togglePause", () => {
    it("makes expected calls", () => {
      service.play(iMediaStub);

      spyOn(service, "pause").and.callThrough();
      service.togglePause();
      expect(service.pause).toHaveBeenCalled();
      expect(service.isPaused).toBeTruthy();

      spyOn(service, "play").and.callThrough();
      service.togglePause();
      expect(service.play).toHaveBeenCalled();
      expect(service.isPaused).toBeFalsy();
    });
  });
});
