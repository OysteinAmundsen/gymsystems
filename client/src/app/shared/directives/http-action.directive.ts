import { Directive, ElementRef, HostListener } from '@angular/core';
import { HttpStateService } from '../interceptors/http-state.service';
import { HttpAction } from '../interceptors/http-action.model';

@Directive({
  selector: '[appHttpAction]'
})
export class HttpActionDirective {
  previousIcon = '';

  constructor(private el: ElementRef, private state: HttpStateService) { }

  @HostListener('click') onClick() {
    if (this.el.nativeElement.getAttribute('disabled') !== 'disabled') {
      // Listen for http completion
      const sub = this.state.httpAction.subscribe((action: HttpAction) => {
        !action.isComplete ? this.actionStart() : this.actionDone();
        if (action.failed) { this.actionFailed(); }

        sub.unsubscribe(); // Cleanup
      });
    }
  }

  private actionStart() {
    if (['A', 'BUTTON', 'INPUT'].includes(this.el.nativeElement.nodeName)) {
      // Host element is a button type element. Change button icon to network indicator.
      const icon = this.el.nativeElement.querySelector('.fa.fa-fw');
      if (icon) {
        this.previousIcon = icon.classList;
        icon.classList.value = 'fa fa-fw fa-circle-o-notch fa-spin';
      }

      // Disable button type
      this.el.nativeElement.setAttribute('disabled', 'disabled');
    } else {
      // Place indicator
      this.el.nativeElement.classList.addClass('spinner');

    }
  }

  private actionDone() {
    if (['A', 'BUTTON', 'INPUT'].includes(this.el.nativeElement.nodeName)) {
      // Host element is a button type element. Remove indicator and change back to original icon
      const icon = this.el.nativeElement.querySelector('.fa.fa-fw');
      if (icon && this.previousIcon) {
        icon.classList.value = this.previousIcon;
      }

      // Re-enable button type
      this.el.nativeElement.removeAttribute('disabled');
    } else {
      // Remove indicator
      this.el.nativeElement.classList.removeClass('spinner');
    }
  }

  private actionFailed() {
    // Notify of failed attempt
  }
}
