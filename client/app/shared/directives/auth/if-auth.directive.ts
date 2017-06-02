import { Directive, Input, TemplateRef, ViewContainerRef, OnDestroy } from '@angular/core';
import { UserService } from 'app/services/api';
import { Role } from 'app/services/model/IUser';
import { Subscription } from 'rxjs/Subscription';

@Directive({
  selector: '[appIfAuth]'
})
export class IfAuthDirective implements OnDestroy {
  visible = false;
  roles = Role;

  userSubscription: Subscription;

  @Input() set appIfAuth(value) {
    const me = this;
    if (this.userSubscription) { this.userSubscription.unsubscribe(); }
    this.userSubscription = this.userService.getMe().subscribe(user => {
      if (value != null) {
        const showOnAuth = !!value;
        const role = typeof value === 'string' && me.roles[value] ? me.roles[value] : null;

        if ((showOnAuth && !user) || (!showOnAuth && user) || (role && user && user.role < role)) {
          me.hide();
        } else {
          // Alls good. Add template to DOM
          me.show();
        }
      }
    });
  }

  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef, private userService: UserService) {  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  hide() {
    this.viewContainer.clear();
    this.visible = false;
  }

  show() {
    if (!this.visible) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.visible = true;
    }
  }
}
