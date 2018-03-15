# REST API

The GymSystems application is based on a RESTful backend and a rich client. This document describes the REST API associated with the application

Every url should be prefixed `https://www.gymsystems.org/api`

## ClubController

| Method | Url                                 | Auth        | Description |
|-------:|:------------------------------------|:------------|:------------|
| GET    | /clubs/                             |             | Fetch all clubs |
| GET    | /clubs/:clubId                      |             | retreiving one club based on id |
| POST   | /clubs/                             |             | creating a new club |
| PUT    | /clubs/:clubId                      |             | updating a club |
| DELETE | /clubs/:clubId                      | Admin       | removing a club |
| GET    | /clubs/:clubId/members              |             | retreiving members from a club |
| GET    | /clubs/:clubId/available-members    | Club        | retreiving members in a club not yet assigned to troops |
| POST   | /clubs/:clubId/members              | Club        | adding/updating one member to your club |
| DELETE | /clubs/:clubId/members/:id          | Club        | removing a member from your club  |
| GET    | /clubs/:clubId/troop                |             | retreiving a clubs troops |
| POST   | /clubs/:clubId/troop                | Club        | storing clubs troops |
| DELETE | /clubs/:clubId/troop/:id            | Club        | removing a troop |

## ConfigurationController

| Method | Url                                 | Auth        | Description |
|-------:|:------------------------------------|:------------|:------------|
| GET    | /configuration                      |             | retreiving all configuration in the system |
| GET    | /configuration/:id                  |             | retreiving a configuration value based on a given key |
| POST   | /configuration                      | Admin       | creating a new configuration value |
| PUT    | /configuration/:id                  | Admin       | updating a configuration value based on a given key |
| DELETE | /configuration/:id                  | Admin       | removing a configuration value |

## DisciplineController

| Method | Url                                 | Auth        | Description |
|-------:|:------------------------------------|:------------|:------------|
| GET    | /disciplines                        |             | fetching all disciplines |
| GET    | /disciplines/tournament/:id         |             | fetching all disciplines registerred to a given tournament |
| GET    | /disciplines/:id                    |             | fetching one discipline based on a given id |
| POST   | /disciplines                        | Organizer   | creating a discipline |
| PUT    | /disciplines/:id                    | Organizer   | updating a discipline |
| DELETE | /disciplines/:id                    | Organizer   | removing a discipline |

## DisplayController

| Method | Url                                 | Auth        | Description |
|-------:|:------------------------------------|:------------|:------------|
| GET    | /display/:tournamentId              |             | get the rendered display results for all monitors in the given tournament |
| GET    | /display/:tournamentId/:id          |             | get the rendered display results for one of the monitors in the given tournament. |

## DivisionController

| Method | Url                                 | Auth        | Description |
|-------:|:------------------------------------|:------------|:------------|
| GET    | /divisions                          |             | all divisions registerred in the system. |
| GET    | /divisions/tournament/:id           |             | retreiving all divisions bound to a given tournament object |
| GET    | /divisions/:id                      |             | retreiving one division |
| POST   | /divisions                          | Organizer   | creating one division |
| PUT    | /divisions/:id                      | Organizer   | updating a division |
| DELETE | /divisions/:id                      | Organizer   | removing one division |

## MediaController

| Method | Url                                 | Auth        | Description |
|-------:|:------------------------------------|:------------|:------------|
| POST   | /media/upload/:teamId/:disciplineId | Club        | uploading media for a team in a discipline |
| DELETE | /media/:teamId/:disciplineId        | Club        | removing media for a team in a discipline |
| GET    | /media/:teamId/:disciplineId        |             | retreiving audio stream for a team in a discipline |

## ScheduleController

