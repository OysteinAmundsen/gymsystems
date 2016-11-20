import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-configure-divisions',
  templateUrl: './configure-divisions.component.html',
  styleUrls: ['./configure-divisions.component.scss']
})
export class ConfigureDivisionsComponent implements OnInit {
  showForm: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  addDivision() {
    this.showForm = true;
  }
}
