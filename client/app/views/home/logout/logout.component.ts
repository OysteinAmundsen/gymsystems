import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'app/services/api';
import { ErrorHandlerService } from "app/services/config/ErrorHandler.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {

  constructor(private router: Router, userService: UserService, private errorHandler: ErrorHandlerService, private translate: TranslateService) {
    userService.logout().subscribe(() => this.reroute(), () => this.reroute());
  }

  reroute() {
    this.errorHandler.error = this.translate.instant('Logged out');
    this.router.navigate(['/']);
  }
}
