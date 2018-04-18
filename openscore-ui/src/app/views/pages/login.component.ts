import { Component } from '@angular/core';
import { UsuarioService } from './../../services/usuario.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginUsuario } from './../../model/login-usuario';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'login.component.html'
})
export class LoginComponent {

  loginForm: FormGroup;
  error = false;

  constructor(private usuarioService: UsuarioService, private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.loginForm.valueChanges.subscribe(change => { this.error = false });
  }

  login() {
    if (this.loginForm.valid) {
      const loginUsuario : LoginUsuario = this.loginForm.value;

      this.usuarioService.login(loginUsuario).subscribe(res => {
        console.log("respuesta ok")
        console.log(res)
        this.router.navigate(['/dashboard']);
      }, error => {
        console.log("respuesta no ok")
        this.error = true;
        console.log(error);
      });
    } else {
      this.error = true;
    }
  }
}
