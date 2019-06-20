import { Routes } from '@angular/router';
import { RoleGuard, RoleData } from 'app/shared/guards/role-guard';
import { Role } from 'app/model';

import { TournamentComponent } from './tournament.component';
import { TournamentEditorComponent } from './tournament-editor/tournament-editor.component';
import { DisciplineRoutes } from './disciplines/disciplines.routes';
import { DivisionsComponent } from './divisions/divisions.component';
import { TeamsComponent } from './teams/teams.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { InfoComponent } from './info/info.component';
import { TeamEditorComponent } from './teams';
import { ScorecardsComponent } from './scorecards/scorecards.component';
import { AwardsComponent } from './awards/awards.component';

export const TournamentRoutes: Routes = [
  {
    path: 'tournament', children: [
      { path: '', component: TournamentComponent, pathMatch: 'full', canActivate: [RoleGuard], data: { role: Role.Club.valueOf() } as RoleData },
      { path: 'add', component: TournamentEditorComponent, canActivate: [RoleGuard], data: { role: Role.Organizer.valueOf() } as RoleData },
      {
        path: ':id', component: TournamentEditorComponent, children: [
          { path: '', redirectTo: 'teams', pathMatch: 'full', canActivate: [RoleGuard], data: { role: Role.Club.valueOf() } as RoleData },
          { path: 'divisions', component: DivisionsComponent, canActivate: [RoleGuard], data: { role: Role.Organizer.valueOf() } as RoleData },
          ...DisciplineRoutes,
          { path: 'teams', component: TeamsComponent, canActivate: [RoleGuard], data: { role: Role.Club.valueOf() } as RoleData },
          { path: 'teams/add', component: TeamEditorComponent, canActivate: [RoleGuard], data: { role: Role.Organizer.valueOf() } as RoleData },
          { path: 'teams/:id', component: TeamEditorComponent, canActivate: [RoleGuard], data: { role: Role.Organizer.valueOf() } as RoleData },
          { path: 'schedule', component: ScheduleComponent, canActivate: [RoleGuard], data: { role: Role.Organizer.valueOf() } as RoleData },
          { path: 'awards', component: AwardsComponent, canActivate: [RoleGuard], data: { role: Role.Organizer.valueOf() } as RoleData },
          { path: 'info', component: InfoComponent, canActivate: [RoleGuard], data: { role: Role.Organizer.valueOf() } as RoleData },
          { path: 'scorecards', component: ScorecardsComponent, canActivate: [RoleGuard], data: { role: Role.Organizer.valueOf() } as RoleData },
        ]
      },
    ]
  }
];
