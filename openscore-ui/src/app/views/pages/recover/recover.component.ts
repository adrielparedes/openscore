import { UsuarioService } from './../../../services/usuario.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.scss']
})
export class RecoverComponent implements OnInit {

  form: FormGroup

  constructor(private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submit() {
    if (this.form.valid) {
      this.usuarioService.sendRecoverEmail(this.form.value.email).subscribe(res => {
        this.toastr.success('Email sent  successfuly');
      }, err => {
        this.toastr.error(err.error.description);
      });
    } else {
      this.toastr.error('Email ' + this.form.value.email + ' is not valid');
    }
  }

  isInvalid(controlName: string) {
    const control = this.form.controls[controlName];
    return control.invalid && control.dirty;
  }

}
