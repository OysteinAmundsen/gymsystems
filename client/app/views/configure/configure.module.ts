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

// Components
import { ConfigureComponent } from './configure.component';
import { ConfigureDisplayComponent } from './display/configure-display.component';
import { MacroDialogComponent } from './display/macro-dialog/macro-dialog.component';
import { ConfigureRoutingModule } from 'app/views/configure/configure-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ConfigureRoutingModule,

    // Packaged modules
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
