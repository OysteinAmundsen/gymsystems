import { Injectable } from '@angular/core';
import { MatSort } from '@angular/material';

@Injectable()
export class MemberStateService {
  sort: MatSort = null;
  constructor() { }

}
