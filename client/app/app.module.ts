import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// Modules
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';

// Services
import { ScoreService, TournamentService, DisciplineService, DivisionService, TeamsService } from './api';
// import { RoleService, UserService } from './api';

// Components
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,

    AppRoutingModule,
    SharedModule
  ],
  providers: [ScoreService, TournamentService, DisciplineService, DivisionService, TeamsService],
  // providers: [UserService, RoleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
