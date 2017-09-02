import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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

// Shared components
import { MemberSelectorComponent } from './_shared/member-selector/member-selector.component';

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
    MacroDialogComponent,

    MemberSelectorComponent
  ]
})
export class ConfigureModule { }
