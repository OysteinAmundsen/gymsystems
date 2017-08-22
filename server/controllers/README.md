# REST API

The GymSystems application is based on a RESTful backend and a rich client. This document describes the REST API associated with the application

Every url should be prefixed `https://www.gymsystems.org/api`

## ClubController

| Method | Url                                 | Auth        | Description |
|-------:|:------------------------------------|:------------|:------------|
| GET    | /clubs/                             |             |             |
| GET    | /clubs/:clubId                      |             |             |
| POST   | /clubs/                             |             |             |
| PUT    | /clubs/:clubId                      |             |             |
| DELETE | /clubs/:clubId                      | Admin       |             |
| GET    | /clubs/:clubId/members              |             |             |
| POST   | /clubs/:clubId/members              |             |             |
| DELETE | /clubs/:clubId/members/:id          |             |             |
| GET    | /clubs/:clubId/teams                |             |             |

## ConfigurationController

| Method | Url                                 | Auth        | Description |
|-------:|:------------------------------------|:------------|:------------|
| GET    | /configuration                      |             |             |
| GET    | /configuration/:id                  |             |             |
| POST   | /configuration                      | Admin       |             |
| PUT    | /configuration/:id                  | Admin       |             |
| DELETE | /configuration/:id                  | Admin       |             |

## DisciplineController

| Method | Url                                 | Auth        | Description |
|-------:|:------------------------------------|:------------|:------------|
| GET    | /disciplines                        |             |             |
| GET    | /disciplines/tournament/:id         |             |             |
| GET    | /disciplines/:id                    |             |             |
| POST   | /disciplines                        | Organizer   |             |
| PUT    | /disciplines/:id                    | Organizer   |             |
| DELETE | /disciplines/:id                    | Organizer   |             |

## DisplayController

| Method | Url                                 | Auth        | Description |
|-------:|:------------------------------------|:------------|:------------|
| GET    | /display/:tournamentId              |             |             |
| GET    | /display/:tournamentId/:id          |             |             |

## DivisionController

| Method | Url                                 | Auth        | Description |
|-------:|:------------------------------------|:------------|:------------|
| GET    | /divisions                          |             |             |
| GET    | /divisions/tournament/:id           |             |             |
| GET    | /divisions/:id                      |             |             |
| POST   | /divisions                          | Organizer   |             |
| PUT    | /divisions/:id                      | Organizer   |             |
| DELETE | /divisions/:id                      | Organizer   |             |

## MediaController

| Method | Url                                 | Auth        | Description |
|-------:|:------------------------------------|:------------|:------------|
| POST   | /media/upload/:teamId/:disciplineId | Club        |             |
| DELETE | /media/:teamId/:disciplineId        | Club        |             |
| GET    | /media/:teamId/:disciplineId        |             |             |

## ScheduleController

| Method | Url                                 | Auth        | Description |
|-------:|:------------------------------------|:------------|:------------|
| GET    | /schedule                           |             |             |
| GET    | /schedule/tournament/:id            |             |             |
| GET    | /schedule/:id                       |             |             |
| POST   | /schedule/:id/start                 | Secretariat |             |
| POST   | /schedule/:id/stop                  | Secretariat |             |
| POST   | /schedule/:id/publish               | Secretariat |             |
| POST   | /schedule                           | Organizer   |             |
| PUT    | /schedule/:id                       | Organizer   |             |
| DELETE | /schedule/:id                       | Organizer   |             |
| DELETE | /schedule/tournament/:id            | Organizer   |             |

## ScoreController

| Method | Url                                 | Auth        | Description |
|-------:|:------------------------------------|:------------|:------------|
| GET    | /score/participant/:id              |             |             |
| POST   | /score/participant/:id              | Secretariat |             |
| DELETE | /score/participant/:id              | Secretariat |             |
| GET    | /score/participant/:id/rollback     | Organizer   |             |

## ScoreGroupController

| Method | Url                                 | Auth        | Description |
|-------:|:------------------------------------|:------------|:------------|
| GET    | /scoregroups                        |             |             |
| GET    | /scoregroups/discipline/:id         |             |             |
| GET    | /scoregroups/:id                    |             |             |
| POST   | /scoregroups                        | Organizer   |             |
| PUT    | /scoregroups/:id                    | Organizer   |             |
| DELETE | /scoregroups/:id                    | Organizer   |             |

## TeamController

| Method | Url                                 | Auth        | Description |
|-------:|:------------------------------------|:------------|:------------|
| GET    | /teams                              |             |             |
| GET    | /teams/tournament/:id               |             |             |
| GET    | /teams/my/tournament/:id            | Club        |             |
| GET    | /teams/:id                          |             |             |
| PUT    | /teams/:id                          | Club        |             |
| POST   | /teams                              | Club        |             |
| DELETE | /teams/:id                          | Club        |             |

## TournamentController

| Method | Url                                 | Auth        | Description |
|-------:|:------------------------------------|:------------|:------------|
| GET    | /tournaments                        |             |             |
| GET    | /tournaments/list/past              |             |             |
| GET    | /tournaments/list/current           |             |             |
| GET    | /tournaments/list/future            |             |             |
| GET    | /tournaments/:id                    |             |             |
| POST   | /tournaments                        | Organizer   |             |
| PUT    | /tournaments/:id                    | Organizer   |             |
| DELETE | /tournaments/:id                    | Organizer   |             |

## UserController

| Method | Url                                 | Auth        | Description |
|-------:|:------------------------------------|:------------|:------------|
| POST   | /users/login                        |             |             |
| POST   | /users/logou                        |             |             |
| GET    | /users                              | Organizer   |             |
| GET    | /users/me                           |             |             |
| GET    | /users/get/:id                      | RequireAuth |             |
| PUT    | /users:id                           | RequireAuth |             |
| POST   | /users                              | Organizer   |             |
| POST   | /users/register                     |             |             |
| DELETE | /users:id                           | Organizer   |             |
