import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { GraphService } from 'app/shared/services/graph.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {

  form: FormGroup;

  constructor(private fb: FormBuilder, private graph: GraphService, private router: Router) { }

  ngOnInit() {
    this.form = this.fb.group({
      'username': [''],
      'email': ['', [Validators.email]],
    }, {
        validator: (c: AbstractControl) => {
          return (c.get('username').value == null || c.get('username').value === '')
            && (c.get('email').value == null || c.get('email').value === '')
            ? { oneOf: { invalid: true } }
            : null;
        }
      });
  }

  matcher(): ErrorStateMatcher {
    return {
      isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        return control.invalid || (control.parent.errors && control.parent.errors.oneOf && control.parent.errors.oneOf.invalid);
      }
    }
  }

  reset() {
    const val = this.form.getRawValue();
    this.graph.post(`{resetPassword(username:"${val.username}",email:"${val.email}")}`).subscribe(res => {
      this.router.navigate(['/login']);
    })
  }
}
