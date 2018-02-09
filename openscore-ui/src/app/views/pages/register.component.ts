import { CrearUsuario } from './../../model/crear-usuario';
import { UsuarioService } from './../../services/usuario.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  templateUrl: 'register.component.html'
})
export class RegisterComponent {

  registro: FormGroup;
  error = false;

  constructor(private usuarioService: UsuarioService, private fb: FormBuilder) {

    this.registro = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      pais: ['', Validators.required],
      email: ['', Validators.email],
      confirmacionEmail: ['', Validators.email],
      password: ['', Validators.required],
      confirmacionPassword: ['', Validators.required]
    });
  }

  registrar() {
    if (this.registro.valid) {
      const crearUsuario: CrearUsuario = this.registro.value;
      this.usuarioService.registrar(crearUsuario)
    }
  }

}
