import { AuthService } from './../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from './../../../services/usuario.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {

  form: FormGroup
  token = '';
  email = '';
  recover: boolean;

  constructor(private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute) {

    this.activatedRoute.queryParams.subscribe(params => {
      const recover = params['recover'];
      const email = params['email'];
      if (recover !== undefined && this.email !== undefined) {
        this.token = recover;
        this.email = email;
        this.recover = true;
      } else {
        this.recover = false;
      }
    });
  }

  ngOnInit() {
    if (!this.recover) {
      this.form = this.fb.group({
        oldPassword: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmacionPassword: ['', [Validators.required, Validators.minLength(6)]]
      });
    } else {
      this.form = this.fb.group({
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmacionPassword: ['', [Validators.required, Validators.minLength(6)]]
      });
    }
  }

  submit() {

    if (this.form.valid) {
      const value = this.form.value;
      if (this.recover) {
        this.usuarioService.recoverPassword({
          email: this.email,
          token: this.token,
          password: value.password,
          confirmacionPassword: value.confirmacionPassword,
        }).subscribe(res => {
          console.log(res);
        }, err => {
          this.toastr.error(err.error.description);
        });
      } else {
        this.usuarioService.updatePassword({
          oldPassword: value.oldPassword,
          password: value.password,
          confirmacionPassword: value.confirmacionPassword,
        }).subscribe(res => {
          this.toastr.success('Password changed successfuly');
          this.authService.logout();
          this.router.navigate(['/pages/login']);
        }, err => {
          this.toastr.error(err.error.description);
        });
      }
    } else {
      this.toastr.error('Passwords are invalid');
    }

  }

  isInvalid(controlName: string) {
    const control = this.form.controls[controlName];
    return control.invalid && control.dirty;
  }

}
