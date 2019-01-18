import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from "typeorm";
import { ConfigurationService } from "../administration/configuration.service";
import { TournamentService } from "../../graph/tournament/tournament.service";
import { ScoreService } from "../../graph/score/score.service";
import { DisplayController } from "./display.controller";
import { TeamInDiscipline } from '../../graph/schedule/team-in-discipline.model';

const displayConfig = {
  name: 'display', value: JSON.stringify({
    display1: `{{~#list current len=1 ~}}
  {{#center ~}}
    {{~#size 4~}}<em>{{team.name}}</em>{{~/size}}
    {{#size 2~}}
      {{division.name}} {{discipline.name}}
    {{~/size}}
  {{~/center~}}
  {{~/list~}}
  {{#if current.length}}{{#center ~}}
  -----------------------------
  {{~/center~}}{{/if}}
  {{#list next len=2 ~}}
  {{~#size 1~}}
    <em>{{team.name}}</em>
    {{division.name}} {{discipline.name}}
  {{~/size~}}
  {{~/list}}`,
    display2: `{{#list published len=1}}
  {{#center}}
    {{#size 3~}}<em>{{team.name}}</em>{{~/size}}
    {{#size 2~}}
      {{division.name}} {{discipline.name}}
    {{~/size}}
  {{~/center~}}
  {{#if team}}{{#center ~}}
  -----------------------------
  {{~/center~}}{{/if}}
  {{#center ~}}
    {{#size 5~}}
      <b>{{#fix total len=3}}{{/fix}}</b>
    {{~/size}}
  {{/center}}
{{/list}}` })
};

const testData = [
  {
    "id": "225",
    "sortNumber": 0,
    "startNumber": 0,
    "markDeleted": false,
    "startTime": 1521374205000,
    "type": 2,
    "disciplineId": "4",
    "team": { "id": "57", "name": "Sola-r1", "class": 2 },
    "scores": [
      { "id": 532, "participantId": "225", "scoreGroupId": 1, "value": 0.7, "updated": 1521374298000 },
      { "id": 533, "participantId": "225", "scoreGroupId": 2, "value": 0.7, "updated": 1521374298000 },
      { "id": 534, "participantId": "225", "scoreGroupId": 3, "value": 0.7, "updated": 1521374298000 },
      { "id": 535, "participantId": "225", "scoreGroupId": 4, "value": 0.7, "updated": 1521374298000 },
      { "id": 536, "participantId": "225", "scoreGroupId": 5, "value": 0.7, "updated": 1521374298000 },
      { "id": 537, "participantId": "225", "scoreGroupId": 6, "value": 0.7, "updated": 1521374298000 }
    ],
    "discipline": { "id": "4", "name": "Frittstående", "sortOrder": 0 },
    "division": { "name": "Mix Rekrutt", "scorable": true }
  },
  {
    "id": "226",
    "sortNumber": 1,
    "startNumber": 1,
    "markDeleted": false,
    "type": 2,
    "disciplineId": 5,
    "team": { "id": "89", "name": "Stavanger-a", "class": 2 },
    "discipline": { "id": "5", "name": "Trampett", "sortOrder": 1 },
    "division": { "name": "Mix Aspirant", "scorable": false }
  },
  {
    "id": "297",
    "sortNumber": 2,
    "startNumber": 2,
    "markDeleted": false,
    "type": 2,
    "disciplineId": 4,
    "team": { "id": "70", "name": "Sandved-jr", "class": 2 },
    "discipline": { "id": "4", "name": "Frittstående", "sortOrder": 0 },
    "division": { "name": "Kvinner Junior", "scorable": true }
  }
];

export class TeamInDisciplineRepository extends Repository<TeamInDiscipline> { }

describe("DisplayController", () => {
  let testModule: TestingModule;
  let controller: DisplayController;

  beforeAll(async () => {
    const configurationServiceStub = { getOneById: () => Promise.resolve(displayConfig) };
    const tournamentServiceStub = { findOneById: () => ({}) };
    const scoreServiceStub = { getTotalScore: () => Promise.resolve("7.000") };

    testModule = await Test.createTestingModule({
      providers: [
        DisplayController,
        { provide: 'TeamInDisciplineRepository', useClass: TeamInDisciplineRepository },
        { provide: ConfigurationService, useValue: configurationServiceStub },
        { provide: TournamentService, useValue: tournamentServiceStub },
        { provide: ScoreService, useValue: scoreServiceStub }
      ]
    }).compile();
    controller = testModule.get<DisplayController>(DisplayController);
  });

  it("can load instance", () => {
    expect(controller).toBeTruthy();
  });

  describe("display", () => {
    it("Will return current participant", () => {
      const repository = testModule.get(TeamInDisciplineRepository);
      spyOn(repository, "find").and.callFake(() => (testData));
      controller.display(1, 1).then(res => {
        expect(res).toContain(`<em>Sola-r1</em>`);
      })
    });

    it("Will display latest published participant", () => {
      const repository = testModule.get(TeamInDisciplineRepository);
      const data = JSON.parse(JSON.stringify(testData));
      data[0].endTime = 1521374205000;
      data[0].publishTime = 1521374205000;
      spyOn(repository, "find").and.callFake(() => (data));
      controller.display(1, 2).then(res => {
        expect(res).toContain(`7.000`);
      })
    });
  });
});
