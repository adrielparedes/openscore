import { CrearUsuario } from './../../model/crear-usuario';
import { UsuarioService } from './../../services/usuario.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  templateUrl: 'register.component.html'
})
export class RegisterComponent {

  registro: FormGroup;

  constructor(private usuarioService: UsuarioService, private fb: FormBuilder) {

    this.registro = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      pais: ['', Validators.required],
      email: ['', Validators.email],
      confirmacionEmail: ['', Validators.email],
      password: ['', Validators.required, Validators.minLength(6)],
      confirmacionPassword: ['', Validators.required, Validators.minLength(6)]
    });
  }

  registrar() {
    if (this.registro.valid) {
      const crearUsuario: CrearUsuario = this.registro.value;
      this.usuarioService.registrar(crearUsuario);
    }
  }

}
