import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule, MatButtonModule, MatListModule, MatSelectModule, MatOptionModule, MatProgressSpinnerModule } from '@angular/material';

// Module dependencies
import { SharedModule } from 'app/shared/shared.module';
import { ConfigureRoutingModule } from './configure-routing.module';
import { TournamentModule } from './tournament/tournament.module';
import { UsersModule } from './users/users.module';
import { AdvancedModule } from './advanced/advanced.module';
import { ClubModule } from './club/club.module';

// Module components
import { ConfigureComponent } from './configure.component';
import { ConfigureDisplayComponent } from './display/configure-display.component';
import { MacroDialogComponent } from './display/macro-dialog/macro-dialog.component';
import { VenueModule } from 'app/views/configure/venue/venue.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ConfigureRoutingModule,

    MatProgressSpinnerModule,
    MatCardModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatListModule,

    // Packaged modules
    SharedModule,
    VenueModule,
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
