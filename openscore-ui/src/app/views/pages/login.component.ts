import { Component } from '@angular/core';
import { UsuarioService } from './../../services/usuario.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginUsuario } from './../../model/login-usuario';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  templateUrl: 'login.component.html'
})
export class LoginComponent {

  loginForm: FormGroup;
  error = false;

  constructor(private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private router: Router,
    private storageService: AuthService) {

    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.loginForm.valueChanges.subscribe(change => { this.error = false });
  }

  goToRegistro() {
    this.router.navigate(['/pages/register']);
  }

  onEnter(event) {
    this.login();
  }

  recover() {
    this.router.navigate(['/pages/recover']);
  }

  login() {
    if (this.loginForm.valid) {
      const loginUsuario: LoginUsuario = this.loginForm.value;

      this.usuarioService.login(loginUsuario).subscribe(res => {
        this.storageService.setToken(res.data.token);
        this.router.navigate(['/dashboard']);
      }, error => {
        this.error = true;
      });
    } else {
      this.error = true;
    }
  }
}
