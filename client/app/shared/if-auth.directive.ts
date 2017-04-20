import { Directive, Renderer, ElementRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserService } from "app/api";
import { Role } from "app/api/model/IUser";

@Directive({
  selector: '[appIfAuth]'
})
export class IfAuthDirective {
  @Input() set appIfAuth(value) {
    const me = this;
    this.userService.getMe().subscribe(user => {
      if (value != null) {
        const showOnAuth = !!value;
        const role = typeof value === 'string' && me.roles[value] ? me.roles[value] : null;

        if (showOnAuth && !user) me.hide();          // `*ngIf="user"`
        else if (!showOnAuth && user) me.hide();     // `*ngIf="!user"`
        else if (role && user && user.role < role) { // `*ngIf="user.role !== xxx"` - Check role as well as authentication
          me.hide();
        }

        // Alls good. Add template to DOM
        else me.show();
      }
    });
  }

  visible: boolean = false;
  roles = Role;

  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef, private userService: UserService) {  }

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