| Method | Url                                 | Auth        | Description |
|-------:|:------------------------------------|:------------|:------------|
| GET    | /schedule                           |             | retreiving all schedules. |
| GET    | /schedule/tournament/:id            |             | retreiving the schedule for a tournament |
| GET    | /schedule/:id                       |             | retreiving one entry in the schedule |
| POST   | /schedule/:id/start                 | Secretariat | starting the execution of a team in the schedule |
| POST   | /schedule/:id/stop                  | Secretariat | stopping the execution of a team in the schedule |
| POST   | /schedule/:id/publish               | Secretariat | publishing scores |
| POST   | /schedule                           | Organizer   | creating entries in the schedule |
| PUT    | /schedule/:id                       | Organizer   | updating one entry in the schedule |
| DELETE | /schedule/:id                       | Organizer   | removing one entry in the schedule |
| DELETE | /schedule/tournament/:id            | Organizer   | erasing the entire schedule for a tournament |

## ScoreController

| Method | Url                                 | Auth        | Description |
|-------:|:------------------------------------|:------------|:------------|
| GET    | /score/participant/:id              |             | fetching the scores for a team in a discipline |
| POST   | /score/participant/:id              | Secretariat | setting points for a team in a discipline |
| DELETE | /score/participant/:id              | Secretariat | removing scores from a team in a discipline |
| GET    | /score/participant/:id/rollback     | Organizer   | rolling back tournament execution to a specific point in the schedule |

## ScoreGroupController

| Method | Url                                 | Auth        | Description |
|-------:|:------------------------------------|:------------|:------------|
| GET    | /scoregroups                        |             | fetching all scoregroups |
| GET    | /scoregroups/discipline/:id         |             | fetching all scoregroups for a specific discipline |
| GET    | /scoregroups/:id                    |             | fetching one specific scoregroup |
| POST   | /scoregroups                        | Organizer   | creating a new scoregroup |
| PUT    | /scoregroups/:id                    | Organizer   | updating a scoregroup |
| DELETE | /scoregroups/:id                    | Organizer   | removing one scoregroup |

## TeamController

| Method | Url                                 | Auth        | Description |
|-------:|:------------------------------------|:------------|:------------|
| GET    | /teams                              |             | retreiving all teams |
| GET    | /teams/tournament/:id               |             | retreiving all teams registerred to a tournament |
| GET    | /teams/my/tournament/:id            | Club        | retreiving all teams belonging to my club |
| GET    | /teams/:id                          |             | retreiving one team |
| PUT    | /teams/:id                          | Club        | updating one team |
| POST   | /teams                              | Club        | creating one team |
| DELETE | /teams/:id                          | Club        | removing one team |

## TournamentController

| Method | Url                                 | Auth        | Description |
|-------:|:------------------------------------|:------------|:------------|
| GET    | /tournaments                        |             | retreiving all tournaments |
| GET    | /tournaments/list/past              |             | retreiving all tournaments past |
| GET    | /tournaments/list/current           |             | retreiving all current tournaments |
| GET    | /tournaments/list/future            |             | retreiving all future tournaments |
| GET    | /tournaments/:id                    |             | fetching one specific tournament |
| POST   | /tournaments                        | Organizer   | creating one tournament |
| PUT    | /tournaments/:id                    | Organizer   | updating a tournament |
| DELETE | /tournaments/:id                    | Organizer   | removing a tournament |

## UserController

| Method | Url                                 | Auth        | Description |
|-------:|:------------------------------------|:------------|:------------|
| POST   | /users/login                        |             | login       |
| POST   | /users/logout                       |             | logout      |
| GET    | /users                              | Organizer   | retreiving all users |
| GET    | /users/me                           |             | retreiving data for currently logged in user |
| GET    | /users/get/:id                      | Any Login   | retreiving a specific user |
| PUT    | /users/:id                          | Any Login   | updating a user |
| POST   | /users                              | Organizer   | creating a user (from the users panel) |
| POST   | /users/register                     |             | registering a new user (from the registration panel) |
| DELETE | /users/:id                          | Organizer   | removing a user |

## VenueController

| Method | Url                                 | Auth        | Description |
|-------:|:------------------------------------|:------------|:------------|
| GET    | /venue                              |             | retreiving all venues |
| GET    | /venue/tournament/:id               |             | retreiving all venues used by tournament |
| GET    | /venue/:id                          |             | retreiving one venue |
| PUT    | /venue/:id                          |             | updating one venue |
| POST   | /venue                              |             | creating one venue |
| DELETE | /venue/:id                          |             | removing one venue |
