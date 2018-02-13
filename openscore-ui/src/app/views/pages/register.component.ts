import { CrearUsuario } from './../../model/crear-usuario';
import { UsuarioService } from './../../services/usuario.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  templateUrl: 'register.component.html'
})
export class RegisterComponent {

  registro: FormGroup;
  error = false;

  constructor(private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private router: Router) {

    this.registro = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      pais: ['', Validators.required],
      email: ['', Validators.email],
      confirmacionEmail: ['', Validators.email],
      password: ['', Validators.required],
      confirmacionPassword: ['', Validators.required]
    });


    this.registro.valueChanges.subscribe(change => { this.error = false });
  }

  registrar() {
    if (this.registro.valid) {
      const crearUsuario: CrearUsuario = this.registro.value;
      this.usuarioService.registrar(crearUsuario).subscribe(res => {
        console.log(res)
        this.router.navigate(['/dashboard']);
      }, error => {
        this.error = true;
        console.log(error);
      });
    } else {
      this.error = true;
    }
  }

}
