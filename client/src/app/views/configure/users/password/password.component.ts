import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { GraphService } from 'app/shared/services/graph.service';
import { MatDialogRef, ErrorStateMatcher } from '@angular/material';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder, private graph: GraphService, public dialogRef: MatDialogRef<PasswordComponent>) { }

  ngOnInit() {
    this.form = this.fb.group({
      oldPassword: ['', [Validators.required]],
      password: ['', [Validators.required]],
      repeatPassword: ['', [Validators.required]]
    }, {
        validator: (c: AbstractControl) => {
          return c.get('password').value === c.get('repeatPassword').value ? null : { repeatPassword: { invalid: true } };
        }
      });
  }

  matcher(): ErrorStateMatcher {
    return {
      isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        return control.invalid || (control.parent.errors && control.parent.errors.repeatPassword && control.parent.errors.repeatPassword.invalid);
      }
    }
  }

  save() {
    const formVal = this.form.value;
    this.graph.post(`{changePassword(old: "${formVal.oldPassword}", password: "${formVal.password}")}`).subscribe(
      ret => this.close(),
      err => this.close());
  }

  close() {
    this.dialogRef.close();
  }

  @HostListener('keyup', ['$event'])
  onKeyup(evt: KeyboardEvent) {
    if (evt.key === 'Escape') {
      this.close();
    }
  }
}
