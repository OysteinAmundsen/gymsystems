import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'app/api';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {

  constructor(private router: Router, userService: UserService) {
    userService.logout().subscribe(() => this.reroute(), () => this.reroute());
  }

  reroute() {
    this.router.navigate(['/']);
  }
}
