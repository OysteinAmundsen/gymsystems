import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-save-button',
  templateUrl: './save-button.component.html',
  styleUrls: ['./save-button.component.scss']
})
export class SaveButtonComponent {
  @Input() disabled = false;
  @Input() buttonType: 'button' | 'submit' = 'button';

  constructor() { }
}
