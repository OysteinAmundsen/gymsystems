import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';

// Containing Modules
import { TournamentModule } from './tournament/tournament.module';
import { UsersModule } from './users/users.module';
import { AdvancedModule } from './advanced/advanced.module';
import { ClubModule } from './club/club.module';

// Routes
import { ConfigureRoutes } from './configure.routes';

// Components
import { ConfigureComponent } from './configure.component';
import { ConfigureDisplayComponent } from './display/configure-display.component';
import { MacroDialogComponent } from './display/macro-dialog/macro-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([...ConfigureRoutes]),

    SharedModule,
    TournamentModule,
    ClubModule,
    UsersModule,
    AdvancedModule
  ],
  declarations: [
    ConfigureComponent,
    ConfigureDisplayComponent,
    MacroDialogComponent
  ]
})
export class ConfigureModule { }
