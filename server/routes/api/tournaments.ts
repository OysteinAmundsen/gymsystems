'use strict';

import * as express from 'express';
let hal = require('hal');

export default function tournamentController(router: express.Router, baseName: string) {
  let tournaments = [
    {
      "id": 1,
      "name": "NM Troppsgymnastikk 2016",
      "startDate": "2016-07-07",
      "location": "Haugesund",
      "teams": [
        {
          "name": "Haugesund1",
          "disciplines": [
            { "name": "Frittstående" },
            { "name": "Tumbling" },
            { "name": "Trampett" }
          ],
          "trainer": { "name": "Per Gunnar", "role": { "name": "Trainer", "authLevel": 5 } }
        },
        {
          "name": "Haugesund2",
          "disciplines": [
            { "name": "Frittstående" },
            { "name": "Tumbling" },
            { "name": "Trampett" }
          ],
          "trainer": { "name": "Per Gunnar", "role": { "name": "Trainer", "authLevel": 5 } }
        },
        {
          "name": "Haugesund3",
          "disciplines": [
            { "name": "Frittstående" },
            { "name": "Tumbling" },
            { "name": "Trampett" }
          ],
          "trainer": { "name": "Per Gunnar", "role": { "name": "Trainer", "authLevel": 5 } }
        }
      ]
    },
    {
      "id": 2,
      "name": "Ingeborgs minnepokal",
      "startDate": "2016-10-24",
      "location": "Haugesund",
      "teams": [
        {
          "name": "Haugesund1",
          "disciplines": [
            { "name": "Frittstående" },
            { "name": "Tumbling" },
            { "name": "Trampett" }
          ],
          "trainer": { "name": "Per Gunnar", "role": { "name": "Trainer", "authLevel": 5 } }
        },
        {
          "name": "Haugesund2",
          "disciplines": [
            { "name": "Frittstående" },
            { "name": "Tumbling" },
            { "name": "Trampett" }
          ],
          "trainer": { "name": "Per Gunnar", "role": { "name": "Trainer", "authLevel": 5 } }
        },
        {
          "name": "Haugesund3",
          "disciplines": [
            { "name": "Frittstående" },
            { "name": "Tumbling" },
            { "name": "Trampett" }
          ],
          "trainer": { "name": "Per Gunnar", "role": { "name": "Trainer", "authLevel": 5 } }
        }
      ]
    }
  ];

  router.get(baseName + '/tournaments', function (req: express.Request, res: express.Response) {
    let resource = new hal.Resource({ name: "tournaments", data: tournaments }, '/api/tournaments');
    res.send(resource.toJSON());
  });
}
