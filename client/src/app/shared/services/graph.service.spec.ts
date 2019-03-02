import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GraphService } from "./graph.service";
import { of } from 'rxjs';
import { CommonService } from 'app/shared/services/common.service';
import { Apollo } from 'apollo-angular';

describe("shared.services:GraphService", () => {
  let service: GraphService;

  beforeEach(() => {
    const apolloStub = {
      query: () => of({}),
      mutate: () => of({})
    }

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        GraphService,
        { provide: Apollo, useValue: apolloStub }
      ]
    });
    service = TestBed.get(GraphService);
  });

  it("can load instance", () => {
    expect(service).toBeTruthy();
  });

  describe('parser', () => {
    it('parses an object properly', () => {
      const now = new Date();
      const value = {
        id: 1,
        name: 'Test object',
        description: `Testing
        multiline
        fields`,
        date: now,
        members: [{ id: 1, name: 'Test' }, { id: 2, name: 'Test2' }],
        club: { id: 1, name: 'Test' },
        obj: { some: '', other: '', properties: '' }
      }
      expect(CommonService.compressString(service.jsonToGql(value)))
        .toBe(CommonService.compressString(`{
          id: "1",
          name: "Test object",
          description: "Testing\\nmultiline\\nfields",
          date: ${now.getTime()},
          members: [{id: "1"}, {id: "2"}],
          clubId: "1",
          obj: { some: "", other: "", properties: ""}
        }`));
    });
  })
});
